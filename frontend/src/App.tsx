import { useEffect, useMemo, useRef, useState } from 'react';
import axios from 'axios';
import { AppShell } from './layout/AppShell';
import { getPageFromHash, getRouteHref } from './routes/routes';
import { GuidePage } from './pages/GuidePage';
import { HistoryPage } from './pages/HistoryPage';
import { LandingPage } from './pages/LandingPage';
import { ModelPage } from './pages/ModelPage';
import { ResultPage } from './pages/ResultPage';
import { ScanPage } from './pages/ScanPage';
import type { Page, PredictionResult, ScanRecord } from './types/app';
import { getProbabilitySplit } from './utils/prediction';

const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8000').replace(/\/$/, '');

function App() {
  const [page, setPage] = useState<Page>(() => getPageFromHash());
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [inferenceTimeMs, setInferenceTimeMs] = useState<number | null>(null);
  const [history, setHistory] = useState<ScanRecord[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const probability = useMemo(() => getProbabilitySplit(result), [result]);

  useEffect(() => {
    const handleHashChange = () => setPage(getPageFromHash());
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = (nextPage: Page) => {
    window.location.hash = getRouteHref(nextPage).replace(/^#/, '');
    setPage(nextPage);
  };

  const processFile = (selectedFile: File) => {
    const allowedTypes = ['image/jpeg', 'image/png'];
    if (!allowedTypes.includes(selectedFile.type)) {
      setError('Invalid image format. Please upload a JPG or PNG file.');
      setFile(null);
      setPreview(null);
      setResult(null);
      setInferenceTimeMs(null);
      navigate('scan');
      return;
    }

    setFile(selectedFile);
    setResult(null);
    setError(null);
    setInferenceTimeMs(null);

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
      navigate('scan');
    };
    reader.readAsDataURL(selectedFile);
  };

  const removeFile = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
    setError(null);
    setInferenceTimeMs(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const analyzeImage = async () => {
    if (!file) return;

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);
    const startedAt = performance.now();

    try {
      const response = await axios.post(`${API_URL}/predict`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      const elapsed = Math.round(performance.now() - startedAt);
      const nextResult = response.data as PredictionResult;
      setResult(nextResult);
      setInferenceTimeMs(elapsed);

      if (preview) {
        const record: ScanRecord = {
          id: `${Date.now()}`,
          date: new Date().toLocaleString(),
          prediction: nextResult.prediction,
          confidence: Number(nextResult.confidence_percentage) || 0,
          preview,
          fileName: file.name,
          inferenceTimeMs: elapsed,
        };
        setHistory((items) => [record, ...items].slice(0, 12));
      }

      navigate('result');
    } catch (err: unknown) {
      const apiMessage =
        axios.isAxiosError(err) && typeof err.response?.data?.detail === 'string'
          ? err.response.data.detail
          : null;
      setError(apiMessage || 'Failed to connect to the prediction server. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const openRecord = (record: ScanRecord) => {
    setPreview(record.preview);
    setResult({
      prediction: record.prediction,
      prediction_code: record.prediction === 'Healthy' ? 0 : 1,
      confidence: record.confidence / 100,
      confidence_percentage: record.confidence,
    });
    setInferenceTimeMs(record.inferenceTimeMs ?? null);
    setFile(null);
    setError(null);
    navigate('result');
  };

  const renderPage = () => {
    switch (page) {
      case 'scan':
        return (
          <ScanPage
            file={file}
            preview={preview}
            error={error}
            loading={loading}
            isDragging={isDragging}
            fileInputRef={fileInputRef}
            setIsDragging={setIsDragging}
            processFile={processFile}
            removeFile={removeFile}
            analyzeImage={analyzeImage}
            navigate={navigate}
          />
        );
      case 'result':
        return (
          <ResultPage
            preview={preview}
            result={result}
            probability={probability}
            inferenceTimeMs={inferenceTimeMs}
            navigate={navigate}
            removeFile={removeFile}
          />
        );
      case 'history':
        return <HistoryPage history={history} openRecord={openRecord} navigate={navigate} />;
      case 'model':
        return <ModelPage />;
      case 'guide':
        return <GuidePage navigate={navigate} />;
      case 'landing':
      default:
        return <LandingPage navigate={navigate} result={result} preview={preview} />;
    }
  };

  return <AppShell activePage={page}>{renderPage()}</AppShell>;
}

export default App;
