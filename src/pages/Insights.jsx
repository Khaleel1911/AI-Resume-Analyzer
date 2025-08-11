import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/Insights.css";

export default function Insights() {
  const nav = useNavigate();
  const location = useLocation();
  // Try route state first, fallback to sessionStorage
  const analysis = location.state?.analysis || JSON.parse(sessionStorage.getItem("lastResumeAnalysis") || "null");

  if (!analysis) {
    return (
      <div className="insights-empty">
        <p>No analysis found. Please upload & analyze a resume first.</p>
        <button onClick={() => nav("/")}>Go Upload</button>
      </div>
    );
  }

  return (
    <div className="insights-page">
      <header className="insights-header">
        <h1>Resume Insights</h1>
        <div className="overall-score">
          <h2>Overall Score</h2>
          <div className="score-circle">{analysis.overall_score ?? "-"}</div>
        </div>
      </header>

      <section className="sections-grid">
        {Array.isArray(analysis.sections) && analysis.sections.map((s, i) => (
          <div className="section-card" key={i}>
            <div className="section-top">
              <h3>{s.name}</h3>
              <div className="section-score">{s.score ?? "-"}</div>
            </div>
            <ul className="suggestions">
              {(s.suggestions || []).map((sg, idx) => <li key={idx}>{sg}</li>)}
            </ul>
          </div>
        ))}
      </section>
    </div>
  );
}
