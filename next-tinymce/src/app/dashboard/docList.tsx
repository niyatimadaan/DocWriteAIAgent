import { DocumentCardA } from "./documentCard";

export interface DocumentA {
  access: string;
  docname: string;
  email: string;
  id: string;
  link: string;
}

interface DocumentsListProps {
  documents: DocumentA[];
}

export const DocList: React.FC<DocumentsListProps > = ({ documents }) => {
  return (
    <div className="flex flex-wrap">
      {documents.map((document) => (
        <DocumentCardA  key={document.id} {...document}/>
      ))}
    </div>
  );
};