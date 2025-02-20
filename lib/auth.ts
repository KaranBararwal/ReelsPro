import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import User from "@/models/User";
import { connectToDatabase } from "./db";
import bcrypt from "bcryptjs"

export const authOptions : NextAuthOptions = {
    providers : [
        CredentialsProvider({
            name : "Credentials",
            credentials: {
                email : {label : "Email" , type : "text"},
                password : {label : "Password" , type : "password"}
            },

            async authorize(credentials){
                
                if(!credentials?.email || !credentials?.password){
                    throw new Error("Missing Email or Password")
                }


                try {
                    // connect to the database
                    await connectToDatabase()
                    const user = await User.findOne({email : credentials.email})

                    if(!user){
                        throw new Error("No user found")
                    }

                    const isVaild = await bcrypt.compare(
                        credentials.password,
                        user.password
                    )

                    if(!isVaild){
                        throw new Error("Invalid Password")
                    }

                    return {
                        id : user._id.toString(),
                        email : user.email
                    }

                } catch (error) {
                    throw error
                }
            } 
        }),
    ],

    callbacks : {

        // 
        async jwt({token , user}){
            if(user){
                // secondly we are setting the token id from the user
                // token.id = user.id
                token.sub = user.id
            }

            return token
        },

        // in session we are passing the session and token
        async session({session , token}){
            if(session.user){

                // firstly we are adding the id in the user
                session.user.id = token.sub as string;
            }

            return session;
        }
    },

    pages : {
        signIn : "/login",
        error : "/login"
    },

    session : {
        // here we have two options for saving either database or jwt token so we know it sotres in database by default so we are going to use jwt
        strategy : "jwt",
        maxAge : 30 * 24 * 60 * 60
    },

    secret : process.env.NEXTAUTH_SECRET
};