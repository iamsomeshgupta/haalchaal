import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/src/lib/db";
import User from "@/src/models/User";
export async function POST(req:Request){
    try{
        await connectDB();
        const {username,email,password}=await req.json();

        if(!username||!email||!password)
       {
        return NextResponse.json({
            message:"All fields are required"
        },
    {
        status:400
    });
       }

       const hashedpassword=await bcrypt.hash(password,10);
       const user=await User.create({
        username,email,password:hashedpassword,
       });
       return NextResponse.json(
        {
            message:"User registered successfully",
            user:{
                id:user._id,
                username:user.username,
                email:user.email,
            },
        },{status:201}
       );
    }
    catch(error){
        console.error("Register error",error);
        return NextResponse.json(
            {message:"server error"},
            {status:500}
        );
    }
}