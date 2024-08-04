import { useRouter } from "next/navigation";
import { utapi } from "../api/uploadthing";
import DeleteFunction from "./deleteFunction";
import { DocumentA } from "./docList";


export default function DocDeleteButton({ link, setDocs }: { link: string, setDocs: React.Dispatch<React.SetStateAction<DocumentA[]>> }) {
    const router = useRouter();
    const handleSubmit = async (link: string) => {
        DeleteFunction(link);
        setDocs((prev) => prev.filter((doc) => doc.link !== link));
        router.refresh();
    };
    return (
        <button className="px-4" onClick={() => handleSubmit(link)}>Delete</button>
    )
}