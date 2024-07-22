import { DocumentA } from "./docList";

export async function getServerSideProps() {
  const response = await fetch(`/api/auth/dashboard`, {
    method: "GET",
  });
  const data = await response.json();
  let jsonArray = data.body;
  
  const docus: DocumentA[] = jsonArray.map((item: any) => item as DocumentA);
  
  return {
    props: {
      docs: docus,
    },
  };
}