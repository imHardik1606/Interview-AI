import React, { useState, useEffect } from "react";
import { useInterview } from "../hooks/useInterview.js";
import { useParams } from "react-router-dom";
import {
  ChevronDown,
  Download,
  Zap,
  Target,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Loader,
} from "lucide-react";

const NAV_ITEMS = [
  { id: "technical", label: "Technical Questions", icon: "💻" },
  { id: "behavioral", label: "Behavioral Questions", icon: "🗣️" },
  { id: "roadmap", label: "Road Map", icon: "🗺️" },
];

// ── Question Card ──
const QuestionCard = ({ item, index }) => {
  const [open, setOpen] = useState(false);

  return (
    <div
      className={`bg-white rounded-lg border border-slate-200 overflow-hidden transition-all duration-300 hover:border-emerald-300 hover:shadow-md ${
        open ? "ring-2 ring-emerald-500/20" : ""
      }`}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full px-6 py-4 text-left flex items-start gap-4 hover:bg-slate-50 transition-colors group"
      >
        <div className="shrink-0">
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-linear-to-br from-emerald-500 to-emerald-600 text-white text-sm font-semibold">
            Q{index + 1}
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-slate-900 font-semibold leading-tight group-hover:text-emerald-600 transition-colors">
            {item.question}
          </p>
        </div>

        <div className="shrink-0">
          <ChevronDown
            className={`w-5 h-5 text-slate-400 group-hover:text-slate-600 transition-all duration-300 ${
              open ? "transform rotate-180" : ""
            }`}
          />
        </div>
      </button>

      {open && (
        <div className="border-t border-slate-200 bg-linear-to-br from-slate-50 to-slate-100 px-6 py-4 space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-bold uppercase tracking-wide text-blue-600">
                Interview Intent
              </span>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed">
              {item.intention}
            </p>
          </div>

          <div className="border-t border-slate-200 pt-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-bold uppercase tracking-wide text-emerald-600">
                Model Answer
              </span>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed">
              {item.answer}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

// ── Roadmap Day ──
const RoadMapDay = ({ day }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden hover:border-emerald-300 hover:shadow-md transition-all">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-slate-50 transition-colors group"
      >
        <div className="flex items-center gap-4">
          <div className="shrink-0">
            <div className="w-10 h-10 rounded-full bg-linear-to-br from-emerald-500 to-emerald-600 text-white flex items-center justify-center font-bold text-sm">
              {day.day}
            </div>
          </div>
          <h3 className="font-semibold text-slate-900 group-hover:text-emerald-600 transition-colors">
            {day.focus}
          </h3>
        </div>

        <ChevronDown
          className={`w-5 h-5 text-slate-400 transition-all duration-300 ${
            expanded ? "transform rotate-180" : ""
          }`}
        />
      </button>

      {expanded && (
        <div className="border-t border-slate-200 bg-linear-to-br from-slate-50 to-slate-100 px-6 py-4">
          <ul className="space-y-2">
            {day.tasks.map((task, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 text-xs font-bold shrink-0 mt-0.5">
                  ✓
                </span>
                <span className="text-sm text-slate-700">{task}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

// ── Score Ring Component ──
const ScoreRing = ({ score }) => {
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const getColor = () => {
    if (score >= 80) return "emerald";
    if (score >= 60) return "blue";
    return "orange";
  };

  const color = getColor();
  // const colorMap = {
  //   emerald: "from-emerald-500 to-emerald-600",
  //   blue: "from-blue-500 to-blue-600",
  //   orange: "from-orange-500 to-orange-600",
  // };

  return (
    <div className="relative w-32 h-32 flex items-center justify-center">
      <svg className="w-32 h-32 transform -rotate-90">
        {/* Background circle */}
        <circle
          cx="64"
          cy="64"
          r={radius}
          fill="none"
          stroke="#e2e8f0"
          strokeWidth="4"
        />
        {/* Progress circle */}
        <circle
          cx="64"
          cy="64"
          r={radius}
          fill="none"
          stroke="url(#scoreGradient)"
          strokeWidth="4"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000"
        />
        <defs>
          <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={color === "emerald" ? "#10b981" : color === "blue" ? "#3b82f6" : "#f97316"} />
            <stop offset="100%" stopColor={color === "emerald" ? "#059669" : color === "blue" ? "#1d4ed8" : "#ea580c"} />
          </linearGradient>
        </defs>
      </svg>

      <div className="absolute text-center">
        <div className="text-3xl font-bold text-slate-900">{score}</div>
        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
          %
        </div>
      </div>
    </div>
  );
};

// ── Skill Gap Badge ──
const SkillGapBadge = ({ skill, severity }) => {
  const getSeverityClass = () => {
    switch (severity) {
      case "high":
        return "bg-red-100 text-red-700 border-red-300";
      case "medium":
        return "bg-orange-100 text-orange-700 border-orange-300";
      case "low":
        return "bg-emerald-100 text-emerald-700 border-emerald-300";
      default:
        return "bg-slate-100 text-slate-700 border-slate-300";
    }
  };

  const getSeverityIcon = () => {
    switch (severity) {
      case "high":
        return <AlertCircle className="w-3 h-3" />;
      case "mid":
        return <TrendingUp className="w-3 h-3" />;
      case "low":
        return <CheckCircle2 className="w-3 h-3" />;
      default:
        return null;
    }
  };

  return (
    <span
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${getSeverityClass()}`}
    >
      {getSeverityIcon()}
      {skill}
    </span>
  );
};

// ── Main Component ──
const Interview = () => {
  const [activeNav, setActiveNav] = useState("technical");
  const [isDownloading, setIsDownloading] = useState(false);
  const { report, loading, getReportById, generateResumepdf } = useInterview();
  const { interviewId } = useParams();

  useEffect(() => {
    if (interviewId) {
      getReportById(interviewId);
    }
  }, [interviewId]);

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      await generateResumepdf(interviewId);
    } finally {
      setIsDownloading(false);
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

  if (!report) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Interview Plan Not Found</h2>
          <p className="text-slate-600">We couldn't load your interview plan.</p>
        </div>
      </div>
    );
  }

  const getScoreLabel = (score) => {
    if (score >= 80) return "Strong Match";
    if (score >= 60) return "Good Match";
    if (score >= 40) return "Fair Match";
    return "Needs Improvement";
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-slate-200 sticky top-0 z-30 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-linear-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-900">InterviewAI</span>
            </div>

            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className="flex items-center gap-2 px-4 py-2 bg-linear-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 disabled:from-emerald-400 disabled:to-emerald-500 text-white font-semibold text-sm rounded-lg transition-all shadow-lg hover:shadow-xl disabled:shadow-none"
            >
              {isDownloading ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  Download Resume
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 p-6 sm:p-8">
          {/* Left Navigation */}
          <div className="lg:col-span-1">
            <nav className="sticky top-24 space-y-2">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-500 px-4 mb-4">
                Sections
              </p>

              {NAV_ITEMS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveNav(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all ${
                    activeNav === item.id
                      ? "bg-linear-to-r from-emerald-500 to-emerald-600 text-white shadow-lg"
                      : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  {item.label}
                </button>
              ))}

              <div className="pt-4 mt-6 border-t border-slate-200">
                <button
                  onClick={handleDownload}
                  disabled={isDownloading}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-linear-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 disabled:from-emerald-400 disabled:to-emerald-500 text-white font-semibold text-sm rounded-lg transition-all shadow-lg hover:shadow-xl disabled:shadow-none"
                >
                  {isDownloading ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      Download Resume
                    </>
                  )}
                </button>
              </div>
            </nav>
          </div>

          {/* Center Content */}
          <div className="lg:col-span-2">
            <div className="space-y-6">
              {/* Content Header */}
              <div className="flex items-center justify-between mb-8">
                {activeNav === "technical" && (
                  <div>
                    <h2 className="text-2xl font-serif text-slate-900 font-light">
                      Technical Questions
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">
                      {report.technicalQuestions?.length || 0} questions to prepare
                    </p>
                  </div>
                )}

                {activeNav === "behavioral" && (
                  <div>
                    <h2 className="text-2xl font-serif text-slate-900 font-light">
                      Behavioral Questions
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">
                      {report.behavioralQuestions?.length || 0} questions to prepare
                    </p>
                  </div>
                )}

                {activeNav === "roadmap" && (
                  <div>
                    <h2 className="text-2xl font-serif text-slate-900 font-light">
                      Preparation Road Map
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">
                      {report.preparationPlan?.length || 0} days of structured preparation
                    </p>
                  </div>
                )}

                <div className="hidden sm:block">
                  <div className="px-4 py-2 bg-emerald-100 rounded-lg">
                    <span className="text-2xl font-bold text-emerald-700">
                      {activeNav === "technical"
                        ? report.technicalQuestions?.length || 0
                        : activeNav === "behavioral"
                        ? report.behavioralQuestions?.length || 0
                        : report.preparationPlan?.length || 0}
                    </span>
                  </div>
                </div>
              </div>

              {/* Question/Roadmap List */}
              <div className="space-y-3">
                {activeNav === "technical" &&
                  report.technicalQuestions?.map((q, i) => (
                    <QuestionCard key={i} item={q} index={i} />
                  ))}

                {activeNav === "behavioral" &&
                  report.behavioralQuestions?.map((q, i) => (
                    <QuestionCard key={i} item={q} index={i} />
                  ))}

                {activeNav === "roadmap" &&
                  report.preparationPlan?.map((day) => (
                    <RoadMapDay key={day.day} day={day} />
                  ))}
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Match Score Card */}
              <div className="bg-linear-to-br from-slate-50 to-slate-100 rounded-lg p-6 border border-slate-200">
                <p className="text-xs font-bold uppercase tracking-wide text-slate-600 mb-6 text-center">
                  Match Score
                </p>

                <div className="flex justify-center mb-6">
                  <ScoreRing score={report.matchScore || 0} />
                </div>

                <p className="text-center text-sm font-semibold text-slate-700">
                  {getScoreLabel(report.matchScore || 0)}
                </p>

                <div className="mt-4 pt-4 border-t border-slate-200">
                  <p className="text-xs text-slate-600 text-center leading-relaxed">
                    {report.matchScore >= 80
                      ? "You are well-matched for this role. Focus on fine-tuning your technical skills."
                      : report.matchScore >= 60
                      ? "You have a good foundation. Review the skill gaps to improve your candidacy."
                      : report.matchScore >= 40
                      ? "Build a strong preparation plan using the roadmap. Focus on key skill gaps."
                      : "This role requires significant skill development. Follow the roadmap carefully."}
                  </p>
                </div>
              </div>

              {/* Skill Gaps Card */}
              <div className="bg-linear-to-br from-slate-50 to-slate-100 rounded-lg p-6 border border-slate-200">
                <p className="text-xs font-bold uppercase tracking-wide text-slate-600 mb-4">
                  Skill Gaps
                </p>

                <div className="space-y-2">
                  {report.skillGaps?.map((gap, i) => (
                    <SkillGapBadge key={i} skill={gap.skill} severity={gap.severity} />
                  )) || (
                    <p className="text-sm text-slate-600 text-center py-4">
                      No skill gaps identified
                    </p>
                  )}
                </div>
              </div>

              {/* Quick Tips */}
              <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                <p className="text-xs font-bold uppercase tracking-wide text-blue-600 mb-3">
                  Quick Tips
                </p>

                <ul className="space-y-2 text-sm text-blue-900">
                  <li className="flex items-start gap-2">
                    <span className="text-lg mt-0.5">💡</span>
                    <span>Practice the technical questions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-lg mt-0.5">📋</span>
                    <span>Follow the roadmap daily</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-lg mt-0.5">🎯</span>
                    <span>Focus on skill gap areas</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Interview;