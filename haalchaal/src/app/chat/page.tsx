"use client";
import { useEffect,useState } from "react";
import { useAuth } from "../context/AuthContext";
import { io } from "socket.io-client";
const socket = io();

interface User{
    _id:string;
    username:string;
    email:string;
}
interface Message{
    _id:string;
    sender:string;
    receiver:string;
    content:string;
    createdAt:string;
}
export default function ChatPage(){
    const {user}=useAuth();
    const [selectedUser,setSelectedUser]=useState<User|null>(null);
    const [messages,setMessages]=useState<Message[]>([]);
    const [users,setUsers]=useState<User[]>([]);
    const[isTyping,setIsTyping]=useState(false);
    const [newMessage,setnewMessage]=useState("");
    const [onlineUsers, setOnlineUsers] = useState<string[]>([]);


    async function sendMessage() {
        if(!newMessage.trim()||!selectedUser)
            return;
        const token=localStorage.getItem("token");
        if(!token)
            return;
        const res=await fetch("/api/messages",{
            method:"POST",
            headers:{
                "Content-Type":"application/json",
                Authorization:`Bearer ${token}`,
            },
            body:JSON.stringify({
                receiverId:selectedUser._id,
                content:newMessage,
            }),
        });
        const data=await res.json();
        setMessages((prev)=>[...prev,data.message]);
        setnewMessage("");
    }
    useEffect(()=>{
        const token=localStorage.getItem("token");
        if(!token)
            return;
        async function fetchUsers() {
            const res=await fetch("/api/users",{
                headers:{
                    Authorization:`Bearer ${token}`,
                },
            });
            const data=await res.json();
            setUsers(data.users);
        }
        fetchUsers();
    },[]);
    useEffect(() => {
  if (!socket) return;

  socket.on("messagesSeen", ({ by }) => {
    if (by === selectedUser?._id) {
      setMessages((prev) =>
        prev.map((m) =>
          m.sender === user?.id
            ? { ...m, seen: true }
            : m
        )
      );
    }
  });

  return () => {
    socket.off("messagesSeen");
  };
}, [selectedUser]);

    useEffect(()=>{
        if(!selectedUser)
            return;
        const token=localStorage.getItem("token");
        if(!token)
            return;
        async function fetchMessages() {
            const res=await fetch(`/api/messages/${selectedUser?._id}`,{
                headers:{
                    Authorization:`Bearer ${token}`,
                },
            });
            const data=await res.json();
            setMessages(data.messages);
        }
        fetchMessages();
    },[selectedUser]);
useEffect(() => {
  socket.on("typing", ({ senderId }) => {
    if (senderId === selectedUser?._id) {
      setIsTyping(true);
    }
  });

  socket.on("stopTyping", ({ senderId }) => {
    if (senderId === selectedUser?._id) {
      setIsTyping(false);
    }
  });

  return () => {
    socket.off("typing");
    socket.off("stopTyping");
  };
}, [selectedUser]);

useEffect(() => {
  socket.on("onlineUsers", (users) => {
    setOnlineUsers(users);
  });

  return () => socket.off("onlineUsers");
}, []);

    return(
        <div>
            <h2>Chats</h2>
            {users.map((u:any)=>(
                <div key={u._id} onClick={()=>setSelectedUser(u)} style={{cursor:"pointer"}}>{u.username}{onlineUsers.includes(u._id) ? " 🟢" : " ⚫"}</div>
            ))}
            {selectedUser&&(
                <div>
                    <h3>Chat with {selectedUser.username}</h3>
                    {messages.map((m:any)=>(
                        <div key={m._id}>
                            <b>{m.sender===user?.id?"You":selectedUser.username}:</b>{" "}
                            {m.content}
                            </div>
                    ))}
        </div>
    )
}
{selectedUser&&(
    <div>
        {isTyping && <p>{selectedUser.username} is typing...</p>}

        <input value={newMessage} onChange={(e)=>{setnewMessage(e.target.value);   socket.emit("typing", {
      receiverId: selectedUser._id,
      senderId: user?.id,
    });}} onBlur={() => {
    socket.emit("stopTyping", {
      receiverId: selectedUser._id,
      senderId: user?.id,
    });
  }} placeholder="type a message..."></input>
        <button onClick={sendMessage}>Send</button>
        </div>
)}
</div>

)};