const { GoogleGenAI } = require("@google/genai");
const { z } = require("zod");
const { zodToJsonSchema } = require("zod-to-json-schema");

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENAI_API_KEY,
});

const interviewReportSchema = z.object({
  matchScore: z
    .number()
    .min(0)
    .max(100)
    .describe(
      "A score between 0 to 100 indicating how well the candidate's resume and self-description match the job description.",
    ),
  technicalQuestions: z
    .array(
      z.object({
        question: z.string().min(1).describe(
          "The technical question that can be asked in the interview",
        ),
        intention: z.string().min(1).describe(
          "The intention of interviewer behind asking this question",
        ),
        answer: z.string().min(1).describe(
          "How to answer this question, what points to cover, what approach to take etc.",
        ),
      }),
    )
    .min(4)
    .describe(
      "Technical questions (minimum 4) that can be asked in the interview, along with the intention and how to answer them.",
    ),
  behavioralQuestions: z
    .array(
      z.object({
        question: z.string().min(1).describe(
          "The behavioral question that can be asked in the interview",
        ),
        intention: z.string().min(1).describe(
          "The intention of interviewer behind asking this question",
        ),
        answer: z.string().min(1).describe(
          "How to answer this question, what points to cover, what approach to take etc.",
        ),
      }),
    )
    .min(4)
    .describe(
      "Behavioral questions (minimum 4) that can be asked in the interview, along with the intention and how to answer them.",
    ),
  skillGaps: z
    .array(
      z.object({
        skill: z.string().min(1).describe(
          "The skill gap that the candidate is lacking or needs to improve for this job role.",
        ),
        severity: z
          .enum(["low", "medium", "high"])
          .describe(
            "The severity of the skill gap, whether it is low, medium or high.",
          ),
      }),
    )
    .min(1)
    .describe(
      "The skill gaps that the candidate is lacking or needs to improve for this job role, along with the severity of the skill gap.",
    ),
  preparationPlan: z
    .array(
      z.object({
        day: z
          .number()
          .int()
          .positive()
          .describe("The day number in the preparation plan, starting from 1"),
        focus: z.string().min(1).describe(
          "The main focus of this day in the preparation plan, e.g. data structures, system design, mock interviews etc.",
        ),
        tasks: z
          .array(z.string().min(1))
          .min(2)
          .describe(
            "List of tasks to be done on this day to follow the preparation plan, e.g. read a specific book or article, solve a set of problems, watch a video etc.",
          ),
      }),
    )
    .min(1)
    .describe(
      "A day-wise preparation plan for the candidate to follow in order to prepare for the interview effectively",
    ),
  title: z.string().min(1).describe("The title of the job for which the interview report is generated"),
});

