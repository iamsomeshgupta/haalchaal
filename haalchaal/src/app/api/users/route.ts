import connectDB from "@/src/lib/db";
import User from "@/src/models/User";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
export async function GET(req:Request) {
    try{
        await connectDB();

        const authheader=req.headers.get("authorization");
        if(!authheader||!authheader.startsWith("Bearer"))
        {
            return NextResponse.json({message:"unauthorized"},{status:401});
        }
        const token=authheader.split(" ")[1];
        const decoded=jwt.verify(token,process.env.JWT_SECRET!) as{id:string};
        const users=await User.find({_id:{$ne:decoded.id}}).select("-password");
        return NextResponse.json({users});
    }
    catch(err)
    {
        return NextResponse.json({message:"server error"},{status:500});
    }
    
}