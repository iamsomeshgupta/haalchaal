import {Server as IOServer} from "socket.io";
let io:IOServer|null=null;
export function initSocket(server:any){
    if(!io){
        io=new IOServer(server,{
    cors:{
        origin:"*",
    },
    });
    io.on("connection",(socket)=>{
        console.log("Socket connected",socket.id);
        
        socket.on("join",(userId:string)=>{
            socket.join(userId);
            console.log(`User ${userId} joined room`);
        });
        socket.on("sendMessage",(message)=>{
            const {receiverId}=message;
            socket.to(receiverId).emit("receiveMessage",message);
        });
        socket.on("disconnect",()=>{
            console.log("Socket disconnected",socket.id);
        });
    });
}
return io;
}