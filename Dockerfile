# Use Node.js LTS base image
FROM node:18

# Create app directory
WORKDIR /usr/src

COPY package*.json ./

RUN npm install 

# Copy source files
COPY . .

# Build TypeScript if needed
# RUN npm install -g ts-node typescript
RUN npm run build

# Expose port
EXPOSE 3000

# Start app
CMD ["node", "dist/server.js"]
