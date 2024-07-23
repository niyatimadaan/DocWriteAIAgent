// api/loadDocument/route.ts
import axios from 'axios';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    const { htmlText, filePath } = await request.json();
    console.log('htmlText:', process.env.FAST_API_URL);
    
    try {
        const response = await axios.post(process.env.FAST_API_URL + '/load_document', 
            { htmlText, filePath },
            { timeout: 120000 } // Timeout set to 2 minutes (120,000 milliseconds)
        );
        return NextResponse.json(response.data, { status: 200 });
    } catch (error: any) {
        console.log( error, error.message );
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
