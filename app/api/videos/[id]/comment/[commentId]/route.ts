import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Video, { IComment } from "@/models/Video";
import mongoose from "mongoose";

export async function DELETE(req:NextRequest) {
    await connectToDatabase();

    const url = new URL(req.nextUrl);
    const paths = url.pathname.split("/");
    const videoId = paths[paths.length - 3];
    const commentId = paths[paths.length - 1];
    console.log("Extracted Video ID:", videoId);
    console.log("Extracted Comment ID:", commentId);

    if(!mongoose.Types.ObjectId.isValid(videoId) || !mongoose.Types.ObjectId.isValid(commentId)){
        return NextResponse.json({
            error : "Invalid video or comment Id" 
        } , 
    {
        status : 400
    });
    }

    try {
        const video = await Video.findById(videoId);

        if(!video){
            return NextResponse.json({error : "Video not found"} , {status : 404});
        }

        // ensure the comment list exists before filtering 
        if(!video.comments){
            return NextResponse.json({error : "No comments found"} , {status : 404});
        }

        // filter out the comment to delete
        video.comments = video.comments.filter((comment : IComment) => comment._id.toString() !== commentId);
        await video.save();

        return NextResponse.json({
            message : "Comment deleted Successfully",
            comments : video.comments
        } , {status : 200});
    } catch (error) {
        console.error("Error deleting comment : ", error);
        return NextResponse.json({error : "Internel server error"} , {status : 500});
    }
}   