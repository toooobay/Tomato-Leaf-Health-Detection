import type { RefObject } from 'react';
import { AlertCircle, ArrowRight, CheckCircle2, Loader2, Upload, X } from 'lucide-react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { PageHeader } from '../components/PageHeader';
import type { Page } from '../types/app';
import './ScanPage.css';

interface ScanPageProps {
  file: File | null;
  preview: string | null;
  error: string | null;
  loading: boolean;
  isDragging: boolean;
  fileInputRef: RefObject<HTMLInputElement | null>;
  setIsDragging: (dragging: boolean) => void;
  processFile: (file: File) => void;
  removeFile: () => void;
  analyzeImage: () => void;
  navigate: (page: Page) => void;
}

export function ScanPage({
  file,
  preview,
  error,
  loading,
  isDragging,
  fileInputRef,
  setIsDragging,
  processFile,
  removeFile,
  analyzeImage,
  navigate,
}: ScanPageProps) {
  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Scan workspace"
        title="Upload a tomato leaf image"
        copy="Use one clear leaf image. The model will return only a Healthy or Unhealthy prediction."
      />

      <div className="scan-layout">
        <Card className="upload-card">
          <div
            className={`upload-zone ${isDragging ? 'is-dragging' : ''}`}
            onDragOver={(event) => {
              event.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(event) => {
              event.preventDefault();
              setIsDragging(false);
              const droppedFile = event.dataTransfer.files?.[0];
              if (droppedFile) processFile(droppedFile);
            }}
            onClick={() => fileInputRef.current?.click()}
            role="button"
            tabIndex={0}
          >
            <input
              ref={fileInputRef}
              className="hidden-input"
              type="file"
              onChange={(event) => {
                const selectedFile = event.target.files?.[0];
                if (selectedFile) processFile(selectedFile);
              }}
              accept="image/jpeg,image/png"
            />
            <Upload size={34} />
            <h2>Drag and drop leaf photo</h2>
            <p>JPG or PNG files are supported.</p>
          </div>

          {preview && (
            <div className="preview-strip">
              <img src={preview} alt="Selected tomato leaf preview" />
              <div>
                <strong>{file?.name || 'Selected scan'}</strong>
                <span>Ready for local inference</span>
              </div>
              <button className="icon-button" onClick={removeFile} title="Remove image" type="button">
                <X size={18} />
              </button>
            </div>
          )}

          {error && (
            <div className="notice notice-error">
              <AlertCircle size={18} />
              <p>{error}</p>
            </div>
          )}

          <div className="button-row">
            <Button onClick={analyzeImage} disabled={!preview || loading}>
              {loading ? (
                <>
                  <Loader2 className="spin" size={17} /> Analyzing image...
                </>
              ) : (
                <>
                  Analyze image <ArrowRight size={17} />
                </>
              )}
            </Button>
            <Button variant="secondary" onClick={() => navigate('guide')}>
              Photo guide
            </Button>
          </div>
        </Card>

        <Card className="tips-card" tone="soft">
          <h2>Photo guideline</h2>
          <ul className="check-list">
            <li><CheckCircle2 size={17} /> Use clear lighting</li>
            <li><CheckCircle2 size={17} /> Keep the leaf visible</li>
            <li><CheckCircle2 size={17} /> Avoid blurry images</li>
            <li><CheckCircle2 size={17} /> Avoid crowded background</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
