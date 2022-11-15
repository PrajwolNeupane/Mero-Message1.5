import React, { useState } from 'react';
import { Box, InputBase, Stack, Typography, Snackbar } from '@mui/material';
import axios from 'axios';
import setCookie from '../Hooks/setCookie.js';
import { useDispatch } from 'react-redux';
import { addToken } from '../State Mangement/TokenSlice.js';
import { useNavigate } from 'react-router-dom';

export default function Account() {

    const [newUserData, setNewUserData] = useState({
        name: "",
        gender: null,
        password: "",
        email: ""
    });
    const [userData, setUserData] = useState({
        password: "",
        email: ""
    });
    const [errorMessage, setErrorMessage] = useState(null);
    const [isNew, setIsNew] = useState(false);

    //Hooks
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const createNewUser = async () => {
        setErrorMessage(null);
        if (newUserData.name === "") {

            setErrorMessage("User Name is required");

        } else if (newUserData.password === '') {
            setErrorMessage("Password is required");
        } else if (newUserData.email === '') {
            setErrorMessage("User Email is required");
        } else if (!newUserData.email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {
            setErrorMessage("Invalid Email")
        }
        else if (newUserData.gender === null) {
            setErrorMessage("Gender is required");
        }
        else {
            try {

                const res = await axios.post("/auth/register", {
                    username: newUserData.name,
                    password: newUserData.password,
                    email: newUserData.email,
                    gender: newUserData.gender,
                    image: newUserData.gender === "male" ? "https://w7.pngwing.com/pngs/980/886/png-transparent-male-portrait-avatar-computer-icons-icon-design-avatar-flat-face-icon-people-head-cartoon.png" : "https://w7.pngwing.com/pngs/129/292/png-transparent-female-avatar-girl-face-woman-user-flat-classy-users-icon.png"
                });

                setCookie("c_user", res.data.token);
                dispatch(addToken(res.data.token));
                navigate("/");

            } catch (e) {

            }
        }
    }

    const loginUser = async () => {
        setErrorMessage(null);
        if (userData.email === '') {
            setErrorMessage("User Email is required");
        } else if (!userData.email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {
            setErrorMessage("Invalid Email")
        }
        else if (userData.password === '') {
            setErrorMessage("Password is required");
        }
        else {
            try {
                const res = await axios.post("/auth/login", {
                    email: userData.email,
                    password: userData.password
                });

                setCookie("c_user", res.data.token);
                dispatch(addToken(res.data.token));
                navigate("/");

            } catch (e) {
                setErrorMessage(e.response.data.message);
            }
        }
    }

    const handleChange = (e) => {
        if (isNew) {
            setNewUserData({
                ...newUserData,
                [e.target.name]: e.target.value
            });
        } else {
            setUserData({
                ...userData,
                [e.target.name]: e.target.value
            });
        }

    }

    return (
        <Box>
            <Stack sx={{ width: "30%", margin: "90px auto", padding: "25px 2%", backgroundColor: "text.light", gap: "20px" }}>
                {
                    isNew === true ?
                        <><Typography variant='h3' sx={{ fontSize: "30px" }}>Create an Account</Typography>
                            <Stack>
                                <Typography variant='h4' sx={{ fontSize: "16px" }}>Name</Typography>
                                <InputBase placeholder='Enter your name' sx={{ padding: "2px 5px", backgroundColor: "text.main" }} name="name" type="text" onChange={handleChange} />
                            </Stack>
                            <Stack>
                                <Typography variant='h4' sx={{ fontSize: "16px" }}>Email</Typography>
                                <InputBase placeholder='Enter your Email' sx={{ padding: "2px 5px", backgroundColor: "text.main" }} name="email" type
                                    ="email" onChange={handleChange} />
                            </Stack>
                            <Stack>
                                <Typography variant='h4' sx={{ fontSize: "16px", }}>Password</Typography>
                                <InputBase placeholder='Enter your Password' sx={{ padding: "2px 5px", backgroundColor: "text.main" }} name="password" type="password" onChange={handleChange} />
                            </Stack>
                            <Stack>
                                <Typography variant='h4' sx={{ fontSize: "16px" }}>Gender</Typography>
                                <Stack sx={{ flexDirection: "row", gap: "5%" }}>
                                    <input type={"radio"} id='gender' name='gender' value={"male"} onChange={handleChange} />
                                    <Typography>Male</Typography>
                                    <input type={"radio"} id='gender' name="gender" value={"female"} onChange={handleChange} />
                                    <Typography>Female</Typography>
                                </Stack>
                            </Stack>
                            <button style={{ padding: "10px", backgroundColor: "#3a3a3d", border: "none", color: "#f0f0f0", fontSize: "15px" }} onClick={() => {
                                createNewUser();
                            }}>
                                Create
                            </button>
                            <Typography sx={{ cursor: "pointer" }} onClick={() => {
                                setIsNew(false)
                            }}>Have an Account ?</Typography></> : <><Typography variant='h3' sx={{ fontSize: "30px" }}>Login here</Typography>
                            <Stack>
                                <Typography variant='h4' sx={{ fontSize: "16px" }}>Email</Typography>
                                <InputBase placeholder='Enter your Email' sx={{ padding: "2px 5px", backgroundColor: "text.main" }} name="email" type
                                    ="email" onChange={handleChange} />
                            </Stack>
                            <Stack>
                                <Typography variant='h4' sx={{ fontSize: "16px", }}>Password</Typography>
                                <InputBase placeholder='Enter your Password' sx={{ padding: "2px 5px", backgroundColor: "text.main" }} name="password" type="password" onChange={handleChange} />
                            </Stack>
                            <button style={{ padding: "10px", backgroundColor: "#3a3a3d", border: "none", color: "#f0f0f0", fontSize: "15px" }} onClick={() => {
                                loginUser();
                            }}>
                               Login
                            </button>
                            <Typography sx={{ cursor: "pointer" }} onClick={() => {
                                setIsNew(true)
                            }}>Doesn't have an Account ?</Typography></>
                }
            </Stack>
            <Snackbar open={errorMessage === null ? false : true} onClose={() => {
                setErrorMessage(null);
            }} message={errorMessage} autoHideDuration={2500} variant="error" anchorOrigin={{ vertical: "bottom", horizontal: "right" }} />
        </Box>
    )
}
