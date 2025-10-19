import React, { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { AppContext } from '../context/AppContext';

const Signup = () => {

    const { backendURL, setIsLoggedin, getUserData } = useContext(AppContext);


    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    async function onSubmitHandler(e) {
        try {
            e.preventDefault();
            axios.defaults.withCredentials = true;

            const { data } = await axios.post(backendURL + '/api/auth/register', {
                name, password
            })
            console.log(data.success)

            if (data.success) {
                setIsLoggedin(true);
                getUserData();
                navigate('/chats')
            } else {
                toast.error(data.message);
            }


        } catch (error) {
            toast.error(error.message);
        }
    }


    return (
        <div>
            {/* <!--
     This example requires updating your template:
   
     ```
     <html class="h-full bg-white">
     <body class="h-full">
     ```
   --> */}
            <div class="flex h-3/4 min-h-full flex-col justify-center px-6 py-12 lg:px-8">
                <div class="sm:mx-auto sm:w-full sm:max-w-sm">
                    <img class="mx-auto h-20 w-auto" src="Logo.png" alt="Your Company" />
                    <h2 class="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">Create an Account</h2>
                </div>

                <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form class="space-y-6" onSubmit={onSubmitHandler}>
                        <div>
                            <label for="name" class="block text-sm/6 font-medium text-gray-900">User Name</label>
                            <div class="mt-2">
                                <input type="name" name="name" id="name" placeholder='Enter your user name (unique)' onChange={e => setName(e.target.value)} value={name} autocomplete="name" required class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" />
                            </div>
                        </div>

                        <div>
                            <div class="flex items-center justify-between">
                                <label for="password" class="block text-sm/6 font-medium text-gray-900">Password</label>
                            </div>
                            <div class="mt-2">
                                <input type="password" name="password" id="password" placeholder='Enter a strong password :)' onChange={e => setPassword(e.target.value)} value={password} autocomplete="current-password" required class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" />
                            </div>
                        </div>

                        <div>
                            <button type="submit" class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Sign in</button>
                        </div>
                    </form>
                </div>
            </div>

        </div>
    )
}

export default Signup
