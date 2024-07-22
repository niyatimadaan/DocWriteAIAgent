import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-between">
      <div className="flex flex-col items-center justify-center min-h-screen py-2">
        <div className="text-4xl font-bold mb-4" >Welcome to our home page!</div>
        <div className="text-xl mb-8" >Let&apos;s get started with our app.</div>
        <div className="flex items-center">
          <Link href="/register" className="mb-4 mr-4">
            Register
          </Link>
          <Link href="/login" className="mb-4 mr-4">
            Login
          </Link>
          <Link href="/dashboard" className="mb-4">
            Get Started
          </Link>
        </div>
      </div>
    </main>
  );
}
