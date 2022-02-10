import axios from "axios";
import React from "react";
import "./Snippet.scss";
import CodeEditor from "@uiw/react-textarea-code-editor";
import domain from "../../util/domain";

function Snippet({ snippet, getSnippets, editSnippet }) {
  async function deleteSnippet() {
    if (window.confirm("Do you want to delete this snippet?")) {
      await axios.delete(`${domain}/snippet/${snippet._id}`);
      getSnippets();
    }
  }

  return (
    <div className="snippet">
      {snippet.title && (
        <>
          {" "}
          <div className="snippet-header">
            <h2 className="title">{snippet.title}</h2>
            <button
              className="btn-copy"
              onClick={() => {
                navigator.clipboard.writeText(snippet.code);
              }}
            >
              Copy
            </button>
          </div>
          <div className="divider"></div>
        </>
      )}
      {snippet.description && (
        <h4 className="description">{snippet.description}</h4>
      )}
      {snippet.code && (
        <div className="code">
          <CodeEditor
            className="code-editor"
            value={snippet.code}
            language="js"
            placeholder="Please enter your code."
            padding={15}
            style={{
              fontFamily:
                "ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace",
            }}
          />
        </div>
      )}

      <button
        className="btn-copy"
        onClick={() => {
          navigator.clipboard.writeText(snippet.code);
        }}
      >
        Copy
      </button>
      <button className="btn-edit" onClick={() => editSnippet(snippet)}>
        Edit
      </button>
      <button className="btn-delete" onClick={deleteSnippet}>
        Delete
      </button>
    </div>
  );
}

export default Snippet;
