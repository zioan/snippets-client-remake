import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import Snippet from "./Snippet";
import SnippetEditor from "./SnippetEditor";
import "./Snippets.scss";
import UserContext from "../../context/UserContext";
import { Link } from "react-router-dom";
import domain from "../../util/domain";

function Snippets() {
  const [snippets, setSnippets] = useState([]);
  const [snippetEditorOpen, setSnippetEditorOpen] = useState(false);
  const [editSnippetData, setEditSnippetData] = useState(null);

  const { user } = useContext(UserContext);

  useEffect(() => {
    if (!user) {
      setSnippets([]);
    } else {
      getSnippets();
    }
  }, [user]);

  async function getSnippets() {
    const snippetsRes = await axios.get(`${domain}/snippet/`);
    setSnippets(snippetsRes.data);
  }

  function scrollTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function editSnippet(snippetData) {
    setEditSnippetData(snippetData);
    setSnippetEditorOpen(true);
    scrollTop();
  }

  //sort snippets based on the updatedAt DB entry
  function renderSnippets() {
    let sortedSnippets = [...snippets];
    sortedSnippets = sortedSnippets.sort((a, b) => {
      return new Date(b.updatedAt) - new Date(a.updatedAt);
    });

    return sortedSnippets.map((snippet, index) => {
      return (
        <Snippet
          key={index}
          snippet={snippet}
          getSnippets={getSnippets}
          editSnippet={editSnippet}
        />
      );
    });
  }

  function clearEditSnippetData() {
    setEditSnippetData(null);
  }

  return (
    <div className="home">
      {!snippetEditorOpen && user && (
        <button
          className="btn-editor-toggler"
          onClick={() => setSnippetEditorOpen(true)}
        >
          Add snippet
        </button>
      )}
      <p className="anounce">
        Tag sorting, search functionality and more features coming soon!
      </p>
      {snippetEditorOpen && (
        <SnippetEditor
          setSnippetEditorOpen={setSnippetEditorOpen}
          getSnippets={getSnippets}
          clearEditSnippetData={clearEditSnippetData}
          editSnippetData={editSnippetData}
        />
      )}
      {snippets.length > 0
        ? renderSnippets()
        : user && (
            <p className="no-snippets">No snippets have been added yet!</p>
          )}
      {/* {user === null && (
        <div className="no-user-message">
          <h2>Welcome to Snippet manager</h2>
          <Link to="/register">Register here</Link>
        </div>
      )} */}
    </div>
  );
}

export default Snippets;
