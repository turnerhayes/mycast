import { Podcast } from "@/app/podcast";
import Podcasts from "@mui/icons-material/Podcasts";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";


const DEFAULT_IMAGE_SIZE = 250;

export const PodcastImage = (
    {
        podcast,
        size = DEFAULT_IMAGE_SIZE,
    }: {
        podcast: Podcast;
        size?: number;
    }
) => {
    return (
        <Container
            sx={{
                width: size,
                minWidth: size,
                height: size,
                paddingLeft: [0],
                paddingRight: [0],
            }}
        >
            {
                podcast.image ? (
                    <img
                        src={podcast.image.url}
                        alt={podcast.image.title ?? `Image for ${podcast.title} podcast`}
                        title={podcast.image.title}
                        style={{
                            width: "100%",
                        }}
                    />
                ) : (
                    <Stack
                        alignItems="center"
                        justifyContent="center"
                        sx={{
                            backgroundColor: "lightgrey",
                            height: "100%",
                            width: "100%",
                        }}
                    >
                        <Podcasts
                            sx={{
                                fontSize: "40px",
                            }}
                        />
                    </Stack>
                )
            }
        </Container>
    );
};
