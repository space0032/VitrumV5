FROM python:3.11-slim

# Set Python environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Create a non-root user and give them ownership of the /app directory
# (including /app/data so the sqlite database volume is writable)
RUN adduser --disabled-password --gecos "" appuser \
    && mkdir -p /app/data \
    && chown -R appuser:appuser /app
USER appuser

# Expose port
EXPOSE 8000

# Command to run the application
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
