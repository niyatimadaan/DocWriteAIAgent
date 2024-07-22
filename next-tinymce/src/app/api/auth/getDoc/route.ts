import { sql } from "@vercel/postgres";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { v4 } from "uuid";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    // console.log( searchParams.get('id'));
    const id = searchParams.get('id');

  try {
    if (!id)  return NextResponse.json({ error: "id required" }, { status: 500 });
    
    const session = await getServerSession();
    const email = session?.user?.email || "null";

    const response = await sql`
    Select document from documents
    where doclink = ${id};`;
    // console.log("res  ",response.rows[0]);

    return NextResponse.json({ message: "success", body: response.rows });

  } catch (error) {
    console.log("error", error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
