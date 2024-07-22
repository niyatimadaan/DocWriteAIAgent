'use client';

import { useSearchParams } from 'next/navigation';
import { useRouter } from "next/compat/router";
import TinymceEditor from './document';
import { useEffect, useState } from 'react';

export default function NewDocPage() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  // debugger;
  const [html, setHtml] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // debugger;
    const fetchDoc = async () => {
      setLoading(true);
      try {
        if (id) {
          const response = fetch(`https://utfs.io/f/${id}.html`, {
            method: "GET",
          })
          const re = await response;
          const html = await re.text();
          setHtml(html);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }

    fetchDoc();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>; // Or any other loading indicator
  }

  return <TinymceEditor htmlData={html} id={id || ""} />;
}