"use client";

import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import DragHandleIcon from "@mui/icons-material/DragHandle";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useAppSelector } from "@/lib/redux/hooks";
import { getDefaultPlaylist, getPodcastEpisodes } from "@/lib/redux/selectors";
import { Playlist } from "@/app/playlist";
import { EpisodeLink, PodcastLink } from "@/app/components/Links";
import { Podcast, PodcastEpisode } from "@/app/podcast";
import { useTheme } from "@mui/material";


const DRAG_ITEM_TYPE = "playlist_item";

const PlaylistItem = (
    {
        index,
        podcast,
        episode,
    }: {
        index: number;
        podcast: Podcast;
        episode: PodcastEpisode;
    }
) => {
    const theme = useTheme();
    const [{isDragging}, drag] = useDrag(() => ({
        type: DRAG_ITEM_TYPE,
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    }));

    const [{isOver}, drop] = useDrop(() => ({
        accept: DRAG_ITEM_TYPE,
        drop: (item, monitor) => {
            console.log("item:", item);
            console.log("monitor:", monitor);
        },
        collect: (monitor) => {
            return {
                isOver: monitor.isOver(),
            };
        },
    }));
    
    return (
        <ListItem
            ref={drag}
            disableGutters
            sx={{
                backgroundColor: isDragging ? theme.palette.action.selected : undefined,
                outline: isOver ? `1px solid blue` : undefined,
            }}
            secondaryAction={
                <DragHandleIcon
                    sx={{
                        cursor: "grab",
                    }}
                />
            }
        >
            <Typography
                sx={{
                    marginRight: 2,
                }}
            >
                {index + 1}. 
            </Typography>
            
            <ListItemText
            >
                <PodcastLink
                    podcastId={podcast.id}
                >
                    {podcast.title}
                </PodcastLink>
                &nbsp; &mdash; &nbsp;
                <EpisodeLink
                    podcastId={podcast.id}
                    episodeId={episode.id}
                >
                    {episode.title}
                </EpisodeLink>
            </ListItemText>
        </ListItem>
    );
};

const PlaylistDisplay = (
    {
        playlist,
    }: {
        playlist: Playlist;
    }
) => {
    const podcastEpisodes = useAppSelector((state) => getPodcastEpisodes(state, playlist.items));
    
    if (playlist.items.length === 0) {
        return (
            <Typography>
                Playlist is empty
            </Typography>
        );
    }

    if (Object.values(podcastEpisodes).length < playlist.items.length) {
        throw new Error("Unable to find all episodes in playlist");
    }

    return (
        <DndProvider
            backend={HTML5Backend}
        >
            <List
                disablePadding
                dense
            >
                {
                    playlist.items.map((id, index) => (
                        <PlaylistItem
                            key={JSON.stringify(id)}
                            index={index}
                            podcast={podcastEpisodes[JSON.stringify(id)]!.podcast}
                            episode={podcastEpisodes[JSON.stringify(id)]!.episode}
                        />
                    ))
                }
            </List>
        </DndProvider>
    );
};

export const PlaylistComponent = () => {
    const playlist = useAppSelector(getDefaultPlaylist);

    return (
        <Stack>
            <header>
                <Typography
                    variant="h3"
                >
                    Playlist
                </Typography>
            </header>
            <PlaylistDisplay
                playlist={playlist}
            />
        </Stack>
    );
};
