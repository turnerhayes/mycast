"use client";

import { useEffect, useState } from "react";
import { getFeedText, parseFeed } from "../../podcast-parser";
import ReactCodeMirror from "@uiw/react-codemirror";
import { xml as xmlLang } from "@codemirror/lang-xml";
import { okaidia } from '@uiw/codemirror-theme-okaidia';
import { useAppDispatch } from "@/lib/redux/hooks";
import { addPodcast } from "@/lib/redux/slices/podcast";
import { Podcast } from "@/app/podcast";

const FeedXML = () => {
    const dispatch = useAppDispatch();
    const [xml, setXml] = useState<string|null>(null);
    let ignore = false;
    useEffect(() => {
        if (!ignore) {
            const url = "https://www.dimsdale.co.uk/rss/tubt";
            getFeedText(url).then((xml) => {
                setXml(xml);
            });

            parseFeed(url).then((podcastWithoutId) => {
                const podcast: Podcast = {
                    id: "0",
                    ...podcastWithoutId
                }
                dispatch(addPodcast(podcast));
            });
        }

        return () => {
            ignore = true;
        };
    }, [setXml, dispatch]);
    return (
        <div>
            {xml ? (
                <ReactCodeMirror
                    value={xml}
                    height="100%"
                    theme={okaidia}
                    extensions={[xmlLang()]}
                />
            ) : null}
        </div>
    );
};

export {FeedXML};
