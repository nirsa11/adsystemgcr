FROM node:18

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy the rest of the app source code to the working directory
COPY . .

# Build the TypeScript app
RUN npm run build

EXPOSE 4000


# Specify the command to run your app
CMD [ "npm", "start" ]