// import { authOptions } from "@/lib/auth";
// import { connectToDatabase } from "@/lib/db";
// import Video from "@/models/Video";
// import { getServerSession } from "next-auth";
// import { NextRequest, NextResponse } from "next/server";
// import mongoose from "mongoose";

// export async function GET(request: NextRequest) {
//     try {
//         // Extract ID from the URL
//         const url = new URL(request.url);
//         const id = url.pathname.split("/").pop();

//         // Validate ID
//         if (!id || !mongoose.Types.ObjectId.isValid(id)) {
//             return NextResponse.json({ error: "Invalid video ID" }, { status: 400 });
//         }

//         // Check user session
//         const session = await getServerSession(authOptions);
//         if (!session || !session.user) {
//             return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//         }

//         // Connect to DB
//         await connectToDatabase();

//         // Fetch video by ID
//         const video = await Video.findById(id).lean();

//         if (!video) {
//             return NextResponse.json({ error: "Video not found" }, { status: 404 });
//         }

//         return NextResponse.json(video);
//     } catch (error) {
//         console.error("Error fetching video:", error);
//         return NextResponse.json({ error: "Failed to fetch video" }, { status: 500 });
//     }
// }