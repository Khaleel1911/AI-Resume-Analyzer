import React, { useState } from "react";
import toast from "react-hot-toast";
import "../styles/Hero.css";
import pdfIcon from "../assets/pdf.svg";

const Hero = () => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.type === "application/pdf") {
        setSelectedFile(file);
        toast.success(`Uploaded: ${file.name}`);
      } else {
        toast.error("Please upload a PDF file.");
      }
    }
  };

  const analyze = () => {
    if (selectedFile) {
      toast.success(`Analyzing: ${selectedFile.name}`);
      // Call AI backend here
    } else {
      toast.error("Please upload a file before analyzing.");
    }
  };

  return (
    <section className="hero">
      <div className="hero-content">
        <h1>Transform Your Resume with AI-Powered Insights</h1>
        <p>
          Upload your resume and let our AI analyze, score, and suggest
          improvements for each section — helping you stand out to recruiters
          and land your dream job.
        </p>

        <div className="button-container">
          <div className="hero-btn">
            <label htmlFor="resume-upload">Upload Your Resume </label>
            <img src={pdfIcon} alt="PDF Icon" />
          </div>

          <input
            type="file"
            id="resume-upload"
            accept="application/pdf"
            onChange={handleFileUpload}
            style={{ display: "none" }}
          />

          <div className="hero-btn" id="analyze-btn">

          <button onClick={analyze}>
            Analyze
          </button>
          </div>
        </div>
          {selectedFile && (
            <div className="file-name">Uploaded File: &nbsp;{selectedFile.name}</div>
          )}
      </div>
    </section>
  );
};

export default Hero;
