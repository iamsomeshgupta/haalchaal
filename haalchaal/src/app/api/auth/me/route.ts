import jwt from "jsonwebtoken";
import connectDB from "@/src/lib/db";
import User from "@/src/models/User";
import { NextResponse } from "next/server";
export async function GET(req:Request) {
    try{
        await connectDB();
        //read authorization header
        const authheader=req.headers.get("authorization");
        if(!authheader||!authheader.startsWith("Bearer ")){
            return NextResponse.json(
                {message:"Unauthorized"},
                {status:401}
            );
        }
        //extract token
        const token=authheader.split(" ")[1];
        //verify token
        const decoded=jwt.verify(
            token,
            process.env.JWT_SECRET!
        ) as {id:string};//?
        //find user
        const user=await User.findById(decoded.id).select("-password");//?
        if(!user)
            return NextResponse.json({
        message:"User not found"},
    {status:404});

    return NextResponse.json({user});
    }
    catch(err)
    {
        return NextResponse.json({
            message:"Invalid token"
        },{status:401});
    }
}