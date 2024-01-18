import React from "react";
import './modal.css'

export default function Modal({ darkMode, closeModal, children }) {
    return(
        <div className="modal">
            <div className={`content ${darkMode ? 'dark-modal': ''}`}>
                {children}
                <button onClick={closeModal}>Close</button>
            </div>
        </div>
    )
}