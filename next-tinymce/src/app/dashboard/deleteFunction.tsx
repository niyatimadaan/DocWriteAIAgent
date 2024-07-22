
export default async function DeleteFunction(link: string ) {
    // console.log(link)
    const response = await fetch(`/api/auth/deleteDoc`, {
        method: "DELETE",
        body: JSON.stringify({
            link: link,
        }),
    });
}
