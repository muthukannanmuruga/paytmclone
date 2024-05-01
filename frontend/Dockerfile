# # Use the official Node.js 16 Alpine image as the base image
# FROM node:16-alpine

# # Set the working directory in the container
# WORKDIR /app

# # Copy the package.json and package-lock.json files to the working directory
# COPY package*.json ./

# # Install dependencies
# RUN npm install

# # Copy all files from the current directory to the working directory in the container
# COPY . .

# EXPOSE 8080
# # Command to run the application when the container starts
# CMD ["npm", "run", "dev"]


# Use the official Node.js 16 Alpine image as the base image
FROM node:16-alpine

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json files to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all files from the current directory to the working directory in the container
COPY . .

# Build the React application
RUN npm run build

# Stage 2: Use Nginx to serve the build files
FROM nginx:alpine

# Copy the built files from the previous stage to Nginx's default public directory
COPY --from=0 /app/dist /usr/share/nginx/html

# Expose port 80 to the outside world
EXPOSE 80

# Command to run Nginx when the container starts
CMD ["nginx", "-g", "daemon off;"]
