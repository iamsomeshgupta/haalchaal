"use client";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/router";
import { useEffect } from "react";
export default function Protected({children}:{children:React.ReactNode}){
    const {user}=useAuth();
    const router=useRouter();
    useEffect(()=>{
        if(user===null)
            router.push("/login");
    },[user,router]);
    if(!user)
        return <p>Loading...</p>;
    return <>{children}</>;
}