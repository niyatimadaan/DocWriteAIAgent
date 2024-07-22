//ask-question.ts

import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { question } = await request.json();

  try {
    const response = await axios.post(
      process.env.FAST_API_URL + "/ask_question",
      { question }
    );
    return NextResponse.json(response.data, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
