import { sql } from "@vercel/postgres";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { v4 } from "uuid";

export async function POST(request: Request) {
  //   const { searchParams } = new URL(request.url);
  let { email, doclink, document, access } = await request.json();
  const id = v4();

  try {
    if (email == "email") {
      const session = await getServerSession();
      email = session?.user?.email || "null";
    }
    if (!email) throw new Error("Log In required");
    if (!doclink) throw new Error("Link required");

    await sql`
        INSERT INTO documents (doclink, document)
        VALUES (${doclink}, ${document});`;

  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }

  const docs = await sql`SELECT * FROM docs;`;
  return NextResponse.json({ docs }, { status: 200 });
}
