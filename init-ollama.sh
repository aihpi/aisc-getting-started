#!/bin/sh

echo "🚀 Starting Ollama service..."

# Start Ollama in the background
/bin/ollama serve &
OLLAMA_PID=$!

# Wait for Ollama to be ready
echo "⏳ Waiting for Ollama to start..."
while ! curl -s http://localhost:11434/api/tags > /dev/null; do
    sleep 2
done

echo "✅ Ollama is ready!"

# Check if the model already exists
if ollama list | grep -q "llama3.2:1b"; then
    echo "✅ Model llama3.2:1b already exists, skipping download"
else
    echo "📥 Downloading llama3.2:1b model (this may take several minutes)..."
    echo "💡 This is a one-time download - subsequent starts will be much faster"
    
    # Pull the model with progress
    ollama pull llama3.2:1b
    
    if [ $? -eq 0 ]; then
        echo "✅ Model llama3.2:1b downloaded successfully!"
    else
        echo "❌ Failed to download model llama3.2:1b"
        exit 1
    fi
fi

echo "🎉 Ollama is ready with llama3.2:1b model!"

# Wait for the Ollama process to finish
wait $OLLAMA_PID
