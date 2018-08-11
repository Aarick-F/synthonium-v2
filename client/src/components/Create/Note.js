import React from "react";
import "./create.css";

const Note = props => {
  return(
    <div className="noteComponent">{props.note}</div>
  );
}

export default Note;