# Use Python slim image
FROM python:3.9-slim

# Set working directory
WORKDIR /app

# Copy requirements and install dependencies
COPY model/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application files
COPY . .

# Expose ports
EXPOSE 8000 8080

# Create startup script
RUN echo '#!/bin/bash\npython model/inference_api.py &\npython -m http.server 8080' > start.sh
RUN chmod +x start.sh

# Start the application
CMD ["./start.sh"]
