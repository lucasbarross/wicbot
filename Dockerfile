FROM node:8

WORKDIR /usr/src/wicbot

# Copy dependency definitions
COPY package.json ./

# Install dependecies
RUN npm install

# Get all the code needed to run the app
COPY . .

# Expose the port the app runs in
EXPOSE 3000

# Serve the app
CMD ["npm", "start"]