import { Container } from '@mui/material';
import { styled } from '@mui/material/styles';
import MicrophoneIcon from "@mui/icons-material/Mic";
import { PodcastEpisode } from '@/app/podcast';

const EPISODE_IMAGE_SIZE = 150;

export const EpisodeImage = styled((
    {
        episode,
    }: {
        episode: PodcastEpisode;
    }
) => {
    return (
        <Container
            className="episode-image-root"
            sx={{
                height: EPISODE_IMAGE_SIZE,
                minWidth: EPISODE_IMAGE_SIZE,
                width: EPISODE_IMAGE_SIZE,
                marginRight: 1,
                marginLeft: 0,
                padding: [0],
                position: "relative",
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
})({
    ".episode-image-root:hover": {
        "outline": "2px solid blue",
        "transform": "scale(3)",
    },
});
