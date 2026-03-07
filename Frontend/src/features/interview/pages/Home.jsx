import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useInterview } from "../hooks/useInterview.js";
import {
  Upload,
  FileText,
  Zap,
  ArrowRight,
  HelpCircle,
  CheckCircle2,
  AlertCircle,
  Loader,
} from "lucide-react";

const Home = () => {
  const { loading, generateReport, reports } = useInterview();
  const navigate = useNavigate();
  const resumeInputRef = useRef();

  const [jobDescription, setJobDescription] = useState("");
  const [selfDescription, setSelfDescription] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      const file = files[0];
      if (["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"].includes(file.type)) {
        setResumeFile(file);
        setError("");
      } else {
        setError("Please upload a PDF or DOCX file");
      }
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setResumeFile(file);
      setError("");
    }
  };

  const handleGenerateReport = async () => {
    setError("");
    
    if (!jobDescription.trim()) {
      setError("Job description is required");
      return;
    }

    if (!resumeFile && !selfDescription.trim()) {
      setError("Please provide either a resume or self-description");
      return;
    }

    setIsSubmitting(true);
    try {
      const data = await generateReport({
        jobDescription,
        selfDescription,
        resumeFile,
      });
      navigate(`/interview/${data._id}`);
    } catch (err) {
      setError(err.message || "Failed to generate interview plan");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-900 via-slate-800 to-slate-950">
        <div className="flex flex-col items-center gap-4">
          <Loader className="w-10 h-10 text-emerald-500 animate-spin" />
          <p className="text-slate-300 font-medium">Loading your interview plan...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[calc(100vh-73px)]">
        {/* Left Side - Dark with Illustration */}
        <div className="hidden lg:flex flex-col justify-between bg-linear-to-br from-slate-900 via-slate-800 to-slate-950 p-12 relative overflow-hidden">
          {/* Animated Background Elements */}
          <div className="absolute inset-0">
            {/* Grid pattern */}
            <div
              className="absolute inset-0 opacity-5"
              style={{
                backgroundImage: `
                  linear-gradient(0deg, transparent 24%, rgba(34, 197, 94, 0.1) 25%, rgba(34, 197, 94, 0.1) 26%, transparent 27%, transparent 74%, rgba(34, 197, 94, 0.1) 75%, rgba(34, 197, 94, 0.1) 76%, transparent 77%, transparent),
                  linear-gradient(90deg, transparent 24%, rgba(34, 197, 94, 0.1) 25%, rgba(34, 197, 94, 0.1) 26%, transparent 27%, transparent 74%, rgba(34, 197, 94, 0.1) 75%, rgba(34, 197, 94, 0.1) 76%, transparent 77%, transparent)
                `,
                backgroundSize: "50px 50px",
              }}
            ></div>

            {/* Gradient orbs */}
            <div className="absolute top-32 right-10 w-80 h-80 bg-emerald-500/15 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-20 left-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1.5s" }}></div>
          </div>

          <div className="relative z-10">
            {/* Logo */}
            <div className="flex items-center gap-3 mb-16">
              <div className="w-14 h-14 bg-linear-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <span className="text-white font-bold text-2xl">InterviewAI</span>
            </div>

            {/* Main Headline */}
            <div className="mb-12">
              <h1 className="text-5xl lg:text-6xl font-serif text-white leading-tight mb-6 font-light">
                Create Your Custom
                <br />
                Interview Plan
              </h1>
              <p className="text-slate-300 text-lg max-w-md font-light">
                Let our AI analyze the job requirements and your unique profile to build a winning strategy.
              </p>
            </div>

            {/* Illustration - Professional Worker at Desk */}
            <div className="relative h-64 w-full max-w-md">
              <svg
                viewBox="0 0 400 300"
                className="w-full h-full"
                preserveAspectRatio="xMidYMid meet"
              >
                {/* Desk */}
                <rect x="50" y="150" width="300" height="80" fill="#2d3748" rx="4" />
                <rect x="50" y="220" width="300" height="20" fill="#1a202c" />

                {/* Chair back */}
                <ellipse cx="120" cy="120" rx="35" ry="45" fill="#667eea" opacity="0.9" />

                {/* Body */}
                <ellipse cx="120" cy="160" rx="30" ry="40" fill="#fdbcb4" />

                {/* Head */}
                <circle cx="120" cy="95" r="25" fill="#fdbcb4" />

                {/* Hair */}
                <path d="M 95 85 Q 120 60 145 85" fill="#d4563f" />

                {/* Arms */}
                <ellipse cx="95" cy="150" rx="20" ry="35" fill="#fdbcb4" transform="rotate(-30 95 150)" />
                <ellipse cx="145" cy="150" rx="20" ry="35" fill="#fdbcb4" transform="rotate(30 145 150)" />

                {/* Laptop on desk */}
                <rect x="170" y="130" width="100" height="60" fill="#e2e8f0" rx="2" />
                <rect x="175" y="135" width="90" height="45" fill="#667eea" rx="2" />
                <text x="220" y="165" fontSize="20" fill="#ffffff" textAnchor="middle" fontWeight="bold">
                  💼
                </text>

                {/* Coffee cup on desk */}
                <circle cx="290" cy="155" r="12" fill="#d4563f" />
                <rect x="278" y="155" width="24" height="8" fill="#d4563f" />

                {/* Stack of books */}
                <rect x="330" y="140" width="35" height="60" fill="#667eea" opacity="0.8" rx="2" />
                <rect x="325" y="135" width="35" height="60" fill="#667eea" opacity="0.6" rx="2" />
                <rect x="320" y="130" width="35" height="60" fill="#667eea" opacity="0.4" rx="2" />

                {/* AI thoughts bubble */}
                <circle cx="200" cy="40" r="45" fill="#667eea" opacity="0.9" />
                <path d="M 165 75 Q 160 85 170 90 Q 175 85 170 75" fill="#667eea" opacity="0.9" />
                <text x="200" y="50" fontSize="28" textAnchor="middle" fill="#ffffff">
                  🤖
                </text>

                {/* Chat bubbles */}
                <rect x="240" y="30" width="120" height="35" fill="#10b981" rx="8" opacity="0.9" />
                <path d="M 260 65 Q 255 70 245 68" fill="#10b981" opacity="0.9" />
                <text x="300" y="55" fontSize="12" fill="white" textAnchor="middle" fontWeight="bold">
                  You are perfect!
                </text>

                <rect x="260" y="75" width="100" height="35" fill="#ec4899" rx="8" opacity="0.9" />
                <path d="M 280 110 Q 275 115 265 113" fill="#ec4899" opacity="0.9" />
                <text x="310" y="100" fontSize="12" fill="white" textAnchor="middle" fontWeight="bold">
                  Thank you!
                </text>

                {/* Gears - representing AI */}
                <circle cx="80" cy="50" r="15" fill="none" stroke="#10b981" strokeWidth="2" opacity="0.6" />
                <circle cx="75" cy="45" r="2" fill="#10b981" opacity="0.6" />
                <circle cx="85" cy="55" r="2" fill="#10b981" opacity="0.6" />
              </svg>
            </div>
          </div>

          {/* Footer */}
          <div className="relative z-10">
            <p className="text-slate-500 text-xs tracking-wide uppercase">
              AI-Powered Interview Preparation
            </p>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="flex flex-col justify-center p-6 sm:p-12 lg:p-16 bg-linear-to-br from-slate-50 via-white to-slate-50 overflow-y-auto lg:overflow-y-visible">
          <div className="w-full max-w-lg">
            {/* Mobile Header */}
            <div className="lg:hidden mb-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-linear-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <span className="text-slate-900 font-bold text-xl">InterviewAI</span>
              </div>
              <h1 className="text-3xl font-serif text-slate-900 font-light mb-2">
                Create Your Interview Plan
              </h1>
              <p className="text-slate-600 text-sm">
                Let AI analyze the job and your profile
              </p>
            </div>

            {/* Desktop Header */}
            <div className="hidden lg:block mb-10">
              <h2 className="text-3xl font-serif text-slate-900 font-light mb-2">
                Your Interview Strategy
              </h2>
              <p className="text-slate-600 text-sm">
                Fill in your details and let AI create your plan
              </p>
            </div>

            {/* Error Alert */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            {/* Form Content */}
            <div className="space-y-6 font-serif">
              {/* Job Description Section */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <label className="block text-sm font-serif font-semibold text-slate-900">
                    Target Job Description
                  </label>
                  <span className="inline-flex font-serif items-center px-2 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
                    Required
                  </span>
                </div>

                <textarea
                  value={jobDescription}
                  onChange={(e) => {
                    setJobDescription(e.target.value);
                    setError("");
                  }}
                  placeholder="Paste the full job description here..."
                  maxLength={5000}
                  className="font-serif w-full px-4 py-3 text-sm rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 resize-none h-28 transition-all"
                />

                <div className="mt-2 font-serif flex items-center justify-between text-xs text-slate-500">
                  <span>{jobDescription.length} / 5000 characters</span>
                  {jobDescription.length > 0 && (
                    <span className="flex items-center gap-1 text-emerald-600">
                      <CheckCircle2 className="w-4 h-4" /> Added
                    </span>
                  )}
                </div>
              </div>

              {/* Divider */}
              <div className="flex items-center gap-3 py-2">
                <div className="flex-1 h-px bg-slate-200"></div>
                <span className="text-xs font-semibold font-serif text-slate-800 uppercase tracking-wide">
                  Your Profile
                </span>
                <div className="flex-1 h-px bg-slate-200"></div>
              </div>

              {/* Resume Upload */}
              <div>
                <div className="flex items-center gap-2 mb-3 font-serif">
                  <label className="block text-sm font-semibold text-slate-900">
                    Upload Resume
                  </label>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                    Best Results
                  </span>
                </div>

                <label
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  htmlFor="resume"
                  className={`block font-serif p-6 rounded-lg border-2 border-dashed transition-all cursor-pointer ${
                    dragActive
                      ? "border-emerald-500 bg-emerald-50"
                      : "border-slate-300 bg-slate-50 hover:border-slate-400"
                  } ${resumeFile ? "border-emerald-500 bg-emerald-50" : ""}`}
                >
                  <div className="flex flex-col items-center justify-center gap-2">
                    {resumeFile ? (
                      <>
                        <FileText className="w-8 h-8 text-emerald-600" />
                        <p className="text-sm font-semibold text-slate-900">
                          {resumeFile.name}
                        </p>
                        <p className="text-xs text-slate-500">
                          {(resumeFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </>
                    ) : (
                      <>
                        <Upload className="w-8 h-8 text-slate-400" />
                        <p className="text-sm font-semibold text-slate-900">
                          Click to upload or drag & drop
                        </p>
                        <p className="text-xs text-slate-500">
                          PDF or DOCX (Max 5MB)
                        </p>
                      </>
                    )}
                  </div>

                  <input
                    ref={resumeInputRef}
                    hidden
                    type="file"
                    id="resume"
                    name="resume"
                    accept=".pdf,.docx"
                    onChange={handleFileChange}
                  />
                </label>
              </div>

              {/* OR Divider */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-slate-200"></div>
                <span className="text-xs font-semibold text-slate-500 uppercase">
                  OR
                </span>
                <div className="flex-1 h-px bg-slate-200"></div>
              </div>

              {/* Self Description */}
              <div>
                <label
                  htmlFor="selfDescription"
                  className="block text-sm font-semibold text-slate-900 mb-3"
                >
                  Quick Self-Description
                </label>

                <textarea
                  id="selfDescription"
                  value={selfDescription}
                  onChange={(e) => {
                    setSelfDescription(e.target.value);
                    setError("");
                  }}
                  placeholder="Briefly describe your experience and skills..."
                  maxLength={1000}
                  className="w-full px-4 py-3 text-sm rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 resize-none h-20 transition-all"
                />

                <div className="mt-2 text-xs text-slate-500 flex items-center justify-between">
                  <span>{selfDescription.length} / 1000 characters</span>
                  {selfDescription.length > 0 && (
                    <span className="flex items-center gap-1 text-emerald-600">
                      <CheckCircle2 className="w-4 h-4" /> Added
                    </span>
                  )}
                </div>
              </div>

              {/* Info Box */}
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
                <HelpCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <p className="text-sm text-blue-900">
                  Either a <strong>Resume</strong> or a <strong>Self Description</strong> is required to generate your personalized interview strategy.
                </p>
              </div>

              {/* Generate Button */}
              <button
                onClick={handleGenerateReport}
                disabled={isSubmitting}
                className="w-full py-3 px-4 bg-linear-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 disabled:from-emerald-400 disabled:to-emerald-500 text-white font-semibold rounded-full transition-all duration-200 shadow-lg hover:shadow-xl hover:shadow-emerald-500/30 disabled:shadow-none focus:outline-none focus:ring-2 focus:ring-emerald-500/20 flex items-center justify-center gap-2 mt-8"
              >
                {isSubmitting ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    Generating Plan...
                  </>
                ) : (
                  <>
                    Generate My Interview Strategy
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>

            {/* Footer Links */}
            <div className="mt-10 pt-6 border-t border-slate-200 flex items-center justify-center gap-4 text-xs text-slate-600">
              <a href="#" className="hover:text-slate-900 transition-colors">
                Privacy Policy
              </a>
              <span className="text-slate-300">•</span>
              <a href="#" className="hover:text-slate-900 transition-colors">
                Terms of Service
              </a>
              <span className="text-slate-300">•</span>
              <a href="#" className="hover:text-slate-900 transition-colors">
                Help Center
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Previous Reports Section */}
      {reports.length > 0 && (
        <section className="bg-slate-50 border-t border-slate-200 py-12 px-6 sm:px-12">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl font-serif text-slate-900 font-light mb-8">
              Your Previous Interview Plans
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {reports.map((report) => (
                <div
                  key={report._id}
                  onClick={() => navigate(`/interview/${report._id}`)}
                  className="p-5 bg-white rounded-lg border border-slate-200 hover:border-emerald-500 hover:shadow-lg transition-all cursor-pointer group"
                >
                  <h3 className="font-semibold text-slate-900 mb-2 group-hover:text-emerald-600 transition-colors">
                    {report.title || "Untitled Position"}
                  </h3>

                  <div className="space-y-2 text-sm">
                    <p className="text-slate-500">
                      Generated on{" "}
                      <span className="font-medium text-slate-700">
                        {new Date(report.createdAt).toLocaleDateString()}
                      </span>
                    </p>

                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-linear-to-r from-emerald-500 to-emerald-600"
                          style={{ width: `${report.matchScore}%` }}
                        ></div>
                      </div>
                      <span className="font-semibold text-slate-900">
                        {report.matchScore}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
};

export default Home;