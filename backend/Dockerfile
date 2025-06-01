# 🏗️ Stage 1: Build with dependencies
FROM python:3.11-slim AS builder

WORKDIR /app

# Install system deps just for building
RUN apt-get update && apt-get install -y \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .

# Install deps into a temporary directory
RUN pip install --upgrade pip && \
    pip install --prefix=/install --no-cache-dir -r requirements.txt

# 🧼 Remove build tools to reduce size
RUN apt-get purge -y build-essential && apt-get autoremove -y && apt-get clean

# 🧊 Stage 2: Minimal runtime image
FROM python:3.11-slim

WORKDIR /app

# Install runtime libs required by sentence-transformers
RUN apt-get update && apt-get install -y \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender-dev \
    && rm -rf /var/lib/apt/lists/*

# ✅ Copy installed packages from builder
COPY --from=builder /install /usr/local

RUN echo "Files in context:" && ls -al && du -sh *


# ✅ Copy app code
COPY . .

EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
