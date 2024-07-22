import { sql } from "@vercel/postgres";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(req: Request){
  try {
    // console.log(req)
    const session = await getServerSession();
    const userEmail = session?.user?.email || "null";
    // const userEmail = req.headers.get('email');;
    const response = await sql`
    Select * from docs
    where email = ${userEmail}
  `;
    // console.log(response.rows[0]);
    // return response;
    return NextResponse.json({ message: "success",body: response.rows});
  } catch (e) {
    // console.log({ e });
    return new NextResponse(JSON.stringify({ message: e }), {
      status: 500,
      headers: { "content-type": "application/json" },
    });
  }
  
};