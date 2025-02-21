import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import Video, { IVideo } from "@/models/Video";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        // Check if the provided ID is a valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(params.id)) {
            return NextResponse.json({ error: "Invalid video ID" }, { status: 400 });
        }

        // Check user session (authentication)
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Connect to the database
        await connectToDatabase();

        // Fetch the video by ID
        const video = await Video.findById(params.id).lean();

        // If video is not found, return 404
        if (!video) {
            return NextResponse.json({ error: "Video not found" }, { status: 404 });
        }

        return NextResponse.json(video);
    } catch (error) {
        console.error("Error fetching video:", error);
        return NextResponse.json({ error: "Failed to fetch video" }, { status: 500 });
    }
}