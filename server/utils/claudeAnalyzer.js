const axios = require('axios');

async function analyzeResumeWithClaude(jobDescription, resumeText) {
  const prompt = `You are an expert ATS (Applicant Tracking System) and career coach. Analyze the following resume against the job description.

JOB DESCRIPTION:
${jobDescription}

RESUME:
${resumeText}

Respond with ONLY a valid JSON object — no explanation, no markdown, no code fences. Just raw JSON.

{
  "score": <integer 1-10>,
  "scoreBreakdown": {
    "skillsMatch": <integer 1-10>,
    "experienceMatch": <integer 1-10>,
    "educationMatch": <integer 1-10>,
    "keywordsMatch": <integer 1-10>
  },
  "matchedSkills": ["skill1", "skill2"],
  "missingSkills": ["skill1", "skill2"],
  "strengths": ["strength1", "strength2", "strength3"],
  "weaknesses": ["weakness1", "weakness2", "weakness3"],
  "recommendations": ["rec1", "rec2", "rec3", "rec4", "rec5"],
  "summary": "2-3 sentence overall assessment here",
  "updatedResumeContent": {
    "name": "candidate name from resume",
    "email": "email if present",
    "phone": "phone if present",
    "summary": "improved professional summary tailored to the job",
    "skills": ["skill1", "skill2", "skill3"],
    "experience": "improved experience section as text",
    "education": "education from resume",
    "additionalSections": "certifications, projects etc from resume"
  }
}`;

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error('GROQ_API_KEY is not set in .env file');

  try {
    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'llama-3.3-70b-versatile',
        max_tokens: 2048,
        temperature: 0.3,
        messages: [
          {
            role: 'system',
            content: 'You are an ATS resume expert. Always respond with valid JSON only. No markdown, no code fences, no extra text.'
          },
          { role: 'user', content: prompt }
        ]
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const content = response.data.choices[0].message.content;
    // Strip any accidental markdown fences
    const clean = content.replace(/```json|```/g, '').trim();
    // Extract JSON object if there's extra text
    const jsonMatch = clean.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No valid JSON found in AI response');
    return JSON.parse(jsonMatch[0]);

  } catch (error) {
    if (error.response) {
      throw new Error('Groq API error: ' + JSON.stringify(error.response.data));
    }
    throw new Error('Analysis failed: ' + error.message);
  }
}

module.exports = { analyzeResumeWithClaude };
