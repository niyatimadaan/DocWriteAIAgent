import { DocumentA } from "./docList";

export async function fetchDocs() {
    const response = await fetch(`/api/auth/dashboard`, {
        method: "GET",
    });
    const data = await response.json();
    let jsonArray = data.body;

    let docus = jsonArray.map((item: any) => item as DocumentA);
    return docus;
}