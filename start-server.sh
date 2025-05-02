
#!/bin/bash

echo "Setting up and starting MyClinic server..."

# Navigate to server directory
cd server

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
  echo "Installing dependencies..."
  npm install
else
  echo "Dependencies already installed."
fi

# Start the server
echo "Starting server..."
npm start

