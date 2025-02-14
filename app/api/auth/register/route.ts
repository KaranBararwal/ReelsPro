import { NextRequest , NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";

export async function POST(request : NextRequest){

    try {
        // extracting the email and password
        const {email , password} = await request.json()

        if(!email || !password){
            return NextResponse.json(
                {error : "Email and password are required"},
                {status : 400}
            );
        }

        await connectToDatabase() // setting the connection to the database
        
        const existingUser = await User.findOne({email})   // getting the user

        // if the user is already there then we don't have to make him register again
        if(existingUser){
            return NextResponse.json(
                {error : "Email is already registered"},
                {status : 400}
            );
        }


        // otherwise create the user
        await User.create({
            email , 
            password,
        });

        return NextResponse.json(
            {message : "User registered successfully"},
            {status : 201}
        );

    } catch (error) {
        console.error("Registration error:", error);
        return NextResponse.json(
            { error : "Failed to register the user"},
            { status : 500}
        );
    }
}