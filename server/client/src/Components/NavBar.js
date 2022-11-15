import React, { useState } from 'react';
import { Avatar, Stack, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import LogoutIcon from '@mui/icons-material/Logout';
import { addToken } from '../State Mangement/TokenSlice';
import removeCookie from '../Hooks/removeCookie.js';
import SearchIcon from '@mui/icons-material/Search';
import SearchDrawer from './SearchDrawer';

export default function NavBar() {

    const { user } = useSelector((state) => state.User);
    const dispatch = useDispatch();

    const [open, setOpen] = useState(false);

    return (
        <Stack sx={{ backgroundColor: "text.light", padding: "10px 3%", flexDirection: "row", justifyContent: "space-between" }}>
            <Stack sx={{ flexDirection: "row", alignItems: "center", gap: "10px", cursor: "pointer" }} onClick={() => {
                setOpen(true);
            }}>
                <SearchIcon sx={{ color: 'primary.main' }} />
                <Typography>Search User</Typography>
            </Stack>
            <Typography variant='h2' sx={{ color: "primary.main", fontSize: "30px" }}>Mero Chat</Typography>
            <Stack sx={{ flexDirection: "row", alignItems: "center", gap: "10px" }}>
                <Avatar src={user?.image} />
                <Typography variant='h4' sx={{ fontSize: "18px" }}>{user?.username}</Typography>
                <LogoutIcon sx={{ color: 'primary.main', cursor: "pointer" }} onClick={() => {
                    removeCookie("c_user");
                    dispatch(addToken(null));
                }} />
            </Stack>
            <SearchDrawer open={open} setOpen={setOpen} />
        </Stack>
    )
}
