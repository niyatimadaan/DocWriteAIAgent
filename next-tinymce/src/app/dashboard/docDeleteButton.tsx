import { useRouter } from "next/navigation";
import { utapi } from "../api/uploadthing";
import DeleteFunction from "./deleteFunction";


export default function DocDeleteButton({ link }: { link: string }) {
    const router = useRouter();
    const handleSubmit = async (link: string) => {
        DeleteFunction(link);
        router.refresh();
    };
    return (
        <button className="" onClick={() => handleSubmit(link)}>Delete</button>
    )
}