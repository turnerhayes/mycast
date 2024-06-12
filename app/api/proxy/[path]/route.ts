import { NextApiRequest } from "next";
import { NextResponse } from "next/server";


export async function GET(req: NextApiRequest, {params: {path}}: {params: {path: string;}}) {
    const response = await fetch(path);

    const headers = Object.fromEntries(response.headers.entries());
    delete headers["access-control-allow-origin"];
    delete headers["content-encoding"];

    return new NextResponse(response.body, {
        headers,
    });
}
