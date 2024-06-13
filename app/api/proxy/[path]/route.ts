import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest, {params: {path}}: {params: {path: string;}}) {
    const response = await fetch(path);

    const headers = Object.fromEntries(response.headers.entries());
    delete headers["access-control-allow-origin"];
    delete headers["content-encoding"];

    return new NextResponse(response.body, {
        headers,
    });
}
