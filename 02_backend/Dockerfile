FROM nvidia/cuda:11.8.0-base-ubuntu20.04

ENV DEBIAN_FRONTEND=noninteractive \
    TZ=Etc/UTC

WORKDIR /app

RUN apt-get update && apt-get install -y \
    software-properties-common \
    build-essential \
    wget \
    curl \
    git \
    ca-certificates \
    libgl1-mesa-glx \
    libglib2.0-0 \
    libsm6 \
    libxrender1 \
    libxext6 \
    && add-apt-repository ppa:deadsnakes/ppa \
    && apt-get update && apt-get install -y python3.10 python3.10-venv python3.10-dev python3-pip \
    && rm -rf /var/lib/apt/lists/*

RUN update-alternatives --install /usr/bin/python python /usr/bin/python3.10 1
RUN update-alternatives --install /usr/bin/pip pip /usr/bin/pip3 1

RUN pip install --upgrade pip

RUN pip install --no-cache-dir torch torchvision --index-url https://download.pytorch.org/whl/cu118

RUN pip install --no-cache-dir \
    huggingface_hub==0.19.4 \
    transformers==4.35.2 \
    diffusers==0.23.1 \
    accelerate==0.23.0

RUN pip install --no-cache-dir \
    opencv-python-headless \
    safetensors==0.3.2

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]