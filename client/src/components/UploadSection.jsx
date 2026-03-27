import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import './UploadSection.css';

export default function UploadSection({ setResults, setIsLoading, isLoading }) {
  const [jobDescType, setJobDescType] = useState('text'); // 'text' | 'file'
  const [jobDescText, setJobDescText] = useState('');
  const [jobDescFile, setJobDescFile] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [error, setError] = useState('');

  // JD dropzone
  const onDropJD = useCallback(files => {
    if (files[0]) { setJobDescFile(files[0]); setError(''); }
  }, []);

  const jdDropzone = useDropzone({
    onDrop: onDropJD,
    accept: { 'application/pdf': ['.pdf'], 'text/plain': ['.txt'] },
    maxFiles: 1, disabled: isLoading
  });

  // Resume dropzone
  const onDropResume = useCallback(files => {
    if (files[0]) { setResumeFile(files[0]); setError(''); }
  }, []);

  const resumeDropzone = useDropzone({
    onDrop: onDropResume,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1, disabled: isLoading
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (jobDescType === 'text' && jobDescText.trim().length < 20) {
      setError('Please enter a job description (at least 20 characters).');
      return;
    }
    if (jobDescType === 'file' && !jobDescFile) {
      setError('Please upload a job description file.');
      return;
    }
    if (!resumeFile) {
      setError('Please upload your resume PDF.');
      return;
    }

    const formData = new FormData();
    if (jobDescType === 'text') {
      formData.append('jobDescriptionText', jobDescText);
    } else {
      formData.append('jobDescription', jobDescFile);
    }
    formData.append('resume', resumeFile);

    setIsLoading(true);
    setResults(null);
    window.scrollTo({ top: 400, behavior: 'smooth' });

    try {
  const res = await axios.post(
    `${import.meta.env.VITE_API_URL}/api/scan`,
    formData,
    {
      headers: { 'Content-Type': 'multipart/form-data' }
    }
  );

  setResults(res.data);

  setTimeout(() => {
    document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' });
  }, 200);

} catch (err) {
  const msg = err.response?.data?.error || err.message || 'Something went wrong';
  setError(msg);
}finally {
      setIsLoading(false);
    }
  };

  const canSubmit = !isLoading &&
    (jobDescType === 'text' ? jobDescText.trim().length > 20 : !!jobDescFile) &&
    !!resumeFile;

  return (
    <section className="upload-section" id="scan">
      <div className="section-label">
        <span className="label-number">01</span>
        <span className="label-text">Upload & Analyze</span>
      </div>

      <form className="upload-form" onSubmit={handleSubmit}>
        {/* Job Description */}
        <div className="form-card">
          <div className="form-card-header">
            <div className="card-icon jd-icon">📋</div>
            <div>
              <h3 className="card-title">Job Description</h3>
              <p className="card-subtitle">Paste text or upload a PDF/TXT file</p>
            </div>
          </div>

          <div className="toggle-tabs">
            <button
              type="button"
              className={`tab-btn ${jobDescType === 'text' ? 'active' : ''}`}
              onClick={() => setJobDescType('text')}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z"/>
                <polyline points="14,2 14,8 20,8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
              </svg>
              Paste Text
            </button>
            <button
              type="button"
              className={`tab-btn ${jobDescType === 'file' ? 'active' : ''}`}
              onClick={() => setJobDescType('file')}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                <polyline points="17,8 12,3 7,8"/>
                <line x1="12" y1="3" x2="12" y2="15"/>
              </svg>
              Upload File
            </button>
          </div>

          {jobDescType === 'text' ? (
            <textarea
              className="jd-textarea"
              placeholder="Paste the full job description here...&#10;&#10;Include: required skills, responsibilities, qualifications..."
              value={jobDescText}
              onChange={e => setJobDescText(e.target.value)}
              rows={8}
              disabled={isLoading}
            />
          ) : (
            <div
              {...jdDropzone.getRootProps()}
              className={`dropzone ${jdDropzone.isDragActive ? 'drag-active' : ''} ${jobDescFile ? 'has-file' : ''}`}
            >
              <input {...jdDropzone.getInputProps()} />
              {jobDescFile ? (
                <FilePreview file={jobDescFile} onRemove={() => setJobDescFile(null)} />
              ) : (
                <DropzonePrompt
                  icon="📋"
                  title="Drop job description here"
                  subtitle="PDF or TXT • Max 10MB"
                  isDragging={jdDropzone.isDragActive}
                />
              )}
            </div>
          )}
        </div>

        {/* Resume */}
        <div className="form-card">
          <div className="form-card-header">
            <div className="card-icon resume-icon">📄</div>
            <div>
              <h3 className="card-title">Your Resume</h3>
              <p className="card-subtitle">Upload your resume as a PDF file</p>
            </div>
          </div>

          <div
            {...resumeDropzone.getRootProps()}
            className={`dropzone ${resumeDropzone.isDragActive ? 'drag-active' : ''} ${resumeFile ? 'has-file' : ''}`}
          >
            <input {...resumeDropzone.getInputProps()} />
            {resumeFile ? (
              <FilePreview file={resumeFile} onRemove={() => setResumeFile(null)} />
            ) : (
              <DropzonePrompt
                icon="📄"
                title="Drop your resume PDF here"
                subtitle="PDF only • Max 10MB"
                isDragging={resumeDropzone.isDragActive}
              />
            )}
          </div>
        </div>

        {error && (
          <div className="error-banner">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <button
          type="submit"
          className={`submit-btn ${canSubmit ? 'enabled' : 'disabled'}`}
          disabled={!canSubmit}
        >
          {isLoading ? (
            <>
              <span className="loading-dot" />
              <span className="loading-dot" />
              <span className="loading-dot" />
              <span>Analyzing...</span>
            </>
          ) : (
            <>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.35-4.35"/>
              </svg>
              Analyze Resume
            </>
          )}
        </button>
      </form>
    </section>
  );
}

function DropzonePrompt({ icon, title, subtitle, isDragging }) {
  return (
    <div className="dropzone-prompt">
      <div className={`dz-icon ${isDragging ? 'dragging' : ''}`}>{icon}</div>
      <p className="dz-title">{isDragging ? 'Release to upload!' : title}</p>
      <p className="dz-subtitle">{subtitle}</p>
      <span className="dz-btn">Browse files</span>
    </div>
  );
}

function FilePreview({ file, onRemove }) {
  const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
  return (
    <div className="file-preview" onClick={e => e.stopPropagation()}>
      <div className="file-preview-icon">
        {file.name.endsWith('.pdf') ? '📕' : '📄'}
      </div>
      <div className="file-preview-info">
        <span className="file-name">{file.name}</span>
        <span className="file-size">{sizeMB} MB</span>
      </div>
      <button
        className="file-remove"
        type="button"
        onClick={onRemove}
        title="Remove file"
      >
        ✕
      </button>
    </div>
  );
}
