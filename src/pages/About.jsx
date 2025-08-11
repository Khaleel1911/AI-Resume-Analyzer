import React from "react";
import "../styles/About.css";

export default function About() {
  return (
    <div className="about-container">
      <h1>About AI Resume Analyzer</h1>
      <p>
        Our AI Resume Analyzer helps job seekers and professionals improve their resumes
        using advanced AI algorithms. It scans your resume, identifies strengths,
        points out weaknesses, and suggests actionable improvements to make your
        application stand out.
      </p>
      <h2>Key Features</h2>
      <ul>
        <li>AI-powered resume scoring</li>
        <li>ATS compatibility checks</li>
        <li>Keyword optimization</li>
        <li>Instant improvement suggestions</li>
      </ul>
      <h2>Our Mission</h2>
      <p>
        We aim to empower individuals by providing intelligent, data-driven insights
        that enhance their career opportunities.
      </p>
    </div>
  );
}
