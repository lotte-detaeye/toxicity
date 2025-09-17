## Simple Toxicity Detector

This is a minimal web app that uses AI to analyze the toxicity of text in real time. Built with React, TypeScript, and Vite, it leverages Hugging Face's `unitary/toxic-bert` model to classify input as toxic or non-toxic, providing a confidence score and a visual indicator.

---
<p align="center">
<img width="618" height="420" alt="Screenshot 2025-09-17 at 22 20 45" src="https://github.com/user-attachments/assets/7aac9721-98b4-4fc4-afc9-2503a31e632a" />
</p>

### Features
- **Real-time toxicity analysis**: Text is analyzed automatically 1 second after you stop typing.
- **AI-powered**: Uses Hugging Face's `unitary/toxic-bert` model via the Inference API.
- **Modern UI**: Clean, responsive design with progress bar and confidence display.
- **No backend required**: All inference happens client-side via API.

---

### Getting Started

#### Prerequisites
- Node.js (v18+ recommended)
- A Hugging Face API token ([get one here](https://huggingface.co/settings/tokens))

#### Installation
1. Clone this repo:
	```sh
	git clone <repo-url>
	cd tbuddy_minimal
	```
2. Install dependencies:
	```sh
	npm install
	```
3. Create a `.env` file in the root with your Hugging Face token:
	```env
	VITE_HF_TOKEN=your_huggingface_token_here
	```
4. Start the development server:
	```sh
	npm run dev
	```
5. Open [http://localhost:5173](http://localhost:5173) in your browser.

---

### Usage
1. Enter or paste text in the input area.
2. Wait for the analysis (auto-runs after 1 second of inactivity).
3. View the classification ("TOXIC" or "NON_TOXIC") and confidence score.

---

### Tech Stack
- [React 19](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [@huggingface/inference](https://www.npmjs.com/package/@huggingface/inference)
- [unitary/toxic-bert](https://huggingface.co/unitary/toxic-bert)

---

### Project Structure

```
src/
  App.tsx        # Main app logic
  main.tsx       # Entry point
  index.css      # Styles
index.html       # HTML template
vite.config.ts   # Vite config
```

---

### License
MIT
