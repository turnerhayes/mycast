import { RootState } from "@/lib/redux/store";
import { Podcast } from "../podcast";
import { parseFeed } from "../podcast-parser";

export const GET_STATE_MESSAGE_TYPE = "get-state";
export const STATE_UPDATE_MESSAGE_TYPE = "state-update";
export const UPDATE_PODCASTS_MESSAGE_TYPE = "update-podcasts";


interface EventTypes {
    [GET_STATE_MESSAGE_TYPE]: void;
    [STATE_UPDATE_MESSAGE_TYPE]: RootState;
    [UPDATE_PODCASTS_MESSAGE_TYPE]: Podcast[];
}

interface MessageData<E extends keyof EventTypes = keyof EventTypes> {
    type: E;
    messageData: EventTypes[E];
}

// const REFRESH_INTERVAL_MS = 60 * 60 * 1000; // 1 hour
const REFRESH_INTERVAL_MS = 30 * 1000; // 30 seconds

const MAX_PODCAST_UPDATE_DELAY = 24 * 60 * 60 * 1000; // 24 hours

class FeedRefreshWorker {
    state: RootState|null = null;

    worker: Window & typeof globalThis;

    intervalId: number|undefined;

    constructor(worker: Window & typeof globalThis) {
        this.worker = worker;
        this.worker.addEventListener(
            "message",
            ({data}: MessageEvent<MessageData>) => {
                if (data.type === STATE_UPDATE_MESSAGE_TYPE) {
                    this.state = data.messageData as RootState;
                }
            }
        );
        this.intervalId = self.setInterval(() => {
            this.updatePodcasts();
        }, REFRESH_INTERVAL_MS);
    }

    private sendPodcastUpdates(updatedPodcasts: Podcast[]) {
        this.worker.dispatchEvent(new MessageEvent(UPDATE_PODCASTS_MESSAGE_TYPE, {
            data: updatedPodcasts,
        }));
    }

    private async getState() {
        console.log("feed-refresh-worker:> getting state");
        const promise = new Promise<RootState>((resolve) => {
            const handler = ({data}: MessageEvent<MessageData>) => {
                if (data.type === STATE_UPDATE_MESSAGE_TYPE) {
                    console.log("feed-refresh-worker:> got state response");
                    const state = data.messageData as RootState;
                    resolve(state);
                    this.worker.removeEventListener("message", handler);
                }
            };
            this.worker.addEventListener("message", handler);
        });

        this.worker.postMessage({
            type: GET_STATE_MESSAGE_TYPE,
        });

        return await promise;
    }

    async updatePodcasts() {
        console.log("feed-refresh-worker:> updating podcasts");
        const state = await this.getState();
        console.log("feed-refresh-worker:> got state", state);

        const podcasts = [...state.podcast.items];

        const updatedPodcasts: Podcast[] = [];

        let hasUpdatedPodcasts = false;

        for (let i = 0; i < podcasts.length; i++) {
            const podcast = podcasts[i];
            console.log("feed-refresh-worker:> Checking podcast URL:", podcast.feedUrl);
            if (
                (
                    Date.now() - podcast.lastRefreshTimestamp
                ) > MAX_PODCAST_UPDATE_DELAY
            ) {
                const updatedPodcast = await parseFeed(podcast.feedUrl);
                const diff: Partial<{
                    [key in keyof Podcast]: [
                        unknown,
                        unknown,
                    ];
                }> = {};
                const newPodcast = {
                    id: podcast.id,
                    ...updatedPodcast,
                    lastRefreshTimestamp: Date.now(),
                };
                let hasDiff = false;
                for (const key in updatedPodcast) {
                    if (!Object.hasOwnProperty(key)) {
                        continue;
                    }
                    const k = key as keyof Podcast;
                    if (podcast[k] !== podcasts[i][k]) {
                        diff[k] = [podcast[k], newPodcast[k]];
                        hasDiff = true;
                    }
                }
                if (hasDiff) {
                    console.log("feed-refresh-worker:> Podcast diff", diff);
                    updatedPodcasts.push(newPodcast);
                }
            }
        }

        if (hasUpdatedPodcasts) {
            this.sendPodcastUpdates(updatedPodcasts);
        }
    }
}

new FeedRefreshWorker(self);
