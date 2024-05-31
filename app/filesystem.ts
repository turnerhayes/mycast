import { EpisodeId, PodcastId } from "@/app/podcast";


export interface DownloadList {
    [podcastId: PodcastId]: {
        [episodeId: EpisodeId]: {
            handle: FileSystemHandle;
            size: number;
        };
    };
}

export const getUsage = async (): Promise<{quota: number, usage: number}|null> => {
    if (!navigator.storage?.estimate) {
        return null;
    }
    const {quota, usage} = await navigator.storage.estimate();

    if (quota == undefined || usage == undefined) {
        return null;
    }

    return {
        quota,
        usage,
    };
};

const getRoot = async (): Promise<FileSystemDirectoryHandle|null> => {
    if (!navigator.storage.getDirectory) {
        console.error("ODFS not supported on this browser");
        return null;
    }
    return await navigator.storage.getDirectory();
};

export const escapeName = (name: string) => encodeURIComponent(name);

export const unescapeName = (escaped: string) => decodeURIComponent(escaped);

const getChildren = async (
    parentHandle: FileSystemDirectoryHandle
): Promise<{[name: string]: FileSystemHandle}> => {
    const children: {[name: string]: FileSystemHandle} = {};

    for await (const [name, handle] of parentHandle.entries()) {
        children[name] = handle;
    }

    return children;
};


const getChildByName = async <T extends FileSystemHandle> (
    name: string,
    parentHandle: FileSystemDirectoryHandle,
): Promise<T|null> => {
    let targetHandle: T|null = null;
    for await (const [key, handle] of parentHandle.entries()) {
        if (key === name) {
            targetHandle = handle as T;
            break;
        }
    }
    return targetHandle;
};


export const getDirectory = async (
    baseHandle: FileSystemDirectoryHandle,
    name: string,
    create: boolean
): Promise<FileSystemDirectoryHandle|null> => {
    name = escapeName(name);
    if (create) {
        return await baseHandle.getDirectoryHandle(name, {create});
    }

    return await getChildByName<FileSystemDirectoryHandle>(name, baseHandle);
};

export const getFile = async (
    baseHandle: FileSystemDirectoryHandle,
    name: string,
    create: boolean
): Promise<FileSystemFileHandle|null> => {
    name = escapeName(name);
    if (create) {
        return await baseHandle.getFileHandle(name, {create});
    }

    return await getChildByName<FileSystemFileHandle>(name, baseHandle);
};

const getPodcastsDir = async (
    create: boolean = false
): Promise<FileSystemDirectoryHandle|null> => {
    const opfsRoot = await getRoot();

    if (!opfsRoot) {
        return null;
    }

    return await getDirectory(opfsRoot, "podcasts", create);
};

const getPodcastDir = async (
    podcastId: PodcastId,
    create: boolean = false
): Promise<FileSystemDirectoryHandle|null> => {
    const podcastsDir = await getPodcastsDir(create);

    if (!podcastsDir) {
        return null;
    }

    return await getDirectory(podcastsDir, podcastId, create);
};

export const removePodcastFiles = async (podcastId: PodcastId) => {
    const podcastsDir = await getPodcastsDir();

    if (!podcastsDir) {
        return;
    }

    const podcastDir = await getDirectory(podcastsDir, podcastId, false);

    if (!podcastDir) {
        return;
    }

    podcastId = escapeName(podcastId);
    await podcastsDir.removeEntry(
        podcastId,
        {
            recursive: true,
        }
    );
};

export const removePodcastEpisodeFile = async (podcastId: PodcastId, episodeId: EpisodeId) => {
    const podcastDir = await getPodcastDir(podcastId);

    if (!podcastDir) {
        return;
    }

    const file = await getFile(podcastDir, episodeId, false);

    if (!file) {
        return;
    }

    episodeId = escapeName(episodeId);
    await podcastDir.removeEntry(episodeId);

    const children = await getChildren(podcastDir);
    if (Object.keys(children).length === 0) {
        const podcastsDir = await getPodcastsDir();
        if (podcastsDir) {
            await podcastsDir.removeEntry(podcastId);
        }
    }
};

if (typeof window !== "undefined") {
    (window as any).__removeEpisodeFile = removePodcastEpisodeFile;
}

export const getEpisodeFileHandle = async (
    podcastId: PodcastId,
    episodeId: EpisodeId,
    create: boolean
): Promise<FileSystemFileHandle|null> => {
    const opfsRoot = await getRoot();

    if (!opfsRoot) {
        return null;
    }

    const podcastsDir = await getDirectory(opfsRoot, "podcasts", create);

    if (!podcastsDir) {
        return null;
    }

    const podcastDir = await getDirectory(podcastsDir, podcastId, create);

    if (!podcastDir) {
        return null;
    }

    return await getFile(podcastDir, episodeId, create);
};

export const getEpisodeAudioFromFile = async (podcastId: PodcastId, episodeId: EpisodeId) => {
    const handle = await getEpisodeFileHandle(podcastId, episodeId, false);

    if (!handle) {
        return null;
    }

    return await handle.getFile();
};

export const getDownloads = async (): Promise<DownloadList> => {
    const podcastsDirectory = await getPodcastsDir();

    if (!podcastsDirectory) {
        return {};
    }

    const podcastDirectories = await getChildren(podcastsDirectory);

    const list: DownloadList = {};

    for (const dirName of Object.keys(podcastDirectories)) {
        const episodeHandles = await getChildren(
            podcastDirectories[dirName] as FileSystemDirectoryHandle
        ) as {[name: string]: FileSystemFileHandle};

        const episodes: DownloadList[PodcastId] = {};
        for (const episodeId of Object.keys(episodeHandles)) {
            const file = await episodeHandles[episodeId].getFile();
            episodes[unescapeName(episodeId)] = {
                handle: episodeHandles[episodeId],
                size: file.size,
            };
        }

        list[unescapeName(dirName)] = episodes;
    }

    return list;
};
