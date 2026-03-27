const path = require('path');
const fs = require('fs');
const { extractTextFromPDF } = require('../utils/pdfParser');
const { analyzeResumeWithClaude } = require('../utils/claudeAnalyzer');
const { generateUpdatedResumePDF } = require('../utils/pdfGenerator');

const outputDir = path.join(__dirname, '../outputs');

const scanResume = async (req, res) => {
  let jdFilePath = null;
  let resumeFilePath = null;

  try {
    const files = req.files;
    const { jobDescriptionText } = req.body;

    if (!files || !files.resume || files.resume.length === 0) {
      return res.status(400).json({ error: 'Resume PDF is required' });
    }

    resumeFilePath = files.resume[0].path;

    // Get job description text
    let jobDescription = jobDescriptionText || '';
    if (files.jobDescription && files.jobDescription.length > 0) {
      jdFilePath = files.jobDescription[0].path;
      if (jdFilePath.endsWith('.pdf')) {
        jobDescription = await extractTextFromPDF(jdFilePath);
      } else {
        jobDescription = fs.readFileSync(jdFilePath, 'utf8');
      }
    }

    if (!jobDescription || jobDescription.trim().length < 20) {
      return res.status(400).json({ error: 'Job description is too short or missing' });
    }

    // Extract resume text
    const resumeText = await extractTextFromPDF(resumeFilePath);
    if (!resumeText || resumeText.trim().length < 50) {
      return res.status(400).json({ error: 'Could not extract text from resume PDF' });
    }

    // Analyze with Claude
    const analysis = await analyzeResumeWithClaude(jobDescription, resumeText);

    // Generate updated resume PDF
    const { fileName, filePath } = await generateUpdatedResumePDF(analysis, outputDir);

    const downloadUrl = `${process.env.SERVER_URL || `http://localhost:${process.env.PORT || 5000}`}/outputs/${fileName}`;

    // Cleanup uploaded files
    if (jdFilePath && fs.existsSync(jdFilePath)) fs.unlinkSync(jdFilePath);
    if (resumeFilePath && fs.existsSync(resumeFilePath)) fs.unlinkSync(resumeFilePath);

    // Schedule cleanup of generated PDF after 10 minutes
    setTimeout(() => {
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }, 10 * 60 * 1000);

    res.json({
      success: true,
      score: analysis.score,
      scoreBreakdown: analysis.scoreBreakdown,
      matchedSkills: analysis.matchedSkills || [],
      missingSkills: analysis.missingSkills || [],
      strengths: analysis.strengths || [],
      weaknesses: analysis.weaknesses || [],
      recommendations: analysis.recommendations || [],
      summary: analysis.summary,
      downloadUrl
    });

  } catch (error) {
    // Cleanup on error
    if (jdFilePath && fs.existsSync(jdFilePath)) fs.unlinkSync(jdFilePath);
    if (resumeFilePath && fs.existsSync(resumeFilePath)) fs.unlinkSync(resumeFilePath);

    console.error('Scan error:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
};

module.exports = { scanResume };