const responseExample = `{
  "matchScore": 78,
  "title": "Software Engineer",
  "technicalQuestions": [
    {
      "question": "Explain how REST APIs work and how you would design a scalable backend using Node.js.",
      "intention": "The interviewer wants to evaluate the candidate's understanding of backend architecture, REST principles, and ability to design scalable services.",
      "answer": "Start by explaining REST principles such as stateless communication, resource-based URLs, and HTTP methods. Then describe how Node.js with Express can be used to build APIs. Mention routing, middleware, controllers, and database integration. Discuss scalability techniques like load balancing, caching, and microservices."
    },
    {
      "question": "What is the difference between SQL and NoSQL databases? When would you use each?",
      "intention": "Assess database design knowledge and ability to choose appropriate data storage solutions.",
      "answer": "SQL databases are relational, ACID-compliant, and suitable for structured data with fixed schemas. NoSQL databases are flexible, scalable horizontally, and better for unstructured/semi-structured data. Use SQL for financial systems, use NoSQL for high-scale applications like social media feeds."
    },
    {
      "question": "Explain the concept of asynchronous programming and how it works in JavaScript.",
      "intention": "Evaluate understanding of event loops, callbacks, promises, and async/await patterns.",
      "answer": "Asynchronous programming allows non-blocking operations. JavaScript uses callbacks, Promises, and async/await. Explain the event loop, call stack, and task queue. Demonstrate how async/await simplifies Promise handling compared to callbacks."
    },
    {
      "question": "How would you optimize the performance of a slow database query?",
      "intention": "Assess problem-solving skills and knowledge of database optimization techniques.",
      "answer": "Analyze query execution plans using EXPLAIN. Add indexes to frequently queried columns. Avoid N+1 queries with joins or batch loading. Consider query restructuring, partitioning, caching strategies, and database statistics. Profile before optimizing."
    }
  ],
  "behavioralQuestions": [
    {
      "question": "Tell me about a challenging project you worked on and how you solved the problems you encountered.",
      "intention": "The interviewer wants to evaluate problem-solving ability, persistence, and real-world development experience.",
      "answer": "Use the STAR method: Situation (context), Task (responsibility), Action (what you did), Result (outcome). Highlight how you overcame obstacles, communicated with team members, and what you learned from the experience."
    },
    {
      "question": "Describe a time when you had to work with a difficult team member. How did you handle it?",
      "intention": "Assess interpersonal skills, conflict resolution, and professional maturity.",
      "answer": "Share a specific example showing emotional intelligence and professionalism. Explain how you understood their perspective, communicated openly, and found a collaborative solution. Focus on positive outcomes and what you learned."
    },
    {
      "question": "Tell me about a time when you had to learn something new quickly.",
      "intention": "Evaluate adaptability, learning ability, and self-motivation.",
      "answer": "Describe a specific technology or domain you had to master. Explain your learning approach (documentation, online courses, pair programming), how quickly you became productive, and the positive impact on your work."
    },
    {
      "question": "How do you prioritize tasks when you have multiple deadlines?",
      "intention": "Assess time management, organization, and ability to handle pressure.",
      "answer": "Discuss your prioritization framework (urgency vs importance, stakeholder impact). Mention how you communicate with managers/team about timelines, break down complex tasks, and maintain quality while meeting deadlines."
    }
  ],
  "skillGaps": [
    {
      "skill": "System Design",
      "severity": "medium"
    },
    {
      "skill": "Docker & Kubernetes",
      "severity": "high"
    },
    {
      "skill": "Advanced SQL Optimization",
      "severity": "medium"
    },
    {
      "skill": "Cloud Architecture (AWS)",
      "severity": "low"
    }
  ],
  "preparationPlan": [
    {
      "day": 1,
      "focus": "Data Structures and Algorithms Fundamentals",
      "tasks": [
        "Review arrays, linked lists, and hash tables on GeeksforGeeks",
        "Solve 5 easy array problems on LeetCode",
        "Study time and space complexity analysis",
        "Practice coding one problem without IDE, using pen and paper"
      ]
    },
    {
      "day": 2,
      "focus": "Tree and Graph Data Structures",
      "tasks": [
        "Learn binary tree and BST traversal techniques (inorder, preorder, postorder)",
        "Solve 3 binary tree problems on LeetCode",
        "Study graph representations and BFS/DFS algorithms",
        "Practice explaining tree problems to someone"
      ]
    },
    {
      "day": 3,
      "focus": "Dynamic Programming and Recursion",
      "tasks": [
        "Review recursion fundamentals and call stack",
        "Solve 4 DP problems of medium difficulty",
        "Study memoization and tabulation approaches",
        "Debug a DP solution by hand"
      ]
    },
    {
      "day": 4,
      "focus": "System Design Basics",
      "tasks": [
        "Read a system design primer article on backend design patterns",
        "Study microservices architecture and distributed systems concepts",
        "Design a simple URL shortener on paper",
        "Watch a 30-minute system design interview walkthrough"
      ]
    },
    {
      "day": 5,
      "focus": "Behavioral Interview Preparation",
      "tasks": [
        "Write down 5 STAR stories from your past projects",
        "Practice mock interview with a friend or using an online platform",
        "Record yourself answering 3 behavioral questions",
        "Research the company culture and prepare relevant questions"
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

IMPORTANT REQUIREMENTS:
1. Return ONLY valid JSON, nothing else. No markdown, no code blocks, just pure JSON.
2. Include AT LEAST 4 technical questions with detailed answers
3. Include AT LEAST 4 behavioral questions with detailed answers
4. NO field should be null or empty
5. Every field must have meaningful content

Use this exact JSON structure:
${responseExample}

Here's the Candidate Data:
Resume: ${resume}
Self Description: ${selfDescription}
Job Description: ${jobDescription}

Generate a comprehensive response following the exact JSON structure shown above. Ensure:
- matchScore is between 0-100
- At least 4 technical questions with detailed intentions and answers
- At least 4 behavioral questions with detailed intentions and answers
- Identify 3-5 skill gaps with appropriate severity levels
- Create a 5-day preparation plan with multiple tasks per day
- All text fields are filled with substantial content (no empty strings)`;

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
  
  console.log("Generated Interview Report:", validatedResponse);
  return validatedResponse;
}

module.exports = generateInterviewReport;