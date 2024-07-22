import { sql } from "@vercel/postgres";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { v4 } from "uuid";

export async function POST(request: Request) {
  //   const { searchParams } = new URL(request.url);
  let { name, email, link, access } = await request.json();
  const id = v4();

  try {
    if (email == "email") {
      const session = await getServerSession();
      email = session?.user?.email || "null";
    }
    if (!email) throw new Error("Log In required");
    if (!link) throw new Error("Link required");

    await sql`
        INSERT INTO docs (id ,docname, email , link, access)
        VALUES ( ${id},${name}, ${email}, ${link}, ${access});`;
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }

  const docs = await sql`SELECT * FROM docs;`;
  return NextResponse.json({ docs }, { status: 200 });
}
