import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server";

export default withAuth(
    function middleware(){
        return NextResponse.next()
    },

    {
        callbacks : {
            authorized : ({token , req}) => {
                // get the current path
                const {pathname} = req.nextUrl;
                
                // allow auth related routes
                if(
                    pathname.startsWith("/api/auth") || pathname === "/login" || pathname === "/register"
                ){
                    return true;  // The middleware function will only be invoked if the authorized callback returns true.
                }
                
                // public paths
                if(pathname === "/" || pathname.startsWith("/api/vidoes")){
                    return true
                }

                return !!token; // returning the token as boolean
            }
        }
    }
)

// now making the config files for deciding when the middleware function is going to run

export const config = {
    matcher : ["/((?!_next/static|_next/image|favicon.ico|public/).*)"],
}