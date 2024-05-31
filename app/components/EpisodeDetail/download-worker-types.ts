export interface DownloadMessageData {
    type: "download";
    url: string;
}

export interface ProgressMessageData {
    type: "progress";
    value: Uint8Array;
    percentDone: number;
}

export interface DownloadDoneMessageData {
    type: "download-done";
}

export type DownloadWorkerMessageEvent = MessageEvent<
    DownloadMessageData|ProgressMessageData|DownloadDoneMessageData
>;
