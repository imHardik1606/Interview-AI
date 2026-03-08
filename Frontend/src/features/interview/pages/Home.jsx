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
  LogOut,
  User,
  X,
  ChevronDown,
  Search,
  FileCheck,
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
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Mock user data - replace with actual user data from context/state
  const userData = {
    id: "USER_12345",
    name: "John Doe",
    email: "john@example.com",
    resumeName: "Resume_2024.pdf",
    searchHistory: [
      { title: "Senior Software Engineer", date: "2024-03-07" },
      { title: "Product Manager", date: "2024-03-06" },
      { title: "Full Stack Developer", date: "2024-03-05" },
    ],
  };

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
      if (
        [
          "application/pdf",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ].includes(file.type)
      ) {
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

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
    setShowLogoutModal(false);
  };

  if (loading) {
    return (
      <div className="w-screen h-screen fixed inset-0 flex items-center justify-center bg-linear-to-br from-slate-900 via-slate-800 to-slate-950">
        <div className="flex flex-col items-center gap-4">
          <Loader className="w-10 h-10 text-emerald-500 animate-spin" />
          <p className="text-slate-300 font-medium">
            Loading your interview plan...
          </p>
        </div>
      </div>
    );
  }

  return (
    <main className="w-screen h-screen fixed inset-0 bg-linear-to-br from-slate-900 via-slate-800 to-slate-950 flex flex-col overflow-hidden">
      {/* User Menu - Top Right */}
      <div className="fixed top-0 right-3.5 z-50">
        {/* Profile Button - Hidden when menu is open */}
        {!showProfileMenu && (
          <button
            onClick={() => setShowProfileMenu(true)}
            className="w-15 h-15 rounded-full bg-linear-to-br from-emerald-500 to-emerald-600 flex items-center justify-center hover:shadow-lg hover:shadow-emerald-500/50 transition-all duration-300 transform hover:scale-110 active:scale-95 animate-in fade-in"
            title="User menu"
          >
            <User size={40} className="text-white" strokeWidth={2} />
          </button>
        )}

        {/* Profile Dropdown Menu */}
        {showProfileMenu && (
          <div className="fixed top-0 right-3.5 w-80 h-screen max-h-screen bg-slate-800 border border-slate-700 rounded-l-2xl shadow-2xl animate-in fade-in slide-in-from-right duration-300 flex flex-col z-50">
            {/* Header with Close Button */}
            <div className="bg-linear-to-r from-emerald-500 to-emerald-600 px-6 py-4 rounded-tl-2xl flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3 flex-1">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <User size={24} className="text-white" />
                </div>
                <div>
                  <p className="text-white font-semibold">{userData.name}</p>
                  <p className="text-emerald-100 text-xs">{userData.email}</p>
                </div>
              </div>
              <button
                onClick={() => setShowProfileMenu(false)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                title="Close menu"
              >
                <X className="w-4.5 h-4.5 text-black" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-4 space-y-4">
                {/* User ID */}
                <div className="bg-slate-700/50 rounded-lg p-3">
                  <p className="text-xs text-slate-400 font-medium mb-1">User ID</p>
                  <p className="text-white font-mono text-sm">{userData.id}</p>
                </div>

                {/* Resume */}
                <div className="bg-slate-700/50 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <FileCheck size={14} className="text-emerald-400" />
                    <p className="text-xs text-slate-400 font-medium">Resume</p>
                  </div>
                  <p className="text-white text-sm">{userData.resumeName}</p>
                </div>

                {/* Search History */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Search size={16} className="text-emerald-400" />
                    <p className="text-xs text-slate-400 font-medium">Recent Searches</p>
                  </div>
                  <div className="space-y-2">
                    {userData.searchHistory.length > 0 ? (
                      userData.searchHistory.map((search, index) => (
                        <div
                          key={index}
                          className="bg-slate-700/50 rounded-lg p-2.5 hover:bg-slate-700 transition-colors cursor-pointer"
                        >
                          <p className="text-white text-sm font-medium truncate">
                            {search.title}
                          </p>
                          <p className="text-slate-400 text-xs">
                            {new Date(search.date).toLocaleDateString()}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-slate-400 text-sm">No search history</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer - Sticky at bottom */}
            <div className="border-t border-slate-700 p-4 rounded-bl-2xl shrink-0 bg-slate-800">
              <button
                onClick={() => {
                  setShowProfileMenu(false);
                  setShowLogoutModal(true);
                }}
                className="w-full px-4 py-2.5 bg-red-500 hover:bg-red-600 text-black font-semibold rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full mx-4 shadow-2xl animate-in fade-in zoom-in-95 duration-300">
            {/* Close Button */}
            <button
              onClick={() => setShowLogoutModal(false)}
              className="absolute top-4 right-4 p-1 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-slate-500" />
            </button>

            {/* Modal Content */}
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-linear-to-br from-emerald-100 to-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <LogOut className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                Logout Confirmation
              </h3>
              <p className="text-slate-600 text-sm">
                Are you sure you want to logout from your account?
              </p>
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-900 font-semibold rounded-lg transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-black font-semibold rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content - Scrollable */}
      <div className="flex-1 overflow-y-auto w-full">
        {/* Header Section - Inside Scrollable Content */}
        <div className="w-full px-8 py-12 text-center">
          {/* Logo */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-10 h-10 bg-linear-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <span className="text-white font-bold text-lg">InterviewAI</span>
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3 leading-tight">
            Your Interview Strategy
          </h1>

          {/* Subtitle */}
          <p className="text-slate-300 text-sm sm:text-base font-light max-w-md mx-auto mb-8">
            Fill in your details and let AI create your plan
          </p>
        </div>

        {/* Content Container */}
        <div className="w-full max-w-4xl mx-auto px-8 sm:px-10">
          {/* Error Alert */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg flex items-start gap-3 animate-in shake duration-300">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <p className="text-red-700 text-sm font-medium">{error}</p>
            </div>
          )}

          <div className="space-y-6">
            {/* Job Description Field */}
            <div
              className="animate-in fade-in slide-in-from-bottom-2 duration-500"
              style={{ animationDelay: "0.1s" }}
            >
              <label className="text-sm font-semibold text-white">
                Target Job Description <span className="text-emerald-400">*</span>
              </label>

              <textarea
                value={jobDescription}
                onChange={(e) => {
                  setJobDescription(e.target.value);
                  setError("");
                }}
                placeholder="Paste the full job description here..."
                maxLength={5000}
                rows="4"
                className="w-full px-4 py-3 text-sm rounded-lg border border-slate-600 bg-slate-800 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none transition-all duration-200 hover:border-slate-500"
              />

              <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
                <span>{jobDescription.length} / 5000 characters</span>
                {jobDescription.length > 0 && (
                  <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
                    <CheckCircle2 className="w-4 h-4" /> Added
                  </span>
                )}
              </div>
            </div>

            {/* Resume Upload Section */}
            <div
              className="animate-in fade-in slide-in-from-bottom-2 duration-500"
              style={{ animationDelay: "0.2s" }}
            >
              <label className="text-sm font-semibold text-white">
                Upload Resume
              </label>

              <label
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                htmlFor="resume"
                className={`block p-8 rounded-xl border-2 border-dashed transition-all cursor-pointer ${dragActive
                    ? "border-emerald-500 bg-emerald-500/10"
                    : resumeFile
                      ? "border-emerald-500 bg-emerald-500/10"
                      : "border-slate-600 bg-slate-800/50 hover:border-slate-500 hover:bg-slate-800"
                  }`}
              >
                <div className="flex flex-col items-center justify-center gap-2">
                  {resumeFile ? (
                    <>
                      <FileText className="w-8 h-8 text-emerald-400" />
                      <p className="text-sm font-semibold text-white">
                        {resumeFile.name}
                      </p>
                      <p className="text-xs text-slate-400">
                        {(resumeFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </>
                  ) : (
                    <>
                      <Upload className="w-8 h-8 text-slate-400" />
                      <p className="text-sm font-semibold text-white">
                        Click to upload or drag & drop
                      </p>
                      <p className="text-xs text-slate-400">
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
            <div
              className="flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2 duration-500"
              style={{ animationDelay: "0.3s" }}
            >
              <div className="flex-1 h-px bg-slate-700" />
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                OR
              </span>
              <div className="flex-1 h-px bg-slate-700" />
            </div>

            {/* Self Description Field */}
            <div
              className="animate-in fade-in slide-in-from-bottom-2 duration-500"
              style={{ animationDelay: "0.4s" }}
            >
              <label className="block text-sm font-semibold text-white mb-3">
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
                rows="3"
                className="w-full px-4 py-3 text-sm rounded-lg border border-slate-600 bg-slate-800 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none transition-all duration-200 hover:border-slate-500"
              />

              <div className="mt-2 text-xs text-slate-400 flex items-center justify-between">
                <span>{selfDescription.length} / 1000 characters</span>
                {selfDescription.length > 0 && (
                  <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
                    <CheckCircle2 className="w-4 h-4" /> Added
                  </span>
                )}
              </div>
            </div>

            {/* Info Alert */}
            <div
              className="animate-in fade-in slide-in-from-bottom-2 duration-500 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg flex items-start gap-3"
              style={{ animationDelay: "0.5s" }}
            >
              <HelpCircle className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
              <p className="text-sm text-blue-100 leading-relaxed">
                <strong>Required:</strong> Either a Resume or a Self Description
                is required to generate your personalized interview strategy.
              </p>
            </div>

            {/* Generate Button */}
            <div className="flex justify-center">
              <button
                onClick={handleGenerateReport}
                disabled={isSubmitting}
                className="animate-in fade-in slide-in-from-bottom-2 duration-500 w-100 py-3.5 px-6 bg-linear-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 disabled:from-emerald-400 disabled:to-emerald-500 text-white font-semibold rounded-lg transition-all shadow-lg hover:shadow-xl hover:shadow-emerald-500/40 disabled:shadow-none focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:ring-offset-2 flex items-center justify-center gap-2 mt-2 mb-8"
                style={{ animationDelay: "0.6s" }}
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
          </div>
        </div>

        {/* Previous Reports Section */}
        {reports.length > 0 && (
          <section className="w-full px-4 sm:px-6 lg:px-8 py-12">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-white mb-8">
                Your Previous Interview Plans
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {reports.map((report, index) => (
                  <div
                    key={report._id}
                    onClick={() => navigate(`/interview/${report._id}`)}
                    className="p-5 bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 hover:border-emerald-500/50 hover:bg-slate-800 transition-all duration-300 cursor-pointer group animate-in fade-in slide-in-from-bottom-2"
                    style={{ animationDelay: `${0.7 + index * 0.1}s` }}
                  >
                    <h3 className="font-semibold text-white mb-3 group-hover:text-emerald-300 transition-colors">
                      {report.title || "Untitled Position"}
                    </h3>

                    <div className="space-y-3">
                      <p className="text-sm text-slate-300">
                        Generated on{" "}
                        <span className="font-medium text-white">
                          {new Date(report.createdAt).toLocaleDateString()}
                        </span>
                      </p>

                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-linear-to-r from-emerald-500 to-emerald-400 rounded-full transition-all duration-500"
                            style={{ width: `${report.matchScore}%` }}
                          />
                        </div>
                        <span className="font-semibold text-white min-w-fit text-sm">
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
      </div>
    </main>
  );
};

export default Home;