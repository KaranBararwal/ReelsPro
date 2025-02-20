import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import Video, { IVideo } from "@/models/Video";
import { getServerSession } from "next-auth";
import { NextRequest , NextResponse } from "next/server";
import mongoose from "mongoose";

export async function GET(request: NextRequest) {
    try {

        // check user session
        const session = await getServerSession(authOptions);

        // console.log("Session Data: GET" , session);  // debuging 

        if(!session || !session.user){
            return NextResponse.json({error : "Unauthorized" } , {status : 401});
        }

        // connecting to the database
        await connectToDatabase()

        // parsing the query param
        const { searchParams } = new URL(request.url);
        const userOnly = searchParams.get("userOnly") === "true";

        let videos;


        if(userOnly){
            // fetch only the user's videos
        
        // for only that user
        // const videos = await Video.find({userId : session.user.id })
        //     .sort({createdAt : -1})
        //     .lean();


        // maybe we need to change string to object
                videos = await Video.find({
            userId: new mongoose.Types.ObjectId(session.user.id)
        }).sort({ createdAt: -1 }).lean();
    } else{
        // fetch all the videos
         videos = await Video.find({}).sort({createdAt : -1}).lean()  // in reverse order of created At

    }
    
        // const videos = await Video.find({}).sort({createdAt : -1}).lean()  // in reverse order of created At

        // console.log("Session User ID:", session?.user?.id);
        // if there are no vidoes uploaded
        if(!videos || videos.length === 0){
            return NextResponse.json([] , {status : 200})
        }

        // otherwise return the videos
        return NextResponse.json(videos)
    } catch  {
        return NextResponse.json(
            {error : "Failed to fetch the videos"},
            {status : 200}
        )
    }
}


// for uploading the videos
// export async function POST(request : NextResponse){
export async function POST(request : NextRequest){
    try {
        // check the session of user
        const session = await getServerSession(authOptions)

        if(!session || !session.user){    // modified
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
            userId: session.user.id,  // 👈 Ensure the video is linked to the correct user
            controls : body.controls ?? true,
            transfromation : {
                height : 1920,
                width : 1080,
                quality : body.transformation?.quality ?? 100 // if not then assign 100%
            }
        }

        const newVideo = await Video.create(videoData)
        return NextResponse.json(newVideo)


    } catch(error){
        console.log(error)
        return NextResponse.json(
            {error : "Failed to create a video"},
            {status : 500}
        );
    }
}