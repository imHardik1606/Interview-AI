import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:5000/api/interview",
    withCredentials: true
});

/**
 * @description Service to generate interview report based on user's resume, self description and job description
 */

export const generateInterviewReport = async ({jobDescription, selfDescription, resumeFile}) => {
    
    const formData = new FormData();
    formData.append("jobDescription", jobDescription);
    formData.append("selfDescription", selfDescription);
    formData.append("resume", resumeFile);

    const response = await api.post("/", formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });

    return response.data;
}

/**
 * @description Service to get interview report by interview id
 */

export const getInterviewReportById = async (interviewId) => {
    const response = await api.get(`/api/interview/report/${interviewId}`);
    return response.data;   
}

/**
 * @description Service to get all interview reports of the user
 */

export const getAllInterviewReports = async () => {
    const response = await api.get("/api/interview/");
    return response.data;
}