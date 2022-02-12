import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import UserContext from "../../context/UserContext";
import domain from "../../util/domain";

function NewTag() {
  const [newTag, setNewTag] = useState("");
  const { user } = useContext(UserContext);

  async function saveNewTag(e) {
    e.preventDefault();

    console.log(newTag);

    const tag = { tag: newTag };
    await axios.put(`${domain}/auth/addTag/${user}`, tag);
    console.log(newTag);
  }

  return (
    <div className="class">
      <form onSubmit={saveNewTag}>
        <label htmlFor="newTag">Add tag</label>
        <input
          id="newTag"
          className="new-tag"
          type="text"
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
        />
        <button type="submit">Add tag</button>
      </form>
    </div>
  );
}

export default NewTag;
