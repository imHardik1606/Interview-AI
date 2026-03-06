import React, { useState, useRef } from "react";
import "../style/home.scss";
import { useNavigate } from "react-router";
import {useInterview} from '../hooks/useInterview.js'

const Home = () => {
    const {loading, generateReport, reports} = useInterview()

    const [jobDescription, setJobDescription] = useState("");
    const [selfDescription, setSelfDescription] = useState("");
    const resumeInputRef = useRef();


    const navigate = useNavigate();

    console.log(reports)

    const handleGenerateReport = async () => {
        const resumeFile = resumeInputRef.current.files[0];
        const data = await generateReport({jobDescription, selfDescription, resumeFile})
        navigate(`/interview/${data._id}`)
    };

    if(loading){
        return(
            <main className="loading-screen">
                <h1>Loading your interview plan please hold tight</h1>
            </main>
        )
    }

    return (
        <div className='home-page'>

            {/* Page Header */}
            <header className='page-header'>
                <h1>Create Your Custom <span className='highlight'>Interview Plan</span></h1>
                <p>Let our AI analyze the job requirements and your unique profile to build a winning strategy.</p>
            </header>

            {/* Main Card */}
            <div className='interview-card'>
                <div className='interview-card__body'>

                    {/* Left Panel */}
                    <div className='panel panel--left'>
                        <div className='panel__header'>
                            <h2>Target Job Description</h2>
                            <span className='badge badge--required'>Required</span>
                        </div>

                        <textarea
                            onChange={(e) => setJobDescription(e.target.value)}
                            className='panel__textarea'
                            placeholder={`Paste the full job description here...`}
                            maxLength={5000}
                        />

                        <div className='char-counter'>0 / 5000 chars</div>
                    </div>

                    <div className='panel-divider' />

                    {/* Right Panel */}
                    <div className='panel panel--right'>

                        <div className='panel__header'>
                            <h2>Your Profile</h2>
                        </div>

                        {/* Resume Upload */}
                        <div className='upload-section'>
                            <label className='section-label'>
                                Upload Resume
                                <span className='badge badge--best'>Best Results</span>
                            </label>

                            <label className='dropzone' htmlFor='resume'>
                                <p className='dropzone__title'>Click to upload or drag & drop</p>
                                <p className='dropzone__subtitle'>PDF or DOCX (Max 5MB)</p>

                                <input
                                    ref={resumeInputRef}
                                    hidden
                                    type='file'
                                    id='resume'
                                    name='resume'
                                    accept='.pdf,.docx'
                                />
                            </label>
                        </div>

                        <div className='or-divider'><span>OR</span></div>

                        {/* Self Description */}
                        <div className='self-description'>
                            <label className='section-label' htmlFor='selfDescription'>
                                Quick Self-Description
                            </label>

                            <textarea
                                onChange={(e) => setSelfDescription(e.target.value)}
                                id='selfDescription'
                                name='selfDescription'
                                className='panel__textarea panel__textarea--short'
                                placeholder="Briefly describe your experience and skills..."
                            />
                        </div>

                        <div className='info-box'>
                            <p>
                                Either a <strong>Resume</strong> or a <strong>Self Description</strong> is required to generate a personalized plan.
                            </p>
                        </div>

                    </div>
                </div>

                {/* Footer */}
                <div className='interview-card__footer'>
                    <span className='footer-info'>AI-Powered Strategy Generation</span>

                    <button
                        onClick={handleGenerateReport}
                        className='generate-btn'
                    >
                        Generate My Interview Strategy
                    </button>
                </div>
            </div>

            <footer className='page-footer'>
                <a href='#'>Privacy Policy</a>
                <a href='#'>Terms of Service</a>
                <a href='#'>Help Center</a>
            </footer>

            {reports.length > 0 && (
                <div className='previous-reports'>
                    <h2>Your Previous Interview Plans</h2>
                    <ul>
                        {reports.map((report) => (
                            <li key={report._id} className="report-item" onClick={() => navigate(`/interview/${report._id}`)}>
                                <h3>{report.title || "Untitled Position"}</h3>
                                <p className="report-meta">Generated on {new Date(report.createdAt).toLocaleDateString()}</p>
                                <p className="match-score">Match Score: {report.matchScore}%</p>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Home;