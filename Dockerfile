# Use an official Node.js base image
FROM node:14

# Set the working directory in the Docker container
WORKDIR /usr/src/app

# Copy package.json and yarn.lock files (or package-lock.json if you use npm)
COPY package.json yarn.lock ./

# Install project dependencies
RUN npm install

# Copy the rest of your project files into the Docker container
COPY . .

# Command to run when starting the container
CMD ["npm", "run", "start"]
