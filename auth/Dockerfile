FROM node:alpine

# Install bash (optional but useful)
RUN apk add --no-cache bash

WORKDIR /app

# Copy package.json and package-lock.json first (to cache installs)
COPY package.json ./
COPY package-lock.json ./

# Install ALL dependencies (including devDependencies)
RUN npm install

# Copy rest of the app
COPY . .

# Make sure ts-node-dev is executable
RUN chmod +x ./node_modules/.bin/ts-node-dev

# Expose the port your app uses
EXPOSE 3000

# Start the app using ts-node-dev
CMD ["npm", "start"]
