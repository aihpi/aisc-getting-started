import React from 'react';
import './App.css';
import Chatbot from './components/Chatbot';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <div className="header-content">
          <div className="logo-container">
            <img 
              src="/logo_aisc_150dpi.png" 
              alt="AI Service Center Berlin-Brandenburg" 
              className="logo-left"
            />
            <img 
              src="/logo_bmftr_de.png" 
              alt="Bundesministerium für Forschung, Technologie und Raumfahrt" 
              className="logo-right"
            />
          </div>
          <h1>AISC Getting Started - AI Chatbot Demo</h1>
          <p>Chat with a local AI model powered by Ollama</p>
        </div>
      </header>
      <main className="App-main">
        <Chatbot />
      </main>
    </div>
  );
}

export default App;
