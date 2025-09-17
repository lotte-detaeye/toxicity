import { useState, useEffect } from 'react';
import { HfInference } from '@huggingface/inference';
// import { BookAlert } from "lucide-react";

function App() {
  const [text, setText] = useState('');
  const [result, setResult] = useState<ToxicityResult | null>(null);
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

      setResult(response[0]); // Take first result
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
          <p>
            <strong>Classification:</strong> {result.label}
          </p>
          <p>
            <strong>Confidence:</strong>{" "}
            {(result.score * 100).toFixed(1)}%
          </p>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{
                width: `${result.score * 100}%`,
                backgroundColor:
                  result.label === "TOXIC" ? "#e57373" : "#81c784",
              }}
            />
          </div>
        </div>
      )}

      <div className="footer-note">
        <p>
          This app uses Hugging Face's Toxic BERT model to analyze text.
        </p>
        <p>Analysis happens automatically 1 second after you stop typing.</p>
      </div>
    </div>
  );
}

export default App;