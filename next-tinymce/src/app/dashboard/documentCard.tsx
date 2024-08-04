import Link from "next/link";
import DocDeleteButton from "./docDeleteButton";
import { DocumentA } from "./docList";

interface DocumentCardProps {
  access: string;
  docname: string;
  email: string;
  id: string;
  link: string;
  setDocs: React.Dispatch<React.SetStateAction<DocumentA[]>>;
}

export const DocumentCardA: React.FC<DocumentCardProps> = ({
  access,
  docname,
  email,
  id,
  link,
  setDocs,
}) => {
  const linkId = "/newDoc?id=" + link;
  return (
    <div className="bg-white shadow-md p-4 rounded-md border border-gray-200 mr-4 mb-4 max-w-md">
      <h2 className="text-xl font-bold mb-6 overflow-ellipsis overflow-hidden whitespace-nowrap">
        {docname}
      </h2>
      <p className="text-gray-500 mb-2">{access}</p>
      <p className="text-gray-500 mb-2">id : {id}</p>
      {/* <Link href ={{pathname: '/blog/[slug]', query: { slug: linkId }}} className="px-4">Edit</Link> */}
      <div className="flex justify-end mt-6">
        <Link href={linkId} className="">Edit</Link>
        <DocDeleteButton link={link} setDocs={setDocs}></DocDeleteButton>
      </div>
    </div>
  );
};
