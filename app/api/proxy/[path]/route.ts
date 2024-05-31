import { NextApiRequest } from "next";
import { NextResponse } from "next/server";
import { promises as fs } from 'fs';

// Make sure that we don't parse JSON bodies on this route:
export const config = {
	api: {
		bodyParser: false,
	},
}

export async function GET(req: NextApiRequest, {params: {path}}: {params: {path: string;}}) {
    const response = await fetch(path);

    const headers = Object.fromEntries(response.headers.entries());
    delete headers["access-control-allow-origin"];
    delete headers["content-encoding"];

    return new NextResponse(response.body, {
        headers,
    });
}
