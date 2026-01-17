import mongoose from "mongoose";
const MONGODB_URI=process.env.MONGODB_URI!;
const cached=(global as any).mongoose||{conn:null,promise:null};
export default async function connectDB() {
    if(cached.conn)
        return cached.conn;
    if(!cached.promise)
        cached.promise=mongoose.connect(MONGODB_URI).then((mongoose)=>mongoose);
    cached.conn=await cached.promise;
    (global as any).mongoose=cached;
    return cached.conn;
}
/*The code implements connection pooling/caching to avoid creating multiple database connections:

First call: Creates a new connection and caches it in global.mongoose
Subsequent calls: Reuses the existing cached connection
Prevents connection exhaustion: In serverless environments (like Vercel/Next.js), API routes can spin up multiple instances. Without caching, each request would create a new connection, quickly exhausting MongoDB's connection limit.*/