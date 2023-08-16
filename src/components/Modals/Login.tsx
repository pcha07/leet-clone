import { authModalState } from '@/atoms/authModalAtom'
import { auth } from '@/firebase/firebase';
import Router, { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { toast } from 'react-toastify';
import {  useSetRecoilState } from 'recoil'

interface LoginProps {
    
}

const Login:React.FC<LoginProps> = () => {
    const setAuthModalState = useSetRecoilState(authModalState);
    const handleClick = (type:"login" | "register" | "forgotPassword") => {
        setAuthModalState((prev) => ({...prev, type}))
    }
    const [inputs, setInputs] = useState({ email: "", password: "" })

    const router = useRouter();

    const [
        signInWithEmailAndPassword,
        user,
        loading,
        error
    ] = useSignInWithEmailAndPassword(auth);

    const handleInputChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if(!inputs.email || !inputs.password) return alert("Please fill all fields");

        try {
            const newUser = await signInWithEmailAndPassword(inputs.email, inputs.password);
            if(!newUser) return;
            router.push("/");
        } catch (error:any) {
            toast.error(error.message, { position: "top-center", autoClose: 3000, theme: "dark" })
        }
    }

    useEffect(() => {
        if(error) toast.error(error.message, { position: "top-center", autoClose: 3000, theme: "dark" })
    },[error])
    

    return (
        <form className="space-y-6 px-6 pb-4" onSubmit={handleLogin}>
            <h3 className="text-xl font-medium text-white">Sign in to LeetCode</h3>
            <div className="">
                <label htmlFor="email" className="text-sm font-medium block mb-2 text-gray-300">Your Email</label>
                <input onChange={handleInputChange} type="email" name="email" id="email" className="border-2 outline-none sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-gray-600 border-gray-500 placeholder:text-gray-400 text-white" placeholder="name@email.com"/>
            </div>

            <div className="">
                <label htmlFor="password" className="text-sm font-medium block mb-2 text-gray-300">Your password</label>
                <input onChange={handleInputChange} type="password" name="password" id="password" className="border-2 outline-none sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-gray-600 border-gray-500 placeholder:text-gray-400 text-white" placeholder="******"/>
            </div>

            <button className="w-full text-white focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-brand-orange hover:bg-brand-orange-s" type="submit">
                {loading ? "Loading..." : "Log in"}
            </button>

            <button className="flex w-full justify-end" onClick={() => handleClick("forgotPassword")}>
                <a href="#" className="text-sm block text-brand-orange hover:underline w-full text-right">
                    Forgot Password?
                </a>
            </button>

            <div className="text-sm font-medium text-gray-300">
                Not Registered? {" "}
                <a href="#" className="text-blue-700 hover:underline" onClick={() => handleClick("register")}>
                    Create account
                </a>
                </div>
        </form>
    )
}

export default Login
