"use client";

import { DocList, DocumentA } from "./docList";
import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchDocs } from "./fetchDocs";

export default function DashboardPage() {
  const [docs, setDocs] = useState<DocumentA[]>([]);

  useEffect(() => {
    const fetchUserSession = async () => {
      try {
        const docus = await fetchDocs();
        setDocs(docus);
      } catch (error) {
        console.error(error);
      }
    };
    fetchUserSession();
  }, []);

  return (
    <>
      <div className="flex flex-col min-h-screen py-2 pt-24 px-5">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 px-14">
          <p className="text-4xl font-bold mb-4">My Documents</p>
          <Link
            href="/newDoc"
            className="mr-4 max-w-32 ml-auto text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full px-5 py-2.5 text-center me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Add New
          </Link>
        </div>
        <DocList documents={docs} />
      </div>
    </>
  );
}
