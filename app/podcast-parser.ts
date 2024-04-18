import { FeedImage, Podcast, PodcastCategory, PodcastEpisode, PodcastEpisodeEnclosure, PodcastOwner } from "@/app/podcast";

export const getFeedText = async (path: string) => {
    console.log("Sending request to proxy server at", "/api/proxy/" + encodeURIComponent(path));
    const response = await fetch("/api/proxy/" + encodeURIComponent(path));
    
    const feedText = await response.text();
    return feedText;
};

const HHMMSS_REGEX = /^(\d\d):(\d\d):(\d\d)$/;

export type PodcastWithoutId = Omit<Podcast, "id">;

class PodcastParser {
    private parser = new DOMParser();

    private feed: Document;

    private resolver: XPathNSResolver;

    constructor(feedText: string) {
        this.feed = this.parser.parseFromString(feedText, "application/xml");
        this.resolver = globalThis.document.createNSResolver(this.feed.documentElement);
    }
    
    parse(): PodcastWithoutId {
        const channel = this.feed.evaluate(
            "/rss/channel",
            this.feed.documentElement,
            this.resolver,
            XPathResult.FIRST_ORDERED_NODE_TYPE
        ).singleNodeValue as Element;
        if (!channel) {
            throw new Error("No channel element found");
        }
        const title = this.getText("title", channel);
        const url = this.getText("link", channel);
        const description = this.getText("description", channel);
        const language = this.getText("language", channel,);
        const copyright = this.getText("copyright", channel);
        const categories = this.parseCategories(channel);
        const feedImage = this.parseFeedImage(channel);
        const author = this.getText("itunes:author", channel);
        const owner = this.parseOwner(channel);

        const itemsSnapshot = this.feed.evaluate(
            "./item",
            channel,
            this.resolver,
            XPathResult.ORDERED_NODE_SNAPSHOT_TYPE
        );

        const episodes: PodcastEpisode[] = [];

        for (let i = 0; i < itemsSnapshot.snapshotLength; i++) {
            const episode = this.parseEpisodeItem(
                itemsSnapshot.snapshotItem(i) as Element,
                i
            );
            if (episode === null) {
                continue;
            }
            episodes.push(episode);
        }
        
        const podcast: PodcastWithoutId = {
            url: url!,
            title: title!,
            author,
            owner,
            description,
            language,
            copyright,
            categories,
            episodes,
            image: feedImage,
        };

        console.log("parsed podcast:", podcast);
        return podcast;
    }

    private parseFeedImage(channelNode: Node): FeedImage|undefined {
        const imageNode = this.getSingleNode(
            "image",
            channelNode
        );

        if (!imageNode) {
            const itunesImageUrl = this.getAttribute("itunes:image", "href", channelNode);
            if (itunesImageUrl) {
                return {
                    url: itunesImageUrl,
                };
            }
            return undefined;
        }

        const url = this.getText("url", imageNode);

        if (!url) {
            return undefined;
        }
        const title = this.getText("title", imageNode);
        const link = this.getText("link", imageNode);

        return {
            url,
            title,
            link,
        };
    }

    private getSingleNode(selector: string, contextNode: Node): Node|undefined {
        const result = this.feed.evaluate(
            `./${selector}`,
            contextNode,
            this.resolver,
            XPathResult.FIRST_ORDERED_NODE_TYPE
        );
        return result?.singleNodeValue ?? undefined;
    };

    private getText(
        selector: string,
        contextNode: Node,
    ): string|undefined {
        const node = this.getSingleNode(selector, contextNode);
        if (!node) {
            return undefined;
        }

        return node.textContent ?? undefined;
    }

    private getTextAsNumber(
        selector: string,
        contextNode: Node,
    ): number|undefined {
        const numString = this.getText(selector, contextNode);
        if (!numString) {
            return undefined;
        }
        const num = Number(numString);
        if (Number.isNaN(num)) {
            return undefined;
        }

        return num;
    }

    private getAttribute(
        selector: string,
        attributeName: string,
        contextNode: Node,
    ): string|undefined {
        const node = this.getSingleNode(selector, contextNode);

        return (node as Element|undefined)?.getAttribute(attributeName) ?? undefined;
    }

    private getDate(
        selector: string,
        contextNode: Node
    ): Date|undefined {
        const dateString = this.getText(selector, contextNode);
        if (dateString) {
            return new Date(dateString);
        }
    
        return undefined;
    }

