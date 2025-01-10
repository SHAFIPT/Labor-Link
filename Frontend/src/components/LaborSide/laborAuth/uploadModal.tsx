import React from 'react'
import './LaborExperience.css';
import { useState } from 'react';

const UploadModal = ({ onClose, onImageSelect ,uploadType }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file)); 
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      onImageSelect(selectedFile); 
      onClose();
    } else {
      alert("No file selected!");
    }
  };

  return (
    <div className=''>
      <div className="modal-overlay" onClick={() => onClose()}>
        <div className="modal" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <div className="modal-logo">
             <span className="logo-circle">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 2H18C18.6 2 19 2.4 19 3V21C19 21.6 18.6 22 18 22H6C5.4 22 5 21.6 5 21V3C5 2.4 5.4 2 6 2Z" />
                    <path d="M14 2L14 10L18 10" />
                </svg>
                </span>
            </div>
            <button className="btn-close" onClick={() => onClose()}>
              <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24">
                <path fill="none" d="M0 0h24v24H0V0z" />
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" fill="var(--c-text-secondary)" />
              </svg>
            </button>
          </div>

          <div className="modal-body">
            <p className="modal-title">Upload {uploadType === 'id' ? 'ID' : 'Certificate'}</p>
            <p className="modal-description">Attach the file below</p>
            <label htmlFor="file-input" className="upload-area">
              <span className="upload-area-icon">
                {/* File upload icon SVG */}
              </span>
              
            {imagePreview ? (
              <div className="image-preview">
                <img src={imagePreview} className='w-[223px]' alt="Selected" />
              </div>
            ):(
             <>
                <span className="upload-area-title">Drag file(s) here to upload.</span>
                <span className="upload-area-description">
                  Alternatively, you can select a file by <br />
                  <strong>clicking here</strong>
                </span>
              </>
            )}
              <input
                id="file-input"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
            </label>

            {/* Display image preview if a file is selected */}
           
          </div>

          <div className="modal-footer">
            <button className="btn-primary" onClick={handleUpload}>Upload {uploadType === 'id' ? 'ID' : 'Certificate'}</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadModal;

