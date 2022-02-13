import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import "./SnippetEditor.scss";
import UserContext from "../../context/UserContext";

import CodeEditor from "@uiw/react-textarea-code-editor";
import ErrorMessage from "../misc/ErrorMessage";
import domain from "../../util/domain";

function SnippetEditor({
  getSnippets,
  setSnippetEditorOpen,
  editSnippetData,
  clearEditSnippetData,
  // options,
}) {
  const [editorTitle, setEditorTitle] = useState("");
  const [editorDescription, setEditorDescription] = useState("");
  const [editorCode, setEditorCode] = useState("");
  const [editorTag, setEditorTag] = useState("");

  const [userTags, setUserTags] = useState([]);

  const [errorMessage, setErrorMessage] = useState(null);

  const { user } = useContext(UserContext);

  useEffect(() => {
    if (editSnippetData) {
      setEditorTitle(editSnippetData.title ? editSnippetData.title : "");
      setEditorDescription(
        editSnippetData.description ? editSnippetData.description : ""
      );
      setEditorCode(editSnippetData.code ? editSnippetData.code : "");
      setEditorTag(editSnippetData.tag ? editSnippetData.tag : "");
    }
    return !editSnippetData; //cleanup
  }, [editSnippetData]);

  let options = [
    {
      label: "Select tag...",
      value: "undefined",
    },
  ];

  // useEffect(() => {
  //   if (!user) {
  //     setUserTags([]);
  //   } else {
  //     getTags();
  //   }
  // }, [user]);

  // useEffect(() => {
  //   if (!user) {
  //     setUserTags([]);
  //   } else {
  //     getTags();
  //   }
  // }, [setSnippetEditorOpen, user]);

  // async function getTags() {
  //   const tagsRes = await axios.get(`${domain}/auth/userTags`);
  //   // setUserTags(tagsRes.data);
  //   setUserTags(tagsRes.data);

  //   // console.log(tagsRes.data);
  //   // console.log(userTags);
  // }

  // setSnippetEditorOpen && getTags();

  // async function fetchTags() {
  //   if (userTags !== []) {
  //     // userTags.map((tag) => {
  //     //   console.log(options);
  //     //   return options.push({
  //     //     label: tag,
  //     //     value: tag,
  //     //   });
  //     // });
  //     console.log(userTags);
  //   }
  // }
  // fetchTags();

  useEffect(() => {
    axios.get(`${domain}/auth/userTags`).then((response) => {
      setUserTags(response.data);
    });

    options.push(userTags);

    userTags.map((tag) => {
      console.log(options);
      return options.push({
        label: tag,
        value: tag,
      });
    });
    // console.log(userTags);
  }, []);

  // userTags.map((tag) => {
  //   console.log(options);
  //   return options.push({
  //     label: tag,
  //     value: tag,
  //   });
  // });

  console.log(userTags);

  async function saveSnippet(e) {
    e.preventDefault();

    const snippetData = {
      title: editorTitle ? editorTitle : undefined,
      description: editorDescription ? editorDescription : undefined,
      code: editorCode ? editorCode : undefined,
      tag: editorTag ? editorTag : undefined,
    };

    try {
      //add snippet
      if (!editSnippetData) {
        await axios.post(`${domain}/snippet/`, snippetData);
      } else {
        await axios.put(
          `${domain}/snippet/${editSnippetData._id}`,
          snippetData
        );
      }
    } catch (err) {
      if (err.response) {
        if (err.response.data.errorMessage) {
          setErrorMessage(err.response.data.errorMessage);
        }
      }
      return;
    }

    getSnippets();
    closeEditor();
  }

  function closeEditor() {
    setSnippetEditorOpen(false);
    // setEditorTitle("");
    // setEditorDescription("");
    // setEditorCode("");
    // setEditorTag("");
    clearEditSnippetData();
  }

  return (
    user && (
      <div className="snippet-editor">
        {errorMessage && (
          <ErrorMessage
            message={errorMessage}
            clear={() => setErrorMessage(null)}
          />
        )}

        <form onSubmit={saveSnippet}>
          <h2>
            Editing - <span>{editorTitle}</span>
          </h2>
          <div className="select">
            <label>{editorTag === "" ? "Select Tag:" : "Tag selected:"}</label>

            <select
              className="select-options"
              onChange={(e) => setEditorTag(e.target.value)}
              value={editorTag ? editorTag : options[0].value}
            >
              {options.map((tag) => (
                <option key={tag.value} value={tag.value}>
                  {tag.label}
                </option>
              ))}
            </select>
          </div>

          <label htmlFor="editor-title">Title</label>
          <input
            id="editor-title"
            className="editor-title"
            type="text"
            value={editorTitle}
            onChange={(e) => setEditorTitle(e.target.value)}
          />
          <label htmlFor="editor-description">Description</label>
          <input
            id="editor-description"
            className="editor-description"
            type="text"
            value={editorDescription}
            onChange={(e) => setEditorDescription(e.target.value)}
          />

          <div className="code">
            <CodeEditor
              className="code-editor"
              value={editorCode}
              language="js"
              placeholder="Your snipped code here"
              padding={15}
              style={{
                fontFamily:
                  "ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace",
              }}
              onChange={(e) => setEditorCode(e.target.value)}
            />
          </div>

          <button className="btn-save" type="submit">
            Save
          </button>
          <button className="btn-cancel" type="button" onClick={closeEditor}>
            Cancel
          </button>
        </form>
      </div>
    )
  );
}

export default SnippetEditor;
