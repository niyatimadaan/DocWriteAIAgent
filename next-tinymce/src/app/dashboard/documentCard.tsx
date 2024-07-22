import Link from "next/link";
import DocDeleteButton from "./docDeleteButton";

interface DocumentCardProps {
  access: string;
  docname: string;
  email: string;
  id: string;
  link: string;
}

export const DocumentCardA: React.FC<DocumentCardProps> = ({ access, docname, email, id, link }) => {
  const linkId = "/newDoc?id=" + link.slice(18,-5);
  return (
    <div className="bg-white shadow-md p-4 rounded-md border border-gray-200 mr-4 mb-4 max-w-md">
      <h2 className="text-xl font-bold mb-6 overflow-ellipsis overflow-hidden whitespace-nowrap">{docname}</h2>
      <p className="text-gray-500 mb-2">{access}</p>
      <p className="text-gray-500 mb-2">id : {id}</p>
      {/* <Link href ={{pathname: '/blog/[slug]', query: { slug: linkId }}} className="px-4">Edit</Link> */}
      <Link href ={linkId} className="px-4">Edit</Link>
      <DocDeleteButton link={link.slice(18,-5)}></DocDeleteButton>
    </div>
  );
};