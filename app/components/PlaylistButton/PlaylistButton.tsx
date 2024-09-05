import { useCallback, useId, useRef, useState } from "react";
import { useTheme } from "@mui/material";
import Button from "@mui/material/Button"; 
import ButtonGroup from "@mui/material/ButtonGroup"; 
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Grow from "@mui/material/Grow"; 
import IconButton from "@mui/material/IconButton"; 
import MenuItem from "@mui/material/MenuItem"; 
import MenuList from "@mui/material/MenuList"; 
import Paper from "@mui/material/Paper"; 
import Popper from "@mui/material/Popper"; 
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

export const PlaylistButton = (
    {
        onAddToPlaylist,
        onPlayNext,
    }: {
        onAddToPlaylist: () => void;
        onPlayNext: () => void;
    }
) => {
    const theme = useTheme();
    const [open, setOpen] = useState(false);
    const anchorRef = useRef<HTMLDivElement>(null);

    const handleClose = useCallback((event: Event) => {
        if (
            anchorRef.current &&
            anchorRef.current.contains(event.target as HTMLElement)
        ) {
            return;
        }

        setOpen(false);
    }, [
        setOpen,
        anchorRef,
    ]);

    const handlePlayNextClick = useCallback(() => {
        setOpen(false);
        onPlayNext();
    }, [
        setOpen,
        onPlayNext,
    ]);

    const handleToggle = useCallback(() => {
        setOpen((prevOpen) => !prevOpen);
    }, [
        setOpen,
    ]);

    const menuId = useId();

    const options = [
        "Play last",
        "Play next"
    ];

    return (
        <>
            <ButtonGroup
                variant="contained"
                ref={anchorRef}
                aria-label="Playlist add button"
            >
                <IconButton onClick={onAddToPlaylist}>
                    <PlaylistAddIcon />
                </IconButton>
                <Button
                    size="small"
                    aria-controls={open ? menuId : undefined}
                    aria-expanded={open ? 'true' : undefined}
                    aria-label="select merge strategy"
                    aria-haspopup="menu"
                    onClick={handleToggle}
                >
                    <ArrowDropDownIcon />
                </Button>
            </ButtonGroup>
            <Popper
                sx={{
                    zIndex: 1,
                }}
                open={open}
                anchorEl={anchorRef.current}
                role={undefined}
                transition
                disablePortal
            >
                {({ TransitionProps, placement }) => (
                    <Grow
                        {...TransitionProps}
                        style={{
                            transformOrigin:
                                placement === 'bottom' ? 'center top' : 'center bottom',
                        }}
                    >
                        <Paper>
                            <ClickAwayListener onClickAway={handleClose}>
                                <MenuList id={menuId} autoFocusItem>
                                    <MenuItem
                                        onClick={() => handlePlayNextClick()}
                                    >
                                        Play Next
                                    </MenuItem>
                                </MenuList>
                            </ClickAwayListener>
                        </Paper>
                    </Grow>
                )}
            </Popper>
        </>
    );
};
