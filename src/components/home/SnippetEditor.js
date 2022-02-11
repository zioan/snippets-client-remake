import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import "./SnippetEditor.scss";
import UserContext from "../../context/UserContext";

import CodeEditor from "@uiw/react-textarea-code-editor";
import ErrorMessage from "../misc/ErrorMessage";
import domain from "../../util/domain";
import Select from "react-select";

function SnippetEditor({
  getSnippets,
  setSnippetEditorOpen,
  editSnippetData,
  clearEditSnippetData,
}) {
  const [editorTitle, setEditorTitle] = useState("");
  const [editorDescription, setEditorDescription] = useState("");
  const [editorCode, setEditorCode] = useState("");
  const [editorTag, setEditorTag] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);

  const { user, getUser } = useContext(UserContext);

  const tags = [
    { value: "chocolate", label: "Chocolate" },
    { value: "strawberry", label: "Strawberry" },
    { value: "vanilla", label: "Vanilla" },
  ];

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

  async function saveSnippet(e) {
    e.preventDefault();

    const snippetData = {
      title: editorTitle ? editorTitle : undefined,
      description: editorDescription ? editorDescription : undefined,
      code: editorCode ? editorCode : undefined,
      tag: editorTag ? editorTag : undefined,
    };

    try {
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
    setEditorTitle("");
    setEditorDescription("");
    setEditorCode("");
    clearEditSnippetData();
  }

  function tagUpdate(e) {
    setEditorTag(e.value);
  }

  const customStyles = {
    option: (provided, state) => ({
      ...provided,
      borderBottom: "1px dotted pink",
      color: state.isSelected ? "#453" : "#333",
      padding: 10,
    }),
    control: () => ({
      // none of react-select's styles are passed to <Control />
      width: 200,
    }),
    singleValue: (provided, state) => {
      const opacity = state.isDisabled ? 0.5 : 1;
      const transition = "opacity 300ms";

      return { ...provided, opacity, transition };
    },
  };

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
            <label>
              {editorTag === "" ? "Select Tag:" : `Tag selected: ${editorTag} `}
            </label>
            <Select
              className="editor-tags"
              options={tags}
              //default value to fix

              setValue={editorTag}
              styles={customStyles}
              onChange={tagUpdate}
            />
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

          {/* <label htmlFor="editor-code">Code</label> */}
          <div className="code">
            <CodeEditor
              className="code-editor"
              value={editorCode}
              language="jsx"
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
