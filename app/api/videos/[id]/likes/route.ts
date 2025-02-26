import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Video from "@/models/Video";

export async function GET(req: NextRequest) {
    await connectToDatabase();

    // extract the video ID from req.nextUrl
    const url = new URL(req.nextUrl);
    const id = url.pathname.split("/").at(-2); // extract the `[id]` part

    if(!id){
        return NextResponse.json({error : "Invalid Request"} , {status : 400})
    }

    try {
        const video = await Video.findById(id).select("likeCount likedUsers");

        if(!video){
            return NextResponse.json({error : "Video not found"} , {status : 404});
        }

        return NextResponse.json({
             likeCount : video.likeCount,
             likedUsers : video.likedUsers,  // send only necessary data
        });
    } catch (error) {
        console.error("Error fetching like data:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
        await connectToDatabase();

        const url = new URL(req.nextUrl);
        const id = url.pathname.split("/").at(-2);  // extract the [id]

        if(!id){
            return NextResponse.json({error : "Invalid Request"} , {status : 400})
        }

        try {
            const video = await Video.findById(id);
            
            if(!video){
                return NextResponse.json({error : "Video not found"} , { status : 404})
            }

            // increase like count and save 
            video.likeCount = (video.likeCount || 0) + 1;
            await video.save();

            return NextResponse.json({message : "Liked Successfully" , likeCount : video.likeCount } , {status : 200});
        } catch (error) {
            console.error("Error liking the video : " , error);
            return NextResponse.json({error : "Internal Server Error" } , {status : 500})
        }
}