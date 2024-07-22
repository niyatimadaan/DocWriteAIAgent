// pages/api/load-document.js
import axios from 'axios';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    const { htmlText, filePath } = await request.json();
    
    try {
        const response = await axios.post('http://localhost:5000/load_document', {htmlText, filePath });
        return NextResponse.json(response.data, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// export default async function handler(req, res) {
//   if (req.method === 'POST') {
//     const { filePath } = req.body;

//     try {
//       const response = await axios.post('http://localhost:5000/load_document', { filePath });
//       res.status(200).json(response.data);
//     } catch (error) {
//       res.status(500).json({ error: error.message });
//     }
//   } else {
//     res.setHeader('Allow', ['POST']);
//     res.status(405).end(`Method ${req.method} Not Allowed`);
//   }
// }
