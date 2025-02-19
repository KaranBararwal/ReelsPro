"use client"

// import React from "react";
import { ImageKitProvider } from "imagekitio-next";
import {SessionProvider} from "next-auth/react" 
import { NotificationProvider } from "./Notification";

const urlEndpoint = process.env.NEXT_PUBLIC_URL_ENDPOINT;
const publicKey = process.env.NEXT_PUBLIC_PUBLIC_KEY;

// this is not a home page so we changed it inot Provider page and pasted the authenticator part in this function
export default function Providers({children} : {children :React.ReactNode}) {

    const authenticator = async () => {
        try {
          // const response = await fetch("http://localhost:3000/api/auth");
          const response = await fetch("/api/imagekit-auth");
      
          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Request failed with status ${response.status}: ${errorText}`);
          }
      
          const data = await response.json();
          const { signature, expire, token } = data;
          return { signature, expire, token };
        } catch (error) {
          console.log(error)
          throw new Error(`Authentication request failed:`);
        }
      };

  return (
      <SessionProvider refetchInterval={5 * 60}>   
      <NotificationProvider>
    {/*  wrap all this in session Provider */}
    <ImageKitProvider 
    urlEndpoint={urlEndpoint}
     publicKey={publicKey}
      authenticator={authenticator}
      >
        {/* ...client side upload component goes here */}
        {children}
      </ImageKitProvider>
      </NotificationProvider>
    {/* //   ...other SDK components added previously */}
    </SessionProvider>
  );
}