const mongoose = require('mongoose');

const scanSchema = new mongoose.Schema({
  jobDescription: { type: String, required: true },
  resumeText: { type: String, required: true },
  score: { type: Number, required: true },
  analysis: { type: Object, required: true },
  recommendations: [String],
  updatedResumePath: { type: String },
  source: { type: String, enum: ['web', 'telegram'], default: 'web' },
  telegramChatId: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Scan', scanSchema);
