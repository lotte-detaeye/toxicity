import { useState, useEffect } from 'react';
import { HfInference } from '@huggingface/inference';
import { Shield, AlertTriangle } from "lucide-react";

function App() {
  const [text, setText] = useState('');
  const [result, setResult] = useState<ToxicityResult[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Initialize Hugging Face client
  const hf = new HfInference(import.meta.env.VITE_HF_TOKEN);

  // Analyze text function
  interface ToxicityResult {
    label: string;
    score: number;
  }

  interface TextClassificationResponse extends Array<ToxicityResult> {}

  const analyzeText = async (inputText: string): Promise<void> => {
    if (!inputText.trim()) {
      setResult(null);
      setError('');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response: TextClassificationResponse = await hf.textClassification({
        model: 'unitary/toxic-bert',
        inputs: inputText
      });

      setResult(response); // Store all results
    } catch (err: any) {
      setError('Analysis failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Auto-analyze when text changes (with 1 second delay)
  useEffect(() => {
    const timer = setTimeout(() => {
      analyzeText(text);
    }, 1000);

    return () => clearTimeout(timer);
  }, [text]);

  const getResultIcon = (score: number) => {
    if (score > 0.5) {
      return <AlertTriangle className="w-3 h-3" />;
    }
    return <Shield className="w-3 h-3" />;
  };

  // Moved color calculation logic inside the map callback below


  return (
    <div className="container">
      <div className="app-header">
        {/* <BookAlert
          size={32}
          className="icon-gradient"
          style={{ marginRight: "10px" }}
        /> */}
        <h1>Simple Toxicity Detector</h1>
      </div>

      <div>
        <label>Enter text to analyze:</label>
        <br />
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type your text here..."
          className="input-area"
        />
      </div>

      {loading && <p>Analyzing...</p>}

      {error && (
        <div style={{ color: "red", marginTop: "10px" }}>
          {error}
        </div>
      )}

      {result && (
        <div className="result-box">
          <h3>Result:</h3>
          {result.map((r, index) => {
            // Calculate color for progress bar
            const hue = 120 - r.score * 120; // 120 (green) to 0 (red)
            const lightness = 80 - r.score * 50;
            const progressColor = `hsl(${hue}, 70%, ${lightness}%)`;

            return (
              <div key={index} className="result-item">
                <div className="result-header">
                  <div className="result-label">
                    {getResultIcon(r.score)} {}
                    <span>{r.label}</span>
                  </div>
                  <div className="result-confidence">
                    <span>Confidence:</span>
                    <strong>{(r.score * 100).toFixed(1)}%</strong>
                  </div>
                </div>

                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${r.score * 100}%`,
                      backgroundColor: progressColor,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="footer-note">
        <p>
          This app uses Hugging Face's Toxic BERT model to analyze text.</p>
        <p>Analysis happens automatically 1 second after you stop typing.</p>
      </div>

    </div>
  );
}

export default App;