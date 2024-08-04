import { DocumentCardA } from "./documentCard";

export interface DocumentA {
  access: string;
  docname: string;
  email: string;
  id: string;
  link: string;
}

export interface DocumentsListProps {
  documents: DocumentA[];
  setDocs: React.Dispatch<React.SetStateAction<DocumentA[]>>;
}


export const DocList: React.FC<DocumentsListProps > = ({ documents, setDocs } : DocumentsListProps) => {
  return (
    <div className="flex grid max-lg:grid-cols-3 max-md:grid-cols-1 lg:grid-cols-4 px-14 max-md:px-4 my-4">
      {documents.map((document) => (
        <DocumentCardA  key={document.id} {...document} setDocs={setDocs}/>
      ))}
    </div>
  );
};