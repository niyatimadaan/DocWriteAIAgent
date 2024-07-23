"use client";

import { Editor } from "@tinymce/tinymce-react";
import { useEffect, useRef, useState } from "react";
import clx from "classnames";
import { EditorEvent, Editor as TinyMCEEditor } from "tinymce";
import DeleteFunction from "../dashboard/deleteFunction";
import { useRouter } from "next/navigation";
import LoadingOverlay from "../components/loadingOverlay";
import axios from "axios";

export default function TinymceEditor({
  htmlData,
  id,
}: {
  htmlData: string;
  id: string;
}) {
  const router = useRouter();
  const [urls, seturls] = useState<string[]>([]);
  const [text, setText] = useState<string>(htmlData);
  const [loading, setLoading] = useState<Boolean>(false);
  const [botopen, setBotopen] = useState<Boolean>(false);
  const editorRef = useRef<TinyMCEEditor>();
  const [responses, setResponses] = useState<
    { question: string; answer: any }[]
  >([]);
  const [question, setQuestion] = useState("");
  const [content, setContent] = useState("");
  // debugger;

  // useEffect(() => {
  //   if (urls.length > 0) {
  //     fetch(`/api/auth/addDoc`, {
  //       method: "POST",
  //       body: JSON.stringify({
  //         name: "Document",
  //         email: "email",
  //         link: urls[0],
  //         access: "auth",
  //       }),
  //     });
  //   }
  // }, [urls]);

  useEffect(() => {
    setText(htmlData);
  }, [htmlData]);

  const handleSubmit = async () => {
    setLoading(true);
    if (editorRef.current) {
      console.log(editorRef.current.getContent());
      let htmlString = editorRef.current.getContent();
      if (id != "") {
        const a = await fetch(`/api/auth/updateDoc`, {
          method: "POST",
          body: JSON.stringify({
            email: "email",
            doclink: id,
            document: htmlString,
            access: "auth",
          }),
        });
      } else {
        const a = await fetch(`/api/auth/addDoc`, {
          method: "POST",
          body: JSON.stringify({
            name: "Document",
            email: "email",
            link: id,
            access: "auth",
            htmlString: htmlString,
          }),
        });
        setLoading(false);
        router.refresh();
        router.push("/dashboard");
      }
    }
  };

  const askBot = async () => {
    setLoading(true);
    console.log(editorRef.current?.getContent());
    let htmlString = editorRef.current?.getContent() || "";
    setContent(htmlString);
    // try {
    //   const response = await axios.post("/api/chatbot/loadDocument", {
    //     htmlText: htmlString,
    //     filePath: "",
    //   });
    // } catch (error: any) {
    //   console.log({ error: error.message });
    // }
    setLoading(false);
    setBotopen(true);
  };

  const askQuestion = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    try {
      // const res = await axios.post("/api/chatbot/askQuestion", { question });
      const context = content + responses.map((response) => 'Q:'+ response.question + 'A:'+response.answer).join("\n");
      console.log("content", context);
      const res = await axios.post("/api/chatbot/hf", { documentContent:context, question });
      setResponses([...responses, { question, answer: res.data.answer }]);
    } catch (error: any) {
      console.log({ error: error.message });
      console.log("error it is", error);
    }
    setLoading(false);
  };

  return (
    <>
      <div className="flex mt-10 space-x-4">
        <p className={clx("mt-16", botopen ? "w-2/3" : "w-full")}>
          {loading ? <LoadingOverlay /> : <></>}
          <Editor
            apiKey="ebtmhhfkthrnkh4pgg688wablf9s5g49rei5p64zsxc66t3d"
            onInit={(evt, editor) =>
              (editorRef.current = editor as unknown as TinyMCEEditor)
            }
            initialValue={text}
            init={{
              height: 500,
              menubar: false,
              plugins: [
                "advlist",
                "autolink",
                "lists",
                "link",
                "image",
                "charmap",
                "preview",
                "anchor",
                "searchreplace",
                "visualblocks",
                "code",
                "fullscreen",
                "insertdatetime",
                "media",
                "table",
                "code",
                "help",
                "wordcount",
              ],
              toolbar:
                "undo redo | blocks | " +
                "bold italic forecolor | alignleft aligncenter " +
                "alignright alignjustify | bullist numlist outdent indent | " +
                "removeformat | help",
              content_style:
                "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
            }}
          />
          <div className="mt-4">
            <button
              onClick={handleSubmit}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
            >
              Save
            </button>
            <button
              onClick={askBot}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Ask
            </button>
          </div>
        </p>
        {botopen && (
          <div className="w-1/3 bg-gray-100 p-4 rounded-lg shadow-lg flex flex-col">
            <div className="flex-grow overflow-y-auto">
              {responses.map((response, index) => (
                <div key={index} className="mb-4">
                  <div className="flex">
                    <div className="bg-blue-100 text-blue-900 p-2 rounded-lg mb-2 w-9/10">
                      <strong className="block">Q:</strong> {response.question}
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <div className="bg-green-100 text-green-900 p-2 rounded-lg mb-2 w-9/10">
                      <strong className="block">A:</strong> {response.answer}
                    </div>
                  </div>
                  <hr className="mt-2" />
                </div>
              ))}
            </div>
            <form onSubmit={askQuestion} className="mt-auto flex">
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ask a question"
                className="w-full px-3 py-2 mb-2 border rounded"
              />
              <button
                type="submit"
                className="bg-green-500 hover:bg-green-700 text-white font-bold rounded w-1/6 flex justify-center items-center mb-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  fill="none"
                  viewBox="0 0 32 32"
                  className="icon-2xl"
                >
                  <path
                    fill="currentColor"
                    fill-rule="evenodd"
                    d="M15.192 8.906a1.143 1.143 0 0 1 1.616 0l5.143 5.143a1.143 1.143 0 0 1-1.616 1.616l-3.192-3.192v9.813a1.143 1.143 0 0 1-2.286 0v-9.813l-3.192 3.192a1.143 1.143 0 1 1-1.616-1.616z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
              </button>
            </form>
          </div>
        )}
      </div>
    </>
  );
}
