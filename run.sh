#!/bin/bash

# Check if GPU is available
if nvidia-smi &> /dev/null; then
    echo "GPU detected - using GPU acceleration"
    GPU_AVAILABLE=true
else
    echo "No GPU detected - using CPU"
    GPU_AVAILABLE=false
fi

# Start services in detached mode
echo "Starting services..."
docker compose up -d --build

# Wait for Ollama to be ready
echo "Waiting for Ollama to start..."
until curl -s http://localhost:11435/api/tags > /dev/null 2>&1; do
  echo -n "."
  sleep 2
done
echo " Ready!"

# Check if llama3.2:1b model exists
if ! docker exec aisc-ollama ollama list | grep -q "llama3.2:1b"; then
    echo "Downloading llama3.2:1b model (this may take several minutes)..."
    echo "This is a one-time download - subsequent starts will be much faster"
    docker exec aisc-ollama ollama pull llama3.2:1b
    
    if [ $? -eq 0 ]; then
        echo "Model llama3.2:1b downloaded successfully!"
    else
        echo "Failed to download model llama3.2:1b"
        exit 1
    fi
else
    echo "Model llama3.2:1b already available"
fi

echo "All services ready!"
echo "- Frontend: http://localhost:3000"
echo "- Backend API: http://localhost:8000"
echo "- Ollama API: http://localhost:11435"
echo ""
echo "Press Ctrl+C to stop all services"

# Follow logs
docker compose logs -f
