FROM node:18-alpine

WORKDIR /app

COPY package.json ./
RUN npm install

COPY . .

ENV HOST=0.0.0.0
ENV REACT_APP_API_URL=http://localhost:8000/api
CMD ["npm", "start"]