// here we are creating a file that will handle the fetch request from where we want to send

import { IVideo } from "@/models/Video";


export type VideoFormData = Omit<IVideo , "_id">;
// defining the type for the options 
type FetchOptions = {
    method? : "GET" | "POST" | "PUT" | "DELETE";  
    body?: unknown;
    // body?: any;
    headers? : Record <string , string> ;
};

//using environment variable for base URL in production or localhost during development
const BASE_URL = process.env.NEXT_PUBLIC_API_URI || "";
// const BASE_URL = process.env.NEXT_PUBLIC_API_URI || "http://localhost:3000";

class ApiClient{

    // generalized fetch method
    private async fetch<T> (  // default datatype in typescript is T
        endpoint : string , 
        options : FetchOptions = {} // default value is null
    ) : Promise<T> {
        // destruct the  values from the options
        
        // default value taken here
        const {method = "GET" , body , headers = {}}  = options;

        const defaultHeaders = {
            "Content-Type" : "application/json",
            ...headers,   // if there are more headers than we have expanded it
        };


        // javascipt fetch and the path should be for fetch starts with / cuz we don't have given it here
        // const response = await fetch(`/api${endpoint}`, {

        // use absolute URL for both local and deployed environments
        const response = await fetch(`${BASE_URL}/api${endpoint}` , {
            // giving the default values to the response
            method,
            headers : defaultHeaders,
            body : body ? JSON.stringify(body) : undefined,
        });


        if(!response.ok){
            throw new Error(await response.text());
        }

        // otherwise return the response
        return response.json();
    }

    async getVideos(userOnly: boolean = false) {
        return this.fetch<IVideo[]>(`/videos${userOnly ? "?userOnly=true" : ""}`);
      }
      

    async getAVideo(id : string){
        return this.fetch<IVideo>(`/videos/${id}`);
    }

    async createVideo(videoData : VideoFormData){
        // fetch user session to get the user id
        const response = await fetch("/api/auth/session");
        const session = await response.json();

        if(!session || !session.user){
            throw new Error("User session not found")
        }

        const videoWithUserId = {
            ...videoData,
            userId : session.user.id , // include user id in request body
        };

        return this.fetch<IVideo>("/videos" , {
            method : "POST", // overwrite the GET method to the POST
            body : videoWithUserId,
        });
    }
}

// export in this form
// ek hi object export ho rha hai
export const apiClient = new ApiClient();