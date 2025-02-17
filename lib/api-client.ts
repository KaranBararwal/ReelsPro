// here we are creating a file that will handle the fetch request from where we want to send

import { IVideo } from "@/models/Video";


export type VideoFormData = Omit<IVideo , "_id">;
// defining the type for the options 
type FetchOptions = {
    method? : "GET" | "POST" | "PUT" | "DELETE";  
    body?: any;
    headers? : Record <string , string> ;
};

class ApiClient{
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
        const response = await fetch(`/api${endpoint}`, {

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



    // now we are defining some different methods
    async getVideos(){
        return this.fetch<IVideo[]>("/videos"); // type is videos array
    }

    async getAVideo(id : string){
        return this.fetch<IVideo>(`/videos/${id}`);
    }

    async createVideo(videoData : VideoFormData){
        return this.fetch<IVideo>("/vidoes" , {
            method : "POST", // overwrite the GET method to the POST
            body : videoData,
        });
    }
}

// export in this form
// ek hi object export ho rha hai
export const apiClient = new ApiClient();