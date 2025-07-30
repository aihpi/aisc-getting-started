FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Environment variables
ENV REACT_APP_BACKEND_URL=http://localhost:8000

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]