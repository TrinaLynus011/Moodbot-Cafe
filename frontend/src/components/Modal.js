import React from 'react';
import './Modal.css'; // Optional: if you want separate CSS for modal

const Modal = ({ children, onClose }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {children}
        {onClose && <button className="modal-close" onClick={onClose}>×</button>}
      </div>
    </div>
  );
};

export default Modal;
