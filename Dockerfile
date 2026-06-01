# Use an official Python runtime as a parent image
FROM python:3.11-slim

# Set the working directory in the container
WORKDIR /workspace

# Install system dependencies if any are needed (e.g., build-essential for compiling some python extensions)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy the requirements file into the container
COPY requirements-docker.txt .

# Install any needed packages specified in requirements-docker.txt
RUN pip install --no-cache-dir -r requirements-docker.txt

# Copy the rest of the backend application code
COPY app/ ./app/
COPY models_storage/ ./models_storage/
COPY churn.db .

# Make port 8000 available to the world outside this container
EXPOSE 8000

# Define environment variables
ENV PYTHONUNBUFFERED=1

# Run uvicorn server when the container launches
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
