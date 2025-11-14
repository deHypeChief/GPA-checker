# Use Bun official image
FROM oven/bun:latest

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json bun.lock* ./

# Install dependencies
RUN bun install --frozen-lockfile

# Copy application files
COPY . .

# Expose port
EXPOSE 5000

# Set environment variable for port
ENV PORT=5000

# Start the server
CMD ["bun", "server.js"]

