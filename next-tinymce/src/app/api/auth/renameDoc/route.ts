import { sql } from "@vercel/postgres";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function PATCH(request: Request) {
  const { email, doclink, docname } = await request.json();

  try {
    // Ensure user is logged in and owns the document
    const session = await getServerSession();
    const sessionEmail = session?.user?.email || "null";

    if (!sessionEmail) throw new Error("Log In required");
    // if (email !== sessionEmail) throw new Error("Unauthorized");
    const newName = docname;
    console.log("id", doclink, "newName", newName, "email", email, "sessionEmail", sessionEmail);
    // Update the document name where the id matches
    const { rowCount } = await sql`
      UPDATE docs
      SET docname = ${newName}
      WHERE link = ${doclink} AND email = ${sessionEmail};
    `;

    // Check if the update was successful
    if (rowCount === 0) {
      return NextResponse.json({ error: "Document not found or not authorized" }, { status: 404 });
    }

    return NextResponse.json({ message: "Document renamed successfully" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}