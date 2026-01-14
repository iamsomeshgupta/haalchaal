"use client";
import {createContext,useState, useEffect} from "react";
import {jwtDecode} from "jwt-decode";
export const AuthContext=createContext();
export default function AuthProvider({children}){
    const [user,setUser]=useState(null);
    const [loading,setLoading]=useState(true);
    useEffect(()=>{
        const token=localStorage.getItem("token");
        if(token){
            try{
                const payload=jwtDecode(token);
                setUser(payload);
            }
            catch(err){
                localStorage.removeItem("token");
                setUser(null);
            }
        }
        setLoading(false);
    },[]);
    return (
        <AuthContext.Provider value={{user,setUser, loading}}>{children}</AuthContext.Provider>
    );
}