import Container from "@mui/material/Container";
import MicrophoneIcon from "@mui/icons-material/Mic";
import { PodcastEpisode, PodcastId } from "@/app/podcast";
import { SxProps } from "@mui/material";

const EPISODE_IMAGE_SIZE = 150;

export const EpisodeImage = (
    {
        episode,
        podcastId,
        sx,
    }: {
        episode: PodcastEpisode;
        podcastId: PodcastId;
        sx?: SxProps;
    }
) => {
    return (
        <Container
            sx={{
                height: EPISODE_IMAGE_SIZE,
                minWidth: EPISODE_IMAGE_SIZE,
                width: EPISODE_IMAGE_SIZE,
                marginRight: 1,
                marginLeft: 0,
                padding: [0],
                ...sx,
            }}
        >
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
