import { Stack } from '@mui/material'
import React, { useState, useEffect } from 'react'
import ChatBox from '../Components/ChatBox'
import Conversation from '../Components/Conversation'
import NavBar from '../Components/NavBar'
import axios from 'axios'
import { useSelector, useDispatch } from 'react-redux';
import { addMessage } from '../State Mangement/MessageSlice.js'

export default function ChatPage() {

  const { conversation } = useSelector((state) => state.Conversation);
  const { index } = useSelector((state) => state.Index);

  const dispatch = useDispatch();

  useEffect(() => {

    const getMessage = async () => {

      try {

        const res = await axios.post(`/message/getMessage`, {
          chatId: conversation[index]?._id
        });
        dispatch(addMessage(res.data));

      } catch (e) {
        console.log(e);
      }

    }
    if (index !== null) {
      getMessage();

    }
  }, [index]);

  return (
    <>
      <NavBar />
      <Stack sx={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Conversation />
        <ChatBox />
      </Stack>
    </>
  )
}
