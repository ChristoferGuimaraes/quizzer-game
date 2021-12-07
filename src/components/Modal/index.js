import React from "react";
import "./index.css";

function Modal({ title, body, btnName, numberQuestion, right, wrong, handleClick }) {
  

  
  return (
    <div className="modal-background">
      <div className="modal-container">
        <div>
          <h1 className="title-modal"> {title} </h1>
        </div>
        <div className="body-modal">
          <p>{numberQuestion}</p>
          <p>{right}</p>
          <p>{wrong}</p>
          <p>{body}</p>
        </div>
        <div className="footer">
          <div>
            <button className="selected-button" onClick={handleClick}>{btnName}</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Modal;
