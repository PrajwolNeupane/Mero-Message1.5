import React, { useState } from 'react';
import { Drawer, Typography, Stack, InputBase, Avatar } from '@mui/material';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { addConversation } from '../State Mangement/ConversationSlice.js';

export default function SearchDrawer({ open, setOpen }) {

    const { user } = useSelector((state) => state.User);
    const { conversation } = useSelector((state) => state.Conversation);
    const  dispatch  = useDispatch();
    const [searchedUser, setSearchedUser] = useState([]);

    const onSearchChange = async (e) => {
        try {

            const res = await axios.post(`/user/search/?search=${e.target.value}`, { id: user._id });
            setSearchedUser(res.data);

        } catch (e) {

        }
    }

    const createConversation = async (indx) => {
        try {
            const res = await axios.post("/chat", {
                senderId: user?._id,
                receiverId: searchedUser[indx]?._id
            });
            dispatch(addConversation([...conversation,res.data]));
            setOpen(false);
            
        } catch (e) {

        }
    }


    return (
        <Drawer anchor='left' open={open} onClose={() => {
            setOpen(false);
            setSearchedUser([]);
        }}>
            <Stack p={2} width="300px" textAlign={"start"} role='presentation' sx={{ gap: "20px" }}>
                <Typography variant='h3' sx={{ fontSize: "20px" }}>Search Users</Typography>
                <InputBase placeholder='Search Users' sx={{ padding: "5px 10px", backgroundColor: "text.main", borderRadius: "5px" }} onChange={onSearchChange} />
            </Stack>
            <Stack p={2} width="300px" textAlign={"start"} role='presentation' sx={{ gap: "10px",overflowY:"auto" }}>
                {
                    searchedUser.map((curr, indx) => (
                        <Stack sx={{
                            flexDirection: "row", width: "96%", gap: "10px", backgroundColor: "text.light", padding: "7px 2%", cursor: "pointer", borderRadius: "5px", ":hover": {
                                backgroundColor: "text.main"
                            }
                        }} key={indx} onClick={() => {
                            createConversation(indx);
                        }}>
                            <Avatar src={curr?.image} />
                            <Stack>
                                <Typography variant='h3' sx={{ fontSize: "16px" }}>{curr?.username}</Typography>
                                <Typography variant='h4' sx={{ fontSize: "13px" }}>{curr?.email}</Typography>
                            </Stack>
                        </Stack>
                    ))
                }
            </Stack>
        </Drawer>
    )
}
