# Stage 1: Build dependencies
FROM python:3.11-slim AS builder

WORKDIR /app

# System dependencies (optional, include only if needed)
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --upgrade pip && pip install --prefix=/install -r requirements.txt

# Stage 2: Final runtime image
FROM python:3.11-slim

WORKDIR /app

# Copy only installed dependencies and app files
COPY --from=builder /install /usr/local
COPY . .


# Set environment variables
ENV PYTHONUNBUFFERED=1

# Start the FastAPI app
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
