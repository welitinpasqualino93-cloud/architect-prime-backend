# Base image
FROM python:3.11-slim

# Set the working directory
WORKDIR /app

# Copy requirements file and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code
COPY . .

# Expose the port (e.g., Flask default)
EXPOSE 8080

# Run the application (replace main.py with your entry point if necessary)
CMD ["python", "main.py"]
