"use client";
import { useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { FormEvent } from "react";
// import { useRouter } from "next/navigation";required for redirection

export default function Login(){
    const [email,setEmail]=useState("");
    const[password,setPassword]=useState("");
    const [error,setError]=useState("");
    const [username,setUsername]=useState("");
    const[islogin,setIslogin]=useState(true);
   
    const {setUser}=useAuth();
    
    const handleSubmit=async(e:FormEvent<HTMLFormElement>):Promise<void>=>{
        e.preventDefault();
        setError("");
        try{
            const endpoint=islogin?"/auth/login":"/auth/register";
            const payload=islogin
                ? {email,password}
                : {username,email,password};

            const res=await api.post(endpoint,payload);
            const {token,user}=res.data;

            if(token)
                localStorage.setItem("token",token);

            if(user)
                setUser(user);

            //router.push("/projects");
        }
        catch(err:any){
            const message=err.response?.data?.message||"Auth failed";
            setError(message);
        }
    };
    return (
        <div className="flex h-screen w-full items-center justify-center bg-gray-50">
            <div className="border border-gray-300 rounded-xl p-8 shadow-lg bg-white w-full max-w-md">
                <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
                    <h2 className="text-xl font-semibold text-center">{islogin?"Login to HaalChaal":"Create an Account"}</h2>
                    {error && <p style={{color:"red"
                    }}>{error}</p>}
                    <input type="text" placeholder="Username" value={username} onChange={(e)=>setUsername(e.target.value)} className="border p-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" required id="username"></input>
                    <input type="email" placeholder="Email" id="email" value={email} onChange={(e)=>setEmail(e.target.value)} className="border p-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" required autoComplete="email"></input>
                    <input type="password" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)} className="border p-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" required id="password"></input>
                    <button type="submit" className="bg-black text-white p-2 rounded-lg hover:bg-gray-800 transition cursor-pointer">{islogin?"Sign In":"Sign Up"}</button>
                    <button type="button" onClick={()=>setIslogin(!islogin)} className="cursor-pointer hover:text-red-900 hover:underline">{islogin?"Create an account":"Sign in here"}</button>
                </form>
            </div>
        </div>
    )
}