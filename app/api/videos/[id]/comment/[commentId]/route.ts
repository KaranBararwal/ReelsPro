import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Video, { IComment } from "@/models/Video";
import mongoose from "mongoose";

export async function PATCH(req:NextRequest) {
    await connectToDatabase();

    const url = new URL(req.nextUrl);
    const paths = url.pathname.split("/");
    const videoId = paths[paths.length - 3];
    const commentId = paths[paths.length - 1];

    if(!mongoose.Types.ObjectId.isValid(videoId) || !mongoose.Types.ObjectId.isValid(commentId)){
        return NextResponse.json(
            {error : "Invalid video or comment ID"},
            {status : 400}
        );
    }

    try{
        const body = await req.json();
        const {newText} : {newText? : string} = body;

        if(!newText || typeof newText !== "string" || !newText.trim()){
            return NextResponse.json(
                {error : "Updated comment text required"},
                {status : 400}
            );
        }

        const video = await Video.findById(videoId);

        if(!video){
            return NextResponse.json(
                {error : "Video not found"},
                {status : 404}
            );
        }

        console.log("Video found. Comments:", video.comments.map(
           ( c : IComment )=> c._id.toString()));
        console.log("Trying to match commentId:", commentId);

        const comment = video.comments?.find(
            (c : IComment) => c._id.toString() === commentId
        );

        if(!comment){
            return NextResponse.json(
                {error : "Comment not found"},
                {status : 404});
        }

        comment.text = newText;
        await video.save();
        
        return NextResponse.json({
            message : "Comment updated successfully",
            updatedComment : {
                _id : comment._id,
                userId : comment.userId,
                text : comment.text,
                createdAt : comment.createdAt,
            },
        });
    } catch(error){
        console.error("Error updating comment:" , error);
        return NextResponse.json(
            {error : "Internel Server Error"},
            {status : 500}
        );
    }
}

export async function DELETE(req: NextRequest) {
    await connectToDatabase();

    const url = new URL(req.nextUrl);
    const paths = url.pathname.split("/");
    const videoId = paths[paths.length - 3];
    const commentId = paths[paths.length - 1];

    console.log("Extracted Video ID:", videoId);
    console.log("Extracted Comment ID:", commentId);

    if (!mongoose.Types.ObjectId.isValid(videoId) || !mongoose.Types.ObjectId.isValid(commentId)) {
        return NextResponse.json({ error: "Invalid video or comment ID" }, { status: 400 });
    }

    try {
        const video = await Video.findById(videoId);
        if (!video) {
            return NextResponse.json({ error: "Video not found" }, { status: 404 });
        }

        const originalLength = video.comments.length;

        video.comments = video.comments.filter(
            (comment: IComment) => comment._id.toString() !== commentId
        );

        if (video.comments.length === originalLength) {
            return NextResponse.json({ error: "Comment not found" }, { status: 404 });
        }

        await video.save();

        return NextResponse.json({
            message: "Comment deleted successfully",
            comments: video.comments
        }, { status: 200 });

    } catch (error) {
        console.error("Error deleting comment:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
