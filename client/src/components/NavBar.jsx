import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const NavBar = () => {
    const navigate = useNavigate();
    const { isLoggedin, setIsLoggedin, setUserData, backendURL, userData } = useContext(AppContext);

    const logout = async () => {
        try {
            const { data } = await axios.post(backendURL + '/api/auth/logout')
            if (data.success) {
                setIsLoggedin(false);
                setUserData(null);
                navigate('/');
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    return (
        <div>
            <nav class="bg-white dark:bg-gray-800 fixed w-full z-20 top-0 start-0 border-b border-gray-200 dark:border-gray-600 drop-shadow-xl">
                <div class="max-w-full flex flex-wrap items-center justify-between p-4 mx-12">
                    <a href="/" class="flex items-center space-x-3 rtl:space-x-reverse">
                        <img src="Logo.png" class="h-8" alt="Flowbite Logo" />
                        <span class="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">:/Chat~App</span>
                    </a>
                    {userData ?
                        (<div class=" flex  text-slate-200 bg-blue-700 rounded-full w-8 h-8 justify-center items-center relative group">
                            {userData.name[0].toUpperCase()}
                            <div className='absolute bg-transparent pt-10 hidden group-hover:block top-0 right-0 z-10 text-slate-200 rounded bg-gray-900'>
                                <ul className='list-none m-0 p-2 bg-gray-900'>
                                    <li onClick={logout} className='py-1 px-2 cursor-pointer pr-14 hover:bg-gray-600'>Logout</li>
                                    <li className='py-1 px-2 cursor-pointer pr-14 hover:bg-gray-600'><a href="https://github.com/Diptoprovo/">Github</a></li>
                                </ul>
                            </div>
                        </div>)
                        : (<div class="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
                            <button type="button" onClick={() => navigate('/login')} class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Login</button>
                        </div>)
                    }
                </div>
            </nav>


        </div>


    )


}

export default NavBar;
