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
  docname,
}: {
  htmlData: string;
  id: string;
  docname: string;
}) {
  const router = useRouter();
  const [urls, seturls] = useState<string[]>([]);
  const [text, setText] = useState<string>(htmlData);
  const [loading, setLoading] = useState<Boolean>(false);
  const [botopen, setBotopen] = useState<Boolean>(false);
  const editorRef = useRef<TinyMCEEditor>();
  const [responses, setResponses] = useState<{ question: string; answer: any }[]>([]);
  const [question, setQuestion] = useState("");
  const [content, setContent] = useState("");
  const [name, setName] = useState(docname);
  const [isEditing, setIsEditing] = useState(false);
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
        setLoading(false);
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
      const context =
        content +
        responses.map((response) => "Q:" + response.question + "A:" + response.answer).join("\n");
      console.log("content", context);
      // const res = await axios.post("/api/chatbot/hf", { documentContent:content, question });
      const res = await axios.post("/api/chatbot/gemini", { documentContent: content, question });
      setResponses([...responses, { question, answer: res.data.answer }]);
      setQuestion("");
    } catch (error: any) {
      console.log({ error: error.message });
      console.log("error it is", error);
    }
    setLoading(false);
  };

  const rename = async () => {
    // const name = prompt("Enter new name");
    if (name) {
      const a = await fetch(`/api/auth/renameDoc`, {
        method: "PATCH",
        body: JSON.stringify({
          email: "email",
          doclink: id,
          docname: name,
        }),
      });
      console.log(a,"renamed");
      // router.refresh();
    }
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (name.trim()) {
      // onSave(title);
      rename();
    } else {
      setName(docname); 
    }
  };

  const handleKeyDown = (e : any) => {
    if (e.key === 'Enter') {
      handleBlur();
    }
  };

  return (
    <>
      <div className="mt-[67px]">
        <div className="text-[2rem] font-bold px-4">{isEditing ? (
        <input
          type="text"
          value={name}
          autoFocus
          onChange={(e) => {setName(e.target.value)
            console.log("changed ",name)
          }}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className="title-input"
        />
      ) : (
        <h1 className="title-display" onClick={() => setIsEditing(true)}>
          {name || 'Untitled Document'}
        </h1>
      )}</div>
        {/* <h1 className="text-[2rem] font-bold px-4">
          {name}{" "}
          <button onClick={rename}>
            <svg
              fill="#000000"
              version="1.1"
              id="Capa_1"
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              viewBox="0 0 494.936 494.936"
              xmlSpace="preserve"
            >
              <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
              <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
              <g id="SVGRepo_iconCarrier">
                {" "}
                <g>
                  {" "}
                  <g>
                    {" "}
                    <path d="M389.844,182.85c-6.743,0-12.21,5.467-12.21,12.21v222.968c0,23.562-19.174,42.735-42.736,42.735H67.157 c-23.562,0-42.736-19.174-42.736-42.735V150.285c0-23.562,19.174-42.735,42.736-42.735h267.741c6.743,0,12.21-5.467,12.21-12.21 s-5.467-12.21-12.21-12.21H67.157C30.126,83.13,0,113.255,0,150.285v267.743c0,37.029,30.126,67.155,67.157,67.155h267.741 c37.03,0,67.156-30.126,67.156-67.155V195.061C402.054,188.318,396.587,182.85,389.844,182.85z"></path>{" "}
                    <path d="M483.876,20.791c-14.72-14.72-38.669-14.714-53.377,0L221.352,229.944c-0.28,0.28-3.434,3.559-4.251,5.396l-28.963,65.069 c-2.057,4.619-1.056,10.027,2.521,13.6c2.337,2.336,5.461,3.576,8.639,3.576c1.675,0,3.362-0.346,4.96-1.057l65.07-28.963 c1.83-0.815,5.114-3.97,5.396-4.25L483.876,74.169c7.131-7.131,11.06-16.61,11.06-26.692 C494.936,37.396,491.007,27.915,483.876,20.791z M466.61,56.897L257.457,266.05c-0.035,0.036-0.055,0.078-0.089,0.107 l-33.989,15.131L238.51,247.3c0.03-0.036,0.071-0.055,0.107-0.09L447.765,38.058c5.038-5.039,13.819-5.033,18.846,0.005 c2.518,2.51,3.905,5.855,3.905,9.414C470.516,51.036,469.127,54.38,466.61,56.897z"></path>{" "}
                  </g>{" "}
                </g>{" "}
              </g>
            </svg>
          </button>
        </h1> */}
        <div className="flex  space-x-4">
          <p className={clx("mt-2", botopen ? "w-2/3" : "w-full")}>
            {loading ? <LoadingOverlay /> : <></>}
            <Editor
              apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
              onInit={(evt, editor) => (editorRef.current = editor as unknown as TinyMCEEditor)}
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
                content_style: "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
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
                Ask AI
              </button>
            </div>
          </p>
          {botopen && (
            <div className="w-1/3 bg-gray-100 p-4 rounded-lg shadow-lg flex flex-col mt-16">
              <div className="flex-grow overflow-y-auto h-[calc(100vh-20rem)]">
                {responses.map((response, index) => (
                  <div key={index} className="mb-4">
                    <div className="flex">
                      <div className="bg-blue-100 text-blue-900 p-2 rounded-lg mb-2 w-max-[90%]">
                        <strong className="block">Q:</strong> {response.question}
                      </div>
                    </div>
                    <div className="flex justify-end">
                      {/* <div className="bg-green-100 text-green-900 p-2 rounded-lg mb-2 w-max-[90%]">
                      <strong className="block">A:</strong> {response.answer}
                    </div> */}
                      <div
                        className="bg-green-100 text-green-900 p-2 rounded-lg mb-2 w-max-[90%]"
                        dangerouslySetInnerHTML={{
                          __html: `<strong class="block">A:</strong> ${response.answer}`,
                        }}
                      ></div>
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
      </div>
    </>
  );
}
