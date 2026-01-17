import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import connectDB from "@/src/lib/db";
import User from "@/src/models/User";

export async function POST(req: Request) {
    try {
        await connectDB();

        const body = await req.json();
        const { username, email, password } = body;

        if (!username || !email || !password) {
            return NextResponse.json(
                { message: "username, email, and password are required" },
                { status: 400 },
            );
        }

        const existing = await User.findOne({ email });
        if (existing) {
            return NextResponse.json(
                { message: "User already exists" },
                { status: 409 },
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            username,
            email,
            password: hashedPassword,
        });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, {
            expiresIn: "1d",
        });

        return NextResponse.json(
            {
                message: "User registered successfully",
                token,
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                },
            },
            { status: 201 },
        );
    } catch (error) {
        console.error("Register error", error);
        return NextResponse.json(
            { message: "server error" },
            { status: 500 },
        );
    }
}