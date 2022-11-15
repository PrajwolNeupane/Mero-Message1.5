import React, { useEffect, useRef, useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Account from './Page/Account';
import ChatPage from './Page/ChatPage';
import getCookie from './Hooks/getCookie.js';
import { useDispatch, useSelector } from 'react-redux';
import { addToken } from './State Mangement/TokenSlice';
import { addUser } from './State Mangement/UserSlice';
import axios from 'axios';
import {addConversation} from './State Mangement/ConversationSlice.js';


export default function App() {

  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.Token);
  const { user } = useSelector((state) => state.User);



  useEffect(() => {

    dispatch(addToken(getCookie("c_user") === undefined ? null : getCookie("c_user")));

  }, []);

  useEffect(() => {

    const getUserData = async () => {
      try {

        const res = await axios.post("/user/", { token: token });
        dispatch(addUser(res.data));

      } catch (e) {
        console.log(e);
      }
    }

    if (token) {
      getUserData();
    } else {
      dispatch(addUser({}));
    }

  }, [token]);

  useEffect(() => {
    const getConversations = async () => {
      try {
        const res = await axios.post(`/chat/getChat/`,{id:user?._id}); 
        dispatch(addConversation(res.data));
      } catch (e) {
        console.log(e);
      }
    }
    getConversations();
  }, [user]);

  return (
    <Routes>
      <Route path='/' element={token === null ? <Navigate to="/account" /> : <ChatPage  />} />
      <Route path='/account' element={token !== null ? <Navigate to="/" /> : <Account />} />
    </Routes>
  )
}
