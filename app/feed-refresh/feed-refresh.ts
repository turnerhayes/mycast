import { getStore } from "@/lib/redux/store";
import { GET_STATE_MESSAGE_TYPE, STATE_UPDATE_MESSAGE_TYPE, UPDATE_PODCASTS_MESSAGE_TYPE } from "./feed-refresh-worker";
import { Podcast } from "../podcast";
import { updatePodcasts } from "@/lib/redux/slices/podcast";

console.log("feed-refresh:> creating worker");
const worker = new Worker(
    new URL("./feed-refresh-worker.ts", import.meta.url)
);


worker.addEventListener("message", (event: MessageEvent) => {
    console.log("feed-refresh:> got message event", event);
    const {data} = event;
    if (data.type === GET_STATE_MESSAGE_TYPE) {
        const store = getStore();
        if (!store) {
            console.log("feed-refresh:> No store available");
            return;
        }
        self.postMessage({
            type: STATE_UPDATE_MESSAGE_TYPE,
            messageData: store.getState(),
        });
        return;
    }

    if (data.type === UPDATE_PODCASTS_MESSAGE_TYPE) {
        const store = getStore();
        if (!store) {
            return;
        }

        const podcasts: Podcast[] = data.messageData;

        store.dispatch(updatePodcasts(podcasts));
    }
});
