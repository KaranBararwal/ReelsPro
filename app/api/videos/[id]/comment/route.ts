import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Video, { IComment } from "@/models/Video";
import mongoose from "mongoose";

export async function GET(req: NextRequest) {
    await connectToDatabase();

    // Issue: If your route is /api/videos/[id]/comment, then .at(-2) might be incorrect, leading to id = "comment" instead of the actual video ID.
    const url = new URL(req.nextUrl);
    const paths = url.pathname.split("/"); // Extract video ID from URL
    const id = paths[paths.length - 2];

    console.log("Extracted ID:", id);
 
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return NextResponse.json({ error: "Invalid video ID" }, { status: 400 });
    }

    if (!id) {
        return NextResponse.json({ error: "Invalid Request" }, { status: 404 });
    }

    try {
   
        const video = await Video.findById(id).select("comments");

        if (!video) {
            return NextResponse.json({ error: "Video not found" }, { status: 404 });
        }

        return NextResponse.json({ comments: video.comments }, { status: 200 });
    } catch (error) {
        console.error("Error fetching comments:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    await connectToDatabase();

    const url = new URL(req.nextUrl);
    // const id = url.pathname.split("/").at(-2); // Extract video ID

    const paths = url.pathname.split("/"); // Extract video ID from URL
    const id = paths[paths.length - 2];

    console.log("Extracted ID:", id);


    if (!id) {
        return NextResponse.json({ error: "Invalid Request" }, { status: 404 });
    }
    try {
    const body = await req.json().catch(() => null);   // safely parse json

    if(!body){
        return NextResponse.json({error  : "Invalid JSON body"} , {status : 400});
    }

    const { userId, comment }: { userId?: string; comment?: string } = body;

    if (!userId || typeof comment !== "string" || !comment.trim()) {
        return NextResponse.json({ error: "User ID and comment required" }, { status: 400 });
    }

    
        const video = await Video.findById(id);

        if (!video) {
            return NextResponse.json({ error: "Video not found" }, { status: 404 });
        }

        // Ensure comments array exists
        if (!video.comments) {
            video.comments = [];
        }

        // Add new comment
        // video.comments.push({ user: userId, text: comment, createdAt: new Date() });
        video.comments.push({ userId, text: comment, createdAt: new Date() });
        await video.save();

        return NextResponse.json({ 
            message : "Comment added successfully" ,
            comments: video.comments.map((c : IComment) => c) 
        }  , { status: 200 });
    } catch (error) {
        console.error("Error adding comment:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}