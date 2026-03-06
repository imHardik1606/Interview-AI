const { GoogleGenAI } = require("@google/genai");
const { z } = require("zod");
const { zodToJsonSchema } = require("zod-to-json-schema");

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENAI_API_KEY,
});

const interviewReportSchema = z.object({
  matchScore: z
    .number()
    .describe(
      "A score between 0 to 100 indicating how well the candidate's resume and self-description match the job description.",
    ),
  technicalQuestion: z
    .array(
      z.object({
        question: z.string().describe(
          "The technical question that can be asked in the interview",
        ),
        intention: z.string().describe(
          "The intention of interviewer behind asking this question",
        ),
        answer: z.string().describe(
          "How to answer this question, what points to cover, what approach to take etc.",
        ),
      }),
    )
    .describe(
      "Technical questions that can be asked in the interview, along with the intention and how to answer them.",
    ),
  behavioralQuestion: z
    .array(
      z.object({
        question: z.string().describe(
          "The behavioral question that can be asked in the interview",
        ),
        intention: z.string().describe(
          "The intention of interviewer behind asking this question",
        ),
        answer: z.string().describe(
          "How to answer this question, what points to cover, what approach to take etc.",
        ),
      }),
    )
    .describe(
      "Behavioral questions that can be asked in the interview, along with the intention and how to answer them.",
    ),
  skillGaps: z
    .array(
      z.object({
        skill: z.string().describe(
          "The skill gap that the candidate is lacking or needs to improve for this job role.",
        ),
        severity: z
          .enum(["low", "medium", "high"])
          .describe(
            "The severity of the skill gap, whether it is low, medium or high.",
          ),
      }),
    )
    .describe(
      "The skill gaps that the candidate is lacking or needs to improve for this job role, along with the severity of the skill gap.",
    ),
  preparationPlan: z
    .array(
      z.object({
        day: z
          .number()
          .describe("The day number in the preparation plan, starting from 1"),
        focus: z.string().describe(
          "The main focus of this day in the preparation plan, e.g. data structures, system design, mock interviews etc.",
        ),
        tasks: z
          .array(z.string())
          .describe(
            "List of tasks to be done on this day to follow the preparation plan, e.g. read a specific book or article, solve a set of problems, watch a video etc.",
          ),
      }),
    )
    .describe(
      "A day-wise preparation plan for the candidate to follow in order to prepare for the interview effectively",
    ),
    title: z.string().describe("The title of the job for which the interview report is generated")
});

const responseExample = `{
  "matchScore": 78,
  "technicalQuestion": [
    {
      "question": "Explain how REST APIs work and how you would design a scalable backend using Node.js.",
      "intention": "The interviewer wants to evaluate the candidate's understanding of backend architecture, REST principles, and ability to design scalable services.",
      "answer": "Start by explaining REST principles such as stateless communication, resource-based URLs, and HTTP methods. Then describe how Node.js with Express can be used to build APIs. Mention routing, middleware, controllers, and database integration. Discuss scalability techniques like load balancing, caching, and microservices."
    }
  ],
  "behavioralQuestion": [
    {
      "question": "Tell me about a challenging project you worked on and how you solved the problems you encountered.",
      "intention": "The interviewer wants to evaluate problem-solving ability, persistence, and real-world development experience.",
      "answer": "Use the STAR method. Describe the situation, explain the task you needed to complete, describe the actions you took to solve the problem, and conclude with the result and what you learned."
    }
  ],
  "skillGaps": [
    {
      "skill": "System Design",
      "severity": "medium"
    },
    {
      "skill": "Docker",
      "severity": "high"
    }
  ],
  "preparationPlan": [
    {
      "day": 1,
      "focus": "Data Structures and Algorithms",
      "tasks": [
        "Solve 5 array problems on LeetCode",
        "Review time complexity of common algorithms",
        "Revise hashing concepts"
      ]
    }
  ]
}`;

async function generateInterviewReport({
  resume,
  selfDescription,
  jobDescription,
}) {
  const prompt = `You are an AI interview preparation assistant. Generate a comprehensive interview preparation report in valid JSON format.

IMPORTANT: Return ONLY valid JSON, nothing else. No markdown, no code blocks, just pure JSON.

Use this exact structure:
${responseExample}

Here's the Candidate Data:
Resume: ${resume}
Self Description: ${selfDescription}
Job Description: ${jobDescription}

Generate the response following the same JSON structure shown above.`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });

  // Extract JSON from response (handle potential markdown formatting)
  let jsonText = response.text.trim();
  if (jsonText.startsWith("```json")) {
    jsonText = jsonText.replace(/^```json\n?/, "").replace(/\n?```$/, "");
  } else if (jsonText.startsWith("```")) {
    jsonText = jsonText.replace(/^```\n?/, "").replace(/\n?```$/, "");
  }

  const parsedResponse = JSON.parse(jsonText);
  
  // Validate against schema
  const validatedResponse = interviewReportSchema.parse(parsedResponse);
  
  console.log(validatedResponse);
  return validatedResponse;
}

module.exports = generateInterviewReport;