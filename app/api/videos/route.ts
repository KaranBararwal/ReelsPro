import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import Video, { IVideo } from "@/models/Video";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        // connecting to the database
        await connectToDatabase()
        const videos = await Video.find({}).sort({createdAt : -1}).lean()  // in reverse order of created At

        // if there are no vidoes uploaded
        if(!videos || videos.length === 0){
            return NextResponse.json([] , {status : 200})
        }

        // otherwise return the videos
        return NextResponse.json(videos)
    } catch (error) {
        return NextResponse.json(
            {error : "Failed to fetch the videos"},
            {status : 200}
        )
    }
}


// for uploading the videos
export async function POST(request : NextResponse){
    try {

        // check the session of user
        const session = await getServerSession(authOptions)

        if(!session){
            return NextResponse.json(
                {error : "Unauthorized"},
                {status : 401}
            )
        }

        await connectToDatabase()
        
        const body : IVideo = await request.json()  // get the video from request

        if(
            !body.title || 
            !body.description || 
            !body.videoUrl || 
            !body.thumbnailUrl 
        ){
            return NextResponse.json(
                {error : "Missing required fields"},
                {status : 400}
            );
        }

        const videoData = {
            ...body,
            controls : body.controls ?? true,
            transfromation : {
                height : 1920,
                width = 1080,
                quality : body.transformation?.quality ?? 100 // if not then assign 100%
            }
        }

        const newVideo = await Video.create(videoData)
        return NextResponse.json(newVideo)


    } catch (error) {
        return NextResponse.json(
            {error : "Failed to create a video"},
            {status : 200}
        );
    }
}