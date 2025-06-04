# Use Node.js LTS base image
FROM node:18

# Create app directory
WORKDIR /usr/src/app

COPY package*.json ./
COPY client/package.json ./client/
COPY server/package.json ./server/
COPY packages/types/package.json ./packages/types/

RUN npm install 

# Copy source files
COPY . .

# Build TypeScript if needed
# RUN npm install -g ts-node typescript
RUN npm run build --workspace=server

WORKDIR /usr/src/app/server

# Expose port
EXPOSE 3000

# Start app
CMD ["node", "dist/server.js"]
