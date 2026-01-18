import {Server as IOServer} from "socket.io";
let io:IOServer|null=null;
const onlineUsers=new Set<string>();

export function initSocket(server:any){
    if(!io){
        io=new IOServer(server,{
    cors:{
        origin:"http://localhost:3000",//"*" for any website
    },
    });
    io.on("connection",(socket)=>{
        console.log("Socket connected",socket.id);

        socket.on("join",(userid:string)=>{
            socket.data.userid=userid;
            socket.join(userid);
            console.log(`User ${userid} joined room`);
            onlineUsers.add(userid);
            io?.emit("onlineUsers",Array.from(onlineUsers));
        });
        // socket.on("join",(userId:string)=>{
        //     socket.join(userId);
            
        // });
        socket.on("sendMessage",(message)=>{
            const {receiverId}=message;
            socket.to(receiverId).emit("receiveMessage",message);
        });
        socket.on("disconnect",()=>{
            console.log("Socket disconnected",socket.id);
            const userId=socket.data.userId;
            if(userId)
            {
                onlineUsers.delete(userId);
                io?.emit("onlineUsers",Array.from(onlineUsers));
            }
        });
        socket.on("typing",({receiverId,senderId})=>{
            socket.to(receiverId).emit("typing",{senderId});
        });
        socket.on("stopTyping",({receiverId,senderId})=>{
            socket.to(receiverId).emit("stoptyping",{senderId});
        })
    });
}
return io;
}