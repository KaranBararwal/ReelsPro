import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Video from "@/models/Video";

export async function GET(req : NextRequest){
    await connectToDatabase();

    const url = new URL(req.nextUrl);
    const id = url.pathname.split("/").at(-2);

    if(!id){
        return NextResponse.json({error : "Invalid Request"} , {status : 404});
    }

    try {
        const video = await Video.findById(id).select("likeCount likedUsers");

        if(!video){
            return NextResponse.json({error : "Video not found"} , {status : 404});
        }

        return NextResponse.json({
            likeCount : video.likeCount,
            likedUsers : video.likedUsers,  // send list of user who liked
        } , {status : 200});
    } catch (error) {
        console.error("Error fecthing like data" , error);  
        return NextResponse.json({error : "Internal Server Error"} , {status : 500})
    }
}

export async function POST(req: NextRequest) {
    await connectToDatabase();

    const url = new URL(req.nextUrl);
    const id = url.pathname.split("/").at(-2);

    if(!id){
        return NextResponse.json(
            {error : "Invalid Request"},
            {status : 404}
        );
    }
    
    // const videoId: string = params.id;
    const { userId }: { userId: string } = await req.json();

    if(!userId){
        return NextResponse.json({error : "User ID not provided"} , {status : 400})
    }
    try {
        const video = await Video.findById(id);

        if (!video) {
            return NextResponse.json({ error: "Video not found" }, { status: 404 });
        }

        // ✅ Ensure likedUsers is initialized
        if (!video.likedUsers) {
            video.likedUsers = [];
        }

        const hasLiked = video.likedUsers.includes(userId);

        if (hasLiked) {
            // Unlike: Remove user from likedUsers and decrease count
            video.likedUsers = video.likedUsers.filter((uid: string) => uid !== userId);
                    
            video.likeCount = Math.max(video.likeCount - 1, 0);
        } else {
            // Like: Add user and increase count
            video.likedUsers.push(userId);
            video.likeCount += 1;
        }

        await video.save();

        return NextResponse.json({ 
            likeCount: video.likeCount,
            likedUsers : video.likedUsers, // send updated liked users list
         }, 
            { status: 200 });
    } catch (error) {
        console.error("Error updating like count:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}