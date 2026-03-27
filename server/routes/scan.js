const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { scanResume } = require('../controllers/scanController');

router.post(
  '/',
  upload.fields([
    { name: 'jobDescription', maxCount: 1 },
    { name: 'resume', maxCount: 1 }
  ]),
  scanResume
);

module.exports = router;
