import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
    const url = req.nextUrl;


    const searchParams = req.nextUrl.searchParams.toString();
    // Get the pathname of the request (e.g. /, /about, /blog/first-post)
    const path = `${url.pathname}${searchParams.length > 0 ? `?${searchParams}` : ""
        }`
    if (path.startsWith("/profile")) {
        let isLoginCookie = req.cookies.get('isLogin')
        if (isLoginCookie?.value !== 'true') {

            return NextResponse.redirect(`${process.env.WEB_URL}?signin=true`)
        }
    }

    return NextResponse.next()
}



export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
}