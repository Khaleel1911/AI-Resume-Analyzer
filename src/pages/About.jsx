import React from "react";

export default function About() {
  return (
    <div className="max-w-4xl mx-auto p-8 bg-black-800 shadow-lg rounded-lg mt-12">
      <h1 className="text-4xl font-extrabold text-white-900 mb-6 text-center">
        About AI Resume Analyzer
      </h1>
      
      <p className="text-white-700 leading-relaxed text-lg mb-8">
        Our <span className="font-semibold text-indigo-600">Resumalyze-AI Resume Analyzer</span> helps job seekers and professionals improve their resumes using advanced AI algorithms. It scans your resume, identifies strengths, points out weaknesses, and suggests actionable improvements to make your application stand out.
      </p>

      <h2 className="text-2xl font-bold text-white-900 mb-4 border-b-2 border-indigo-500 inline-block">
        Key Features
      </h2>
      <ul className="list-disc list-inside space-y-2 text-white-700 mb-8">
        <li>AI-powered resume scoring</li>
        <li>ATS compatibility checks</li>
        <li>Keyword optimization</li>
        <li>Instant improvement suggestions</li>
      </ul>

      <h2 className="text-2xl font-bold text-white-900 mb-4 border-b-2 border-indigo-500 inline-block">
        Our Mission
      </h2>
      <p className="text-white-700 leading-relaxed text-lg">
        We aim to empower individuals by providing intelligent, data-driven insights that enhance their career opportunities.
      </p>
    </div>
  );
}
