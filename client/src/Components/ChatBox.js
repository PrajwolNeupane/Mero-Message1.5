import { Avatar, Stack, Typography } from '@mui/material';
import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import InputEmoji from 'react-input-emoji';
import axios from 'axios';
import { addLatestMessage } from '../State Mangement/ConversationSlice';
import { addMessage } from '../State Mangement/MessageSlice';
import { io } from "socket.io-client";
import { format, render, cancel, register } from 'timeago.js';


export default function ChatBox() {


    const { conversation } = useSelector((state) => state.Conversation);
    const { message } = useSelector((state) => state.Message);
    const { index } = useSelector((state) => state.Index);
    const { user } = useSelector((state) => state.User);

    const socket = useRef();
    const scroll = useRef();


    const [typedMessage, setTypedMessage] = useState("");

    const dispatch = useDispatch();

    const checkMember = (arr) => {
        let name;
        arr.forEach((val) => {
            if (val?._id !== user?._id) {
                name = val
            }
        })
        return name
    }

    const sendMessage = async () => {

        if (typedMessage !== "") {
            try {

                const res = await axios.post(`http://localhost:8000/message/`, {
                    chatId: conversation[index]?._id,
                    senderId: user?._id,
                    text: typedMessage
                });
                dispatch(addMessage([...message, res.data]));
                dispatch(addLatestMessage({ index: index, latestMessage: { senderId: { id: user?._id, username: user?.username }, chatId: conversation[index]?._id, text: typedMessage } }));
                socket.current.emit("send-message", {
                    chatId: conversation[index]?._id, senderId: user?._id,
                    text: typedMessage, receiverId: checkMember(conversation[index]?.members)?._id
                });
                setTypedMessage("");
            } catch (e) {
                console.log(e);
            }

        }
    }

    useEffect(() => {
        socket.current = io("ws://localhost:8800");
    }, []);

    const typing = (e) => {
        setTypedMessage(e);
    }




    useEffect(() => {
        scroll.current?.scrollIntoView({ behavior: "smooth" });
    }, [message]);

    return (
        <> {
            index === null ? <Stack sx={{ width: "73vw", height: "88vh", backgroundColor: "white", padding: "11px 0px", justifyContent: 'center' }}>
                <Typography sx={{ textAlign: "center", fontSize: "30px" }} variant='h4' >Click on Conversation to start chat</Typography></Stack>
                :
                <Stack sx={{ width: "73vw", height: "89vh", backgroundColor: "white", alignItems: "flex-start" }}>
                    <Stack sx={{ backgroundColor: "text.main", padding: "20px 20px", flexDirection: "row", alignItems: 'center', gap: "10px", width: "70vw" }}>
                        <Avatar src={checkMember(conversation[index]?.members)?.image} />
                        <Typography sx={{ fontSize: "20px" }} variant='h4'>{checkMember(conversation[index]?.members)?.username}</Typography>
                    </Stack>
                    <Stack sx={{ width: '98%', padding: "10px 1%", gap: "10px", alignItems: 'flex-start', overflowY: "auto", marginBottom: "50px" }} >
                        {
                            message?.map((curr, indx) => {
                                if (curr?.senderId === user?._id) {
                                    return <Stack sx={{ width: '100%', alignItems: 'flex-end' }} key={indx} ref={scroll}>
                                        <Stack sx={{ backgroundColor: "text.main", borderRadius: "15px", padding: "5px 8px", maxWidth: "40%", alignItems: 'flex-end', justifyContent: 'flex-end' }}>
                                            <Typography variant='h4' sx={{ fontSize: "15px", alignItems: "flex-end" }}>{curr?.text}</Typography>
                                            <Typography variant='h5' sx={{ fontSize: "12px" }}>{format((curr?.createdAt))}</Typography>
                                        </Stack>
                                    </Stack>
                                } else {
                                    return <Stack sx={{ backgroundColor: "otherColor.main", borderRadius: "15px", padding: "5px 8px", maxWidth: "40%" }} key={indx} ref={scroll}>
                                        <Typography variant='h4' sx={{ fontSize: "15px" }}>{curr?.text}</Typography>
                                        <Typography variant='h5' sx={{ fontSize: "12px" }}>{format((curr?.createdAt))}</Typography>
                                    </Stack>
                                }
                            })
                        }

                    </Stack>
                    <Stack sx={{ flexDirection: "row", backgroundColor: "text.main", position: "absolute", bottom: "0px", padding: "5px 13px", width: "71vw", justifyContent: "space-between", gap: "20px" }}>
                        <InputEmoji
                            value={typedMessage}
                            onChange={typing}
                            borderRadius={10}
                            placeholder={"Message"}
                            fontSize={14}
                            cleanOnEnter
                            onEnter={() => {
                                sendMessage();
                            }}
                        />
                        <button style={{ borderRadius: "10px", backgroundColor: "#3a3a3d", border: "none", cursor: "pointer", padding: "5px 10px", color: "white" }} onClick={() => {
                            sendMessage();
                        }}>Send</button>
                    </Stack>
                </Stack>
        }
        </>
    )
}
