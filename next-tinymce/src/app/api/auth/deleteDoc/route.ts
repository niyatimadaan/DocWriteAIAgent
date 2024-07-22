import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";
import { v4 } from "uuid";
import { utapi } from "../../uploadthing";

export async function DELETE(request: Request) {
  let { link } = await request.json();
  
  try {
    if (!link) throw new Error("link required");
    await utapi.deleteFiles(link + ".html");
    const link2 = "https://utfs.io/f/"+ link +".html";

    await sql`
           DELETE FROM docs WHERE link = ${link2};`;
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }

  const docs = await sql`SELECT * FROM docs;`;
  return NextResponse.json({ docs }, { status: 200 });
}
