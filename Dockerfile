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

COPY wait-for-it.sh /usr/src/app/wait-for-it.sh
RUN chmod +x /usr/src/app/wait-for-it.sh

# Expose port
EXPOSE 3000

# Start app
CMD ["./wait-for-it.sh", "db:5432", "--", "sh", "-c", "node server/dist/db/init.js && node server/dist/server.js"]