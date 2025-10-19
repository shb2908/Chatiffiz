import React, { useState } from 'react'
import Login from '../components/Login';
import Signup from '../components/Signup';
import { BsCircle } from 'react-icons/bs'

const Homepage = () => {

    const changeState = () => {
        setState(state === 'Sign in' ? 'Signup' : 'Sign in')
    }

    const [state, setState] = useState('Sign in');

    return (
        <div className='flex-row h-screen justify-center items-center mt-10'>
            <div>
                {state === 'Sign in' ? <Login /> : <Signup />}
            </div>
            <p class=" pb-20 text-center text-sm/6 text-gray-500">
                {state === 'Sign in' ? 'Not a member?' : 'Have an account?'}
                <a href="#" onClick={changeState} class="font-semibold text-indigo-600 hover:text-indigo-500"> {(state === 'Sign in' ? 'Sign up' : 'Sign in') + ' here'}</a>
            </p>
        </div>
    )
}

export default Homepage
