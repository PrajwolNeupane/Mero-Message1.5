import React, { useEffect, useState, useRef } from 'react';
import { Avatar, Stack, Typography } from '@mui/material';
import { addIndex } from '../State Mangement/IndexSlice';
import { addMessage } from '../State Mangement/MessageSlice';
import { addConversation, addLatestMessage } from '../State Mangement/ConversationSlice.js';
import { useDispatch, useSelector } from 'react-redux';
import  io  from "socket.io-client";

export default function Conversation() {

    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.User);
    const { conversation } = useSelector((state) => state.Conversation);
    const { index } = useSelector((state) => state.Index);
    const { message } = useSelector((state) => state.Message);
    const socket = useRef();
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [newMessage, setNewMessage] = useState({});



    useEffect(() => {
        socket.current = io.connect("/");
        socket.current.emit("new-user-add", user);
        socket.current.on("get-users", (users) => {
            setOnlineUsers(users);

        });
    }, [user]);

    useEffect(() => {
        socket.current.on("recieve-message", (data) => {

            setNewMessage(data);
        }
        );
    }, [socket.current, newMessage]);

    useEffect(() => {
        if (Object.keys(newMessage).length !== 0) {
            dispatch(addMessage([...message, newMessage]));
            dispatch(addLatestMessage({ index: index, latestMessage: newMessage }))
        }
    }, [newMessage]);

    const checkMember = (arr) => {
        let name;
        arr.forEach((val) => {
            if (val?._id !== user?._id) {
                name = val
            }
        })
        return name
    }

    const checkOnlineUsers = (userId) => {
        let result = false;
        onlineUsers.forEach((curr) => {
            if (curr?.user?._id === userId) {
                result = true;
            }
        });
        return result
    }


    return (
        <Stack sx={{ backgroundColor: "text.main", width: "25%", padding: "11px 1%", height: "88vh", gap: "10px" }}>
            <Typography variant='h3' sx={{ fontSize: "25px" }}>Recent Conversation</Typography>
            <Typography variant='h4' sx={{ fontSize: "18px" }}>{"Online Users : " + Number(onlineUsers?.length - 1)}</Typography>
            <Stack sx={{ backgroundColor: "white", width: "96%", height: "100%", borderRadius: "5px", padding: "10px 2%", gap: "10px", overflowY: "auto" }}>
                {
                    conversation?.map((curr, indx) => {
                        return <Stack sx={{ backgroundColor: "text.light", padding: "5px 10px", borderRadius: "5px", flexDirection: "row", gap: "10px" }} key={indx} onClick={() => {
                            dispatch(addIndex(indx));
                        }}>
                            <Avatar src={checkMember(curr?.members)?.image} />
                            <>  {
                                checkOnlineUsers(checkMember(curr?.members)?._id) === true ? <Avatar sx={{ backgroundColor: "#228B22", color: '#228B22', width: "10px", height: "10px", marginLeft: "-20px" }} /> : <></>
                            }</>
                            <Stack><Typography variant='h3' sx={{ fontSize: "16px" }}>{checkMember(curr?.members)?.username}</Typography><>{
                                curr?.latestMessage === undefined ? <></> : <Typography variant='h4' sx={{ fontSize: "13px" }}>{curr?.latestMessage?.senderId?.username === undefined ? checkMember(curr?.members)?.username + ' : ' + curr?.latestMessage?.text : curr?.latestMessage?.senderId?.username + ' : ' + curr?.latestMessage?.text}</Typography>
                            }</>
                            </Stack>
                        </Stack>

                    })

                }
            </Stack>
        </Stack>
    )
}
