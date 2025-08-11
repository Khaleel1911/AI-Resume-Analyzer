import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const ScoreCircle = ({ score, size = "large" }) => {
  const radius = size === "large" ? 60 : 35;
  const strokeWidth = size === "large" ? 8 : 5;
  const normalizedRadius = radius - strokeWidth * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDasharray = `${circumference} ${circumference}`;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getScoreColor = (score) => {
    if (score >= 85) return "#10b981";
    if (score >= 70) return "#f59e0b";
    if (score >= 50) return "#ef4444"; 
    return "#6b7280";
  };

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg height={radius * 2} width={radius * 2} className="transform -rotate-90">
        <circle
          stroke="#e5e7eb"
          fill="transparent"
          strokeWidth={strokeWidth}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <circle
          stroke={getScoreColor(score)}
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeDasharray={strokeDasharray}
          style={{ strokeDashoffset }}
          strokeLinecap="round"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <span className={`absolute font-bold ${size === "large" ? "text-3xl" : "text-xl"} text-gray-800`}>
        {score}
      </span>
    </div>
  );
};

const SectionCard = ({ section, index }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getScoreColor = (score) => {
    if (score >= 85) return "border-green-200 bg-green-50";
    if (score >= 70) return "border-amber-200 bg-amber-50";
    if (score >= 50) return "border-red-200 bg-red-50";
    return "border-gray-200 bg-gray-50";
  };

  const getScoreBadgeColor = (score) => {
    if (score >= 85) return "bg-green-100 text-green-800";
    if (score >= 70) return "bg-amber-100 text-amber-800";
    if (score >= 50) return "bg-red-100 text-red-800";
    return "bg-gray-100 text-gray-800";
  };

  return (
    <div
      className={`rounded-lg border-2 p-6 transition-all duration-300 hover:shadow-lg ${getScoreColor(
        section.score
      )}`}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-gray-800">{section.name}</h3>
        <div className="flex items-center gap-3">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreBadgeColor(section.score)}`}>
            {section.score}/100
          </span>
          <ScoreCircle score={section.score} size="small" />
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-600">{section.suggestions?.length || 0} suggestions</span>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
          >
            {isExpanded ? "Hide" : "Show"} Details
          </button>
        </div>

        {isExpanded && (
          <div className="mt-3 p-4 bg-white rounded-lg border border-gray-200">
            <h4 className="font-medium text-gray-800 mb-2">Suggestions for improvement:</h4>
            <ul className="space-y-2">
              {(section.suggestions || []).map((suggestion, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1 flex-shrink-0">•</span>
                  <span className="text-gray-700 text-sm">{suggestion}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

const ResumeInsights = () => {
  const navigate = useNavigate();
  const location = useLocation();

  let analysis = location.state?.analysis || null;

  if (typeof analysis === "string") {
    try {
      analysis = JSON.parse(analysis);
    } catch {
      analysis = null;
    }
  }

  if (!analysis) {
    const stored = sessionStorage.getItem("lastResumeAnalysis");
    if (stored) {
      try {
        analysis = JSON.parse(stored);
      } catch {
        analysis = null;
      }
    }
  }

  if (!analysis) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">No Analysis Found</h2>
          <p className="text-gray-600 mb-6">Please upload and analyze a resume first.</p>
          <button
            onClick={() => navigate("/")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Go Upload Resume
          </button>
        </div>
      </div>
    );
  }

  const getOverallScoreMessage = (score) => {
    if (score >= 85) return { text: "Excellent resume!", color: "text-green-600" };
    if (score >= 70) return { text: "Good resume with room for improvement", color: "text-amber-600" };
    if (score >= 50) return { text: "Needs significant improvement", color: "text-red-600" };
    return { text: "Requires major revision", color: "text-gray-600" };
  };

  const scoreMessage = getOverallScoreMessage(analysis.overall_score);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Resume Analysis Results</h1>
          <p className="text-gray-600">AI-powered insights to improve your resume</p>
        </div>

        {/* Overall Score Section */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Overall Score</h2>
          <div className="flex flex-col items-center gap-4">
            <ScoreCircle score={analysis.overall_score} size="large" />
            <div>
              <p className={`text-xl font-semibold ${scoreMessage.color}`}>{scoreMessage.text}</p>
              <p className="text-gray-600 mt-2">Based on analysis of {analysis.sections?.length || 0} sections</p>
            </div>
          </div>
        </div>

        {/* Sections Grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Section Breakdown</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.isArray(analysis.sections) &&
              analysis.sections.map((section, index) => <SectionCard key={index} section={section} index={index} />)}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Quick Stats</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{analysis.sections?.length || 0}</div>
              <div className="text-sm text-gray-600">Sections Analyzed</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {analysis.sections?.filter((s) => s.score >= 85).length || 0}
              </div>
              <div className="text-sm text-gray-600">Excellent Sections</div>
            </div>
            <div className="text-center p-4 bg-amber-50 rounded-lg">
              <div className="text-2xl font-bold text-amber-600">
                {analysis.sections?.filter((s) => s.score >= 70 && s.score < 85).length || 0}
              </div>
              <div className="text-sm text-gray-600">Good Sections</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">{analysis.sections?.filter((s) => s.score < 70).length || 0}</div>
              <div className="text-sm text-gray-600">Need Improvement</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeInsights;
