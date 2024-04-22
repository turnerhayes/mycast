import { NextApiRequest } from "next";
import { NextResponse } from "next/server";
import { promises as fs } from 'fs';

// Make sure that we don't parse JSON bodies on this route:
export const config = {
	api: {
		bodyParser: false,
	},
}

const USE_LOCAL = false;

async function getFeedXML(path: string) {
    if (USE_LOCAL) {
        const headers = {};
        const responseText = await fs.readFile(process.cwd() + '/app/wait_wait_podcast.xml', 'utf8');
        return {
            responseText,
            headers,
        };
    } else {
        const proxyResponse = await fetch(path);

        const headers = Object.fromEntries(proxyResponse.headers.entries());
        delete headers["access-control-allow-origin"];
        delete headers["content-encoding"];

        const blob = await proxyResponse.blob();
        
        return {
            blob,
            headers,
        };
    }

}

export async function GET(req: NextApiRequest, {params: {path}}: {params: {path: string;}}) {
    const {blob, headers} = await getFeedXML(path);

    return new NextResponse(blob, {
        headers,
    });
}
