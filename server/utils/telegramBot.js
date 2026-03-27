const TelegramBot = require('node-telegram-bot-api');
const path = require('path');
const fs = require('fs');
const { extractTextFromBuffer } = require('./pdfParser');
const { analyzeResumeWithClaude } = require('./claudeAnalyzer');
const { generateUpdatedResumePDF } = require('./pdfGenerator');

const outputDir = path.join(__dirname, '../outputs');
const userSessions = {};

let bot = null;

function init(app) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) return;

  bot = new TelegramBot(token, { polling: true });

  bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    userSessions[chatId] = { step: 'idle' };

    bot.sendMessage(chatId,
      `👋 Welcome to *Resume Scanner Bot*!\n\n` +
      `I'll analyze your resume against a job description and give you:\n` +
      `• 📊 ATS Score out of 10\n` +
      `• ✅ Matched skills\n` +
      `• ❌ Missing skills\n` +
      `• 💡 Recommendations\n` +
      `• 📄 Updated Resume PDF\n\n` +
      `Type /scan to get started!`,
      { parse_mode: 'Markdown' }
    );
  });

  bot.onText(/\/scan/, (msg) => {
    const chatId = msg.chat.id;
    userSessions[chatId] = { step: 'waiting_jd' };
    bot.sendMessage(chatId,
      `📋 *Step 1 of 2*\n\nPlease send the *Job Description*.\nYou can:\n• Type/paste the text directly\n• Send it as a PDF file`,
      { parse_mode: 'Markdown' }
    );
  });

  bot.onText(/\/help/, (msg) => {
    bot.sendMessage(msg.chat.id,
      `📖 *How to use Resume Scanner Bot:*\n\n` +
      `1. Type /scan to begin\n` +
      `2. Send the Job Description (text or PDF)\n` +
      `3. Send your Resume PDF\n` +
      `4. Get your score and analysis!\n\n` +
      `Commands:\n/start - Welcome message\n/scan - Start scanning\n/help - Show this help`,
      { parse_mode: 'Markdown' }
    );
  });

  // Handle text messages
  bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const session = userSessions[chatId] || { step: 'idle' };

    // Text message handling
    if (msg.text && !msg.text.startsWith('/')) {
      if (session.step === 'waiting_jd') {
        userSessions[chatId] = { step: 'waiting_resume', jobDescription: msg.text };
        bot.sendMessage(chatId,
          `✅ Job Description received!\n\n📄 *Step 2 of 2*\n\nNow please send your *Resume as a PDF file*.`,
          { parse_mode: 'Markdown' }
        );
      } else {
        bot.sendMessage(chatId, `Type /scan to start a new resume analysis.`);
      }
    }

    // Document handling
    if (msg.document) {
      const fileId = msg.document.file_id;
      const fileName = msg.document.file_name || '';

      try {
        // Download file
        const fileLink = await bot.getFileLink(fileId);
        const axios = require('axios');
        const response = await axios.get(fileLink, { responseType: 'arraybuffer' });
        const buffer = Buffer.from(response.data);

        let text = '';
        if (fileName.toLowerCase().endsWith('.pdf')) {
          text = await extractTextFromBuffer(buffer);
        } else {
          text = buffer.toString('utf8');
        }

        if (session.step === 'waiting_jd') {
          userSessions[chatId] = { step: 'waiting_resume', jobDescription: text };
          bot.sendMessage(chatId,
            `✅ Job Description PDF received!\n\n📄 *Step 2 of 2*\n\nNow please send your *Resume as a PDF file*.`,
            { parse_mode: 'Markdown' }
          );
        } else if (session.step === 'waiting_resume') {
          // Start analysis
          const processingMsg = await bot.sendMessage(chatId,
            `⏳ *Analyzing your resume...*\nThis may take 15-30 seconds.`,
            { parse_mode: 'Markdown' }
          );

          const analysis = await analyzeResumeWithClaude(session.jobDescription, text);
          const scoreEmoji = analysis.score >= 7 ? '🟢' : analysis.score >= 5 ? '🟡' : '🔴';

          // Generate updated resume PDF
          const { fileName: pdfName, filePath: pdfPath } = await generateUpdatedResumePDF(analysis, outputDir);

          // Build result message
          let resultMsg = `${scoreEmoji} *ATS SCORE: ${analysis.score}/10*\n\n`;
          resultMsg += `📝 *Summary:*\n${analysis.summary}\n\n`;

          if (analysis.matchedSkills && analysis.matchedSkills.length > 0) {
            resultMsg += `✅ *Matched Skills (${analysis.matchedSkills.length}):*\n`;
            resultMsg += analysis.matchedSkills.slice(0, 8).map(s => `• ${s}`).join('\n') + '\n\n';
          }

          if (analysis.missingSkills && analysis.missingSkills.length > 0) {
            resultMsg += `❌ *Missing Skills:*\n`;
            resultMsg += analysis.missingSkills.slice(0, 6).map(s => `• ${s}`).join('\n') + '\n\n';
          }

          if (analysis.score < 7 && analysis.recommendations) {
            resultMsg += `💡 *Top Recommendations:*\n`;
            resultMsg += analysis.recommendations.slice(0, 4).map((r, i) => `${i + 1}. ${r}`).join('\n') + '\n\n';
          }

          resultMsg += `📄 Sending your updated resume PDF below...`;

          await bot.editMessageText(resultMsg, {
            chat_id: chatId,
            message_id: processingMsg.message_id,
            parse_mode: 'Markdown'
          });

          // Send updated resume PDF
          await bot.sendDocument(chatId, pdfPath, {
            caption: `📄 *Your Optimized Resume*\nATS Score: ${analysis.score}/10\nOptimized for the target job.`,
            parse_mode: 'Markdown'
          });

          userSessions[chatId] = { step: 'idle' };
          bot.sendMessage(chatId, `Type /scan to analyze another resume! 🚀`);

          // Cleanup
          setTimeout(() => {
            if (fs.existsSync(pdfPath)) fs.unlinkSync(pdfPath);
          }, 60000);
        }
      } catch (err) {
        console.error('Telegram bot error:', err);
        bot.sendMessage(chatId, `❌ Error: ${err.message}\n\nPlease try again with /scan`);
        userSessions[chatId] = { step: 'idle' };
      }
    }
  });

  console.log('🤖 Telegram Bot polling started');
}

module.exports = { init };
