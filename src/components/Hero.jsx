import React, { useState } from "react";
import toast from "react-hot-toast";
import "../styles/Hero.css";
import pdfIcon from "../assets/pdf.svg";
import { useNavigate } from "react-router-dom";


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

  // const analyze = () => {
  //   if (selectedFile) {
  //     toast.success(`Analyzing: ${selectedFile.name}`);
  //     // Call AI backend here
  //   } else {
  //     toast.error("Please upload a file before analyzing.");
  //   }
  // };


    const analyze = async () => {
    if (!selectedFile) {
      toast.error("Please upload a file before analyzing.");
      return;
    }
    if (!window.puter) {
      toast.error("Puter.js not loaded. Make sure the script tag is in public/index.html.");
      return;
    }

    try {
      toast.loading("Uploading resume...");
      // upload returns an array of file objects
      const uploaded = await window.puter.fs.upload([selectedFile]);
      const uploadedFile = Array.isArray(uploaded) ? uploaded[0] : uploaded;
      toast.dismiss(); toast.success("Uploaded to Puter cloud");

      // Prompt template: ask AI to return JSON only (strict)
      const analysisPrompt = `
You are an expert resume reviewer. Analyze the attached resume file and return JSON ONLY (no extra text).
JSON structure must be:
{
  "overall_score": 0-100,
  "sections": [
    { "name": "SectionName", "score": 0-100, "suggestions": ["...","..."] },
    ...
  ]
}
Score (0-100) each section, keep suggestions short (max 5 bullets). Sections to check: Header, Summary, Experience, Education, Skills, Projects, Certifications, Other.`;

      // Build messages array with file reference (Puter can accept file content via puter_path)
      const messages = [
        {
          role: "user",
          content: [
            { type: "file", puter_path: uploadedFile.path }, // path from puter.fs.upload()
            { type: "text", text: analysisPrompt }
          ]
        }
      ];

      toast.loading("Analyzing resume — this can take a few seconds...");
      // call the AI
      const completion = await window.puter.ai.chat(messages, { model: "gpt-4.1" });
      toast.dismiss();

      // Robustly extract text/JSON from the response:
      let rawText = "";
      if (typeof completion === "string") rawText = completion;
      else if (completion?.message?.content) {
        const content = completion.message.content;
        if (Array.isArray(content)) {
          // try find text piece
          const textObj = content.find(c => c?.text) || content.find(c => typeof c === "string");
          rawText = textObj?.text ?? JSON.stringify(content);
        } else {
          rawText = content.text ?? JSON.stringify(content);
        }
      } else {
        rawText = JSON.stringify(completion);
      }

      // Extract JSON substring if model added extra text
      const match = rawText.match(/(\{[\s\S]*\})/);
      const jsonString = match ? match[1] : rawText;
      const analysisResult = JSON.parse(jsonString);

      // Save in session storage (fallback) and navigate to Insights page
      sessionStorage.setItem("lastResumeAnalysis", JSON.stringify(analysisResult));
      navigate("/insights", { state: { analysis: analysisResult } });

    } catch (err) {
      console.error(err);
      toast.error("Analysis failed: " + (err?.message || "unknown error"));
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
