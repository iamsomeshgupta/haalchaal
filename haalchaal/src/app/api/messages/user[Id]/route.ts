import connectDB from "@/src/lib/db";
import Message from "@/src/models/Message";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
export async function GET(req:Request,{params}:{params:{userId:string}}) {
    try{
        await connectDB();
        const authheader=req.headers.get("authorization");
        if(!authheader?.startsWith("Bearer ")){
            return NextResponse.json({message:"Unauthorized"},{status:401});
        }
        const token=authheader.split(" ")[1];
        const decoded=jwt.verify(token,process.env.JWT_SECRET!) as{id:string};
        const messages=await Message.find({
            $or:[{sender:decoded.id,receiver:params.userId},
                {sender:params.userId,receiver:decoded.id},
            ],
        }).sort({createdAt:1});
        return NextResponse.json({messages});
    }
    catch(err){
        return NextResponse.json(
            {message:"server error"},{status:500}
        );
    }
    
}