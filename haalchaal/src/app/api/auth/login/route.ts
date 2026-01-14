import bcrypt from "bcryptjs";
import User from "@/src/models/User";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import connectDB from "@/src/lib/db";
export async function POST(req:Request){
    try{
        await connectDB();
        const {email,password}=await req.json();
        if(!email||!password)
        {
            return NextResponse.json(
                {message:"email and password are required"},
                {status:400}
            );
        }

const user=await User.findOne({email}).select("+password");
if(!user)
    return NextResponse.json({
message:"user doesn't exists",
},{status:400});

const ismatch=await bcrypt.compare(password,user.password);
if(!ismatch){
    return NextResponse.json({
        message:"invalid creds"
    },{status:400});
}
const token=jwt.sign(
{id:user._id},
process.env.JWT_SECRET!,
{expiresIn:"1d"}
);
return NextResponse.json({
    message:"Login successful",
    token,
    user:{
        id:user._id,
        username:user.username,
        email:user.email,
    },
});
    }catch(err){
        console.error("login error",err);
        return NextResponse.json(
            {message:"Server error"},
            {status:500}
        );
    }

}