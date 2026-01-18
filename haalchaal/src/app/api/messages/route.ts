import connectDB from "@/src/lib/db";
import Message from "@/src/models/Message";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
export async function POST(req:Request) {
    try{
        await connectDB();
        const authheader=req.headers.get("authorization");
        if(!authheader||!authheader.startsWith("Bearer ")){
            return NextResponse.json({message:"Unauthorized"},{status:401});
        }
        const token=authheader.split(" ")[1];
        const decoded=jwt.verify(
            token,process.env.JWT_SECRET!
        )as{id:string};
        const {receiverId,content}=await req.json();
        if(!receiverId||!content)
        {
            return NextResponse.json(
                {message:"Missing fields"},
                {status:400}
            );
        }
        await Message.updateMany(
  {
    sender: receiverId,
    receiver: decoded.id,
    seen: false,
  },
  { seen: true }
);

// after updateMany
const io = (global as any).io;
if (io) {
  io.to(receiverId).emit("messagesSeen", {
    by: decoded.id,
  });
}

        const message=await Message.create({
            sender:decoded.id,
            receiver:receiverId,
            content,
        });
        
        return NextResponse.json({message});
    }
    catch(error){
        return NextResponse.json({message:"server error"},{status:500});
    }
    
}