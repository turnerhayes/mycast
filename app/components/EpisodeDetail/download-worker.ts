import { DownloadDoneMessageData, DownloadMessageData, DownloadWorkerMessageEvent, ProgressMessageData } from "./download-worker-types";

self.onmessage = async (event: DownloadWorkerMessageEvent) => {
    if (event.data.type === "download") {
        const {data} = event as MessageEvent<DownloadMessageData>;
        const url = data.url;
        const response = await fetch(url);

        const {body, headers} = response;
        
        const totalBytes = Number(headers.get("content-length"));

        const reader = body?.getReader();
        
        if (!reader) {
            throw new Error("Can't get body reader for episode audio");
        }

        let bytesWritten = 0;
        while (true) {
            const {done, value} = await reader.read();

            if (done) {
                break;
            }

            bytesWritten += value.byteLength;

            const percentDone = (bytesWritten/totalBytes) * 100;

            self.postMessage({
                type: "progress",
                value,
                percentDone,
            } as ProgressMessageData);
        }

        self.postMessage({
            type: "download-done",
        } as DownloadDoneMessageData);
    }
};
