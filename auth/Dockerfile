FROM node:alpine

# Install bash (optional but useful)
RUN apk add --no-cache bash

WORKDIR /app

# Copy package.json and package-lock.json first (to cache installs)
COPY package.json ./
COPY package-lock.json ./

# Install dependencies (including devDependencies)
RUN npm install --legacy-peer-deps

# Install ts-node-dev globally to make sure it's available
RUN npm install -g ts-node-dev

# Copy the rest of the app
COPY . .

# Expose the port the app runs on
EXPOSE 3000

# Start the app using ts-node-dev
CMD ["npm", "start"]
