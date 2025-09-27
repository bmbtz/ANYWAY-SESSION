# Use official Node.js image (LTS)
FROM node:20-buster

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json first (layer caching)
COPY package*.json ./

# Install only production dependencies
RUN npm install --production

# Copy the rest of the application files
COPY . .

# Expose app port
EXPOSE 8000

# Start the bot
CMD ["npm", "start"]
