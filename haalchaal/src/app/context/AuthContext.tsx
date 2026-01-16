"use client";
import {createContext,useContext,useEffect ,useState} from "react";
type User={
    id:string;
    username:string;
    email:string;
};
type AuthContextType={
    user:User|null;
    setUser:(user:User|null)=>void;
    logout:()=>void;
};

const AuthContext=createContext<AuthContextType|undefined>(undefined);
export function AuthProvider({children}:{children:React.ReactNode}){
    const [user,setUser]=useState<User|null>(null);
    const logout=()=>{
    localStorage.removeItem("token");
    setUser(null);
};
    useEffect(()=>{
    const token=localStorage.getItem("token");
    if(!token)
        return;
    async function fetchUser() {
        try{
            const res=await fetch("/api/auth/me",{
                headers:{
                    Authorization:`Bearer ${token}`,
                },
            });
            if(!res.ok)
            {
                localStorage.removeItem("token");
                setUser(null);
                return;
            }
            const data=await res.json();
            setUser(data.user);
        }
        catch(err){
            console.error("Auth error",err);
            setUser(null);
        }
    }
    fetchUser();
},[]);
return (
    <AuthContext.Provider value={{user,setUser,logout}}>
        {children}
    </AuthContext.Provider>
);
}
export function useAuth(){
    const context=useContext(AuthContext);
    if(!context)
        throw new Error("useAuth must be used inside AuthProvider");
    return context;
}