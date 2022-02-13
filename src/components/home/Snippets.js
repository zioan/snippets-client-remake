import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import Snippet from "./Snippet";
import SnippetEditor from "./SnippetEditor";
import "./Snippets.scss";
import UserContext from "../../context/UserContext";
import domain from "../../util/domain";
// import NewTag from "../misc/NewTag";

function Snippets() {
  const [snippets, setSnippets] = useState([]);
  // const [userTags, setUserTags] = useState([]);
  const [snippetEditorOpen, setSnippetEditorOpen] = useState(false);
  const [editSnippetData, setEditSnippetData] = useState(null);

  const { user, getUser } = useContext(UserContext);

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

  // async function getTags() {
  //   const tagsRes = await axios.get(`${domain}/auth/userTags`);
  //   // await getUser();
  //   setUserTags(tagsRes.data);
  // }
  // console.log(userTags);

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

  // const options = [
  //   {
  //     label: "Select tag...",
  //     value: "undefined",
  //   },
  //   {
  //     label: "test",
  //     value: "test",
  //   },
  //   {
  //     label: "test2a",
  //     value: "test2a",
  //   },
  // ];

  // async function getTagList() {
  //   const tagsRes = await axios.get(`${domain}/auth/userTags`);
  //   let userTags2 = tagsRes.data;
  //   console.log(userTags2);
  //   userTags2.map((tag) => {
  //     if (tag) {
  //       options.push({ label: tag, value: tag });
  //     }
  //     return tag; //cleanup
  //   });
  // }

  // getTagList();

  // userTags.map((tag) => {
  //   if (tag) {
  //     return options.push({ label: tag, value: tag });
  //   }
  //   return options;
  // });

  // console.log(userTags);

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
      {/* {userTags &&
        userTags.map((tag, index) => {
          return <button key={index}>{tag}</button>;
        })} */}
      {/* <NewTag /> */}
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
    </div>
  );
}

export default Snippets;