    private parseEnclosure(
        episodeNode: Node,
    ): PodcastEpisodeEnclosure {
        const lengthString = this.getAttribute(
            "enclosure",
            "length",
            episodeNode
        );
        if (lengthString === "") {
            throw new Error(
                "No length attribute for enclosure found for episode"
            );
        }
        const length = Number(lengthString);

        const type = this.getAttribute("enclosure", "type", episodeNode);
        if (!type) {
            throw new Error(
                "No MIME type attribute for enclosure found for episode"
            );
        }

        const url = this.getAttribute("enclosure", "url", episodeNode);
        if (!url) {
            throw new Error(
                "No URL attribute for enclosure found for episode"
            );
        }

        return {
            length,
            type,
            url,
        };
    }

    private parseEpisodeItem(
        itemRoot: Element,
        episodeIndex: number
    ): PodcastEpisode|null {
        const block = this.getText("itunes:block", itemRoot);
        if (block === "yes") {
            return null;
        }
        const guid = this.getText("guid", itemRoot);
        let title = this.getText("title", itemRoot);
        if (!title) {
            title = this.getText("itunes:title", itemRoot);
        }

        if (!title) {
            throw new Error("No title found for episode");
        }
        const description = this.getText("description", itemRoot);
        const publishedDate = this.getDate("pubDate", itemRoot);
        const imageUrl = this.getAttribute("itunes:image", "href", itemRoot);
        const link = this.getText("link", itemRoot);
        const episodeNumber = this.getTextAsNumber("itunes:episode", itemRoot) || episodeIndex;
        const durationString = this.getText("itunes:duration", itemRoot);
        const explicitString = this.getText("itunes:explicit", itemRoot);
        const enclosure = this.parseEnclosure(itemRoot);

        let durationSeconds: number|undefined;

        if (durationString) {
            const matches = HHMMSS_REGEX.exec(durationString);

            if (matches) {
                const hours = Number(matches[1]);
                if (Number.isNaN(hours)) {
                    throw new Error(
                        `Invalid time format for episode publication date ${
                            durationString
                        }. Must be either an integer (number of seconds) or a` +
                        ' string in the format HH:MM:SS');
                }
                const minutes = Number(matches[2]);
                if (Number.isNaN(minutes)) {
                    throw new Error(
                        `Invalid time format for episode publication date ${
                            durationString
                        }. Must be either an integer (number of seconds) or a` +
                        ' string in the format HH:MM:SS');
                }
                const seconds = Number(matches[3]);
                if (Number.isNaN(seconds)) {
                    throw new Error(
                        `Invalid time format for episode publication date ${
                            durationString
                        }. Must be either an integer (number of seconds) or a` +
                        ' string in the format HH:MM:SS');
                }
                durationSeconds = hours * 60 * 60 + minutes * 60 + seconds;
            }
            else {
                durationSeconds = Number(durationString);
                if (Number.isNaN(durationSeconds)) {
                    durationSeconds = undefined;
                }
            }
        }
    
        const episode: PodcastEpisode = {
            id: guid || "" + episodeNumber,
            guid,
            title,
            description,
            publishedDateTimestamp: publishedDate?.getTime(),
            imageUrl,
            link,
            episodeNumber: episodeNumber,
            durationSeconds,
            isExplicit: explicitString === "yes",
            enclosure,
        };
    
        return episode;
    }

    private parseCategories = (root: Node) => {
        const categories: PodcastCategory[] = [];
        const snapshot = this.feed.evaluate(
            "./itunes:category",
            root,
            this.resolver,
            XPathResult.ORDERED_NODE_SNAPSHOT_TYPE
        );
        if (snapshot.snapshotLength === 0) {
            return categories;
        }
        for (let i = 0; i < snapshot.snapshotLength; i++) {
            const el = snapshot.snapshotItem(i) as Element;
            const cat = el.getAttribute("text");
            if (!cat) {
                continue;
            }

            const podcastCategory: PodcastCategory = {
                category: cat,
            };

            const childCategories = this.parseCategories(el);

            if (childCategories.length > 0) {
                podcastCategory.children = childCategories;
            }

            categories.push(podcastCategory);
        }
        return categories;
    }

    private parseOwner(root: Node): PodcastOwner|undefined {
        const ownerNode = this.getSingleNode("itunes:owner", root);
        if (!ownerNode) {
            return undefined;
        }

        const name = this.getText("itunes:name", ownerNode);
        const email = this.getText("itunes:email", ownerNode);

        if (name == undefined) {
            return undefined;
        }

        return {
            name,
            email,
        };
    }
}

export const parseFeed = async (path: string) => {
    const feedText = await getFeedText(path);
    return new PodcastParser(feedText).parse();
};
