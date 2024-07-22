import { NextResponse } from 'next/server';
import { hash } from 'bcrypt';
import { sql } from '@vercel/postgres';

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();
    // validate email and password
    console.log({ email, password });

    const hashedPassword = await hash(password, 10);

    const response = await sql`
      INSERT INTO users (name, email, password)
      VALUES ( ${name}, ${email}, ${hashedPassword})
    `;
  } catch (e) {
    console.log({ e });
    return new NextResponse(
      JSON.stringify({ message: e }),
      { status: 500, headers: { 'content-type': 'application/json' } }
    );
  }

  return NextResponse.json({ message: 'success' });
}