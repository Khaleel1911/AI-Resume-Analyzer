import React, { useState } from "react";
import toast from "react-hot-toast";
import "../styles/Hero.css";
import pdfIcon from "../assets/pdf.svg";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const navigate = useNavigate();

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

  const analyze = async () => {
    if (!selectedFile) {
      toast.error("Please upload a file before analyzing.");
      return;
    }
    if (!window.puter) {
      toast.error("Puter.js not loaded. Make sure the script tag is in public/index.html.");
      return;
    }

    setIsAnalyzing(true);
    try {
      const uploadingToast = toast.loading("Uploading resume...");
      const uploaded = await window.puter.fs.upload([selectedFile]);
      const uploadedFile = Array.isArray(uploaded) ? uploaded[0] : uploaded;
      toast.dismiss(uploadingToast);
      toast.success("Uploaded to Puter cloud");

      const analysisPrompt = `IMPORTANT: Return ONLY valid JSON, no extra text.

You are a professional resume reviewer with expertise in HR and recruitment. Analyze the uploaded resume carefully and evaluate the quality of each section based on these criteria:

- Header: completeness (name, contact info, LinkedIn, portfolio)
- Summary: clarity, relevance, specificity to the target role (assume roles are frontend and backend developer)
- Experience: detail, achievements, use of metrics and action verbs
- Education: completeness, relevance, dates
- Skills: relevance, specificity, proficiency indication
- Projects: description, technologies used, impact

For each section, assign a score from 30 to 100 that reflects how well the section meets these criteria. Use the full range of scores appropriately — do NOT default to 0 unless the section is completely missing or irrelevant. Consider quality, specificity, relevance to the role, and clarity. Provide up to 10 actionable, tailored suggestions for improvement in each section.

Calculate the overall_score as a weighted average of the section scores, with Experience and Skills weighted higher (e.g., 30% each), Summary and Projects weighted moderately (15% each), and Header and Education weighted lower (5% each).

Return this exact JSON structure (with real values based on the resume):

{
  "overall_score": 35,   // integer 30-100, weighted average of all sections
  "sections": [
    {
      "name": "Header",
      "score": 15,
      "suggestions": ["...","..."]
    },
    {
      "name": "Summary",
      "score": 36,
      "suggestions": ["...","..."]
    },
    {
      "name": "Experience",
      "score": 54,
      "suggestions": ["...","..."]
    },
    {
      "name": "Education",
      "score": 84,
      "suggestions": ["...","..."]
    },
    {
      "name": "Skills",
      "score":86,
      "suggestions": ["...","..."]
    },
    {
      "name": "Projects",
      "score": 68,
      "suggestions": ["...","..."]
    }
  ]
}

Ensure scores reflect content quality and relevance, penalize missing or vague info, reward detailed and role-specific info, and provide clear, personalized suggestions to improve the resume.
Return ONLY the JSON, no explanation or markdown.
`;


      const messages = [
        {
          role: "user",
          content: [
            { type: "file", puter_path: uploadedFile.path },
            { type: "text", text: analysisPrompt }
          ]
        }
      ];

      const analyzingToast = toast.loading("Analyzing resume — this can take a few seconds...");
      const completion = await window.puter.ai.chat(messages, { model: "gpt-4.1" });
      toast.dismiss(analyzingToast);

      let rawText = "";
      if (typeof completion === "string") {
        rawText = completion;
      } else if (completion?.message?.content) {
        const content = completion.message.content;
        if (Array.isArray(content)) {
          const textObj = content.find(c => c?.text) || content.find(c => typeof c === "string");
          rawText = textObj?.text ?? JSON.stringify(content);
        } else {
          rawText = content.text ?? JSON.stringify(content);
        }
      } else {
        rawText = JSON.stringify(completion);
      }

      console.log("Raw AI Response:", rawText);

      let analysisResult;
      try {
        analysisResult = JSON.parse(rawText.trim());
        console.log("Direct parse SUCCESS:", analysisResult);
      } catch {
        // Attempt to extract JSON between { and }
        const match = rawText.match(/(\{[\s\S]*\})/);
        if (match) {
          try {
            analysisResult = JSON.parse(match[1].trim());
            console.log("Extracted JSON parse SUCCESS:", analysisResult);
          } catch (err) {
            console.error("Extracted JSON parse failed:", err.message);
          }
        }
      }

      // Check if parsing failed completely
      if (!analysisResult) {
        console.error("Could not parse AI response as JSON");
        analysisResult = {
          overall_score: 50,
          sections: [{
            name: "Error Recovery",
            score: 0,
            suggestions: ["Analysis failed - invalid AI response", "Please try again"]
          }],
          error: "Could not parse JSON response"
        };
      } else if (typeof analysisResult === 'string') {
        // If somehow we still have a string, try parsing again
        try {
          analysisResult = JSON.parse(analysisResult);
          console.log("Second parse attempt successful");
        } catch (err) {
          console.error("Second parse failed:", err);
          analysisResult = {
            overall_score: 50,
            sections: [{
              name: "Error Recovery", 
              score: 0,
              suggestions: ["Failed to parse analysis result", "Please try again"]
            }]
          };
        }
      }

      // Only validate if we have a proper object
      if (analysisResult && typeof analysisResult === 'object' && !Array.isArray(analysisResult)) {
        // Ensure overall_score is a number
        if (typeof analysisResult.overall_score !== "number") {
          console.warn("Invalid overall_score type:", typeof analysisResult.overall_score, "Value:", analysisResult.overall_score);
          analysisResult.overall_score = parseInt(analysisResult.overall_score) || 50;
        }
        
        // Ensure sections is an array
        if (!Array.isArray(analysisResult.sections)) {
          console.warn("Invalid sections array, creating default");
          analysisResult.sections = [{
            name: "General Analysis",
            score: analysisResult.overall_score || 50,
            suggestions: ["Resume processed successfully", "Full analysis may be limited"]
          }];
        }
        
        // Validate each section object
        analysisResult.sections = analysisResult.sections.map((section, i) => ({
          name: section?.name || `Section ${i + 1}`,
          score: typeof section?.score === "number" ? section.score : (parseInt(section?.score) || 50),
          suggestions: Array.isArray(section?.suggestions) ? section.suggestions : ["No specific feedback available"]
        }));
      }

      console.log("Final analysisResult:", analysisResult);
      toast.success("Analysis complete!");

      // Store and navigate to results
      sessionStorage.setItem("lastResumeAnalysis", JSON.stringify(analysisResult));
      navigate("/insights", { state: { analysis: analysisResult } });
      
    } catch (error) {
      console.error("Analysis Error:", error);
      toast.error(`Analysis failed: ${error?.message || "Unknown error"}`);
    } finally {
      setIsAnalyzing(false);
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
            <label htmlFor="resume-upload">
              Upload Your Resume
            </label>
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
              {isAnalyzing ? "Analyzing..." : "Analyze"}
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