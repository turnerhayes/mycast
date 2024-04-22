import Container from "@mui/material/Container";
import MicrophoneIcon from "@mui/icons-material/Mic";
import { PodcastEpisode, PodcastId } from "@/app/podcast";

const EPISODE_IMAGE_SIZE = 150;

export const EpisodeImage = (
    {
        episode,
        podcastId,
    }: {
        episode: PodcastEpisode;
        podcastId: PodcastId;
    }
) => {
    // const progress = useAppSelector((state) => getEpisodeLastListenTime(state, {
    //     episodeId: episode.id,
    //     podcastId: podcastId,
    // }));

    // const progressPercent =  (progress || 0) * 100 / episode.enclosure.length;

    return (
        <Container
            sx={{
                height: EPISODE_IMAGE_SIZE,
                minWidth: EPISODE_IMAGE_SIZE,
                width: EPISODE_IMAGE_SIZE,
                marginRight: 1,
                marginLeft: 0,
                padding: [0],
                // position: "relative",
            }}
        >
            {/* <Box
                sx={{
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0,
                    position: "absolute",
                    zIndex: 1,
                }}
            >
                <svg width="100%" height="100%" viewBox="0 0 100 100">
                    <circle
                        cx={50}
                        cy={50}
                        r={50}
                        strokeWidth={100}
                        strokeDasharray={`${progressPercent} ${100 - progressPercent}`}
                        strokeDashoffset={25}
                        pathLength={100}
                        fill="transparent"
                        stroke="#0000008E"
                        clipPath="circle() fill-box"
                    />
                </svg>
            </Box> */}
            {
                episode.imageUrl ? (
                    <img
                        src={episode.imageUrl}
                        alt="Episode image"
                        style={{
                            width: "100%",
                            maxWidth: "none",
                            height: "fit-content",
                        }}
                    />
                ) : (
                    <Container
                        sx={{
                            backgroundColor: "lightgray",
                            height: "100%",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <MicrophoneIcon
                            sx={{
                                fontSize: "8rem",
                            }}
                        />
                    </Container>
                )
            }
        </Container>
    );
};
