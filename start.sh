#!/bin/bash

echo "Starting PC-CONN File Sharing App..."
echo

echo "Installing dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo "Failed to install dependencies"
    exit 1
fi

echo
echo "Installing server dependencies..."
cd server
npm install
if [ $? -ne 0 ]; then
    echo "Failed to install server dependencies"
    exit 1
fi
cd ..

echo
echo "Starting server in background..."
cd server
npm start &
SERVER_PID=$!
cd ..

echo
echo "Waiting for server to start..."
sleep 3

echo
echo "Starting React app..."
npm start &
APP_PID=$!

echo
echo "PC-CONN is starting up!"
echo "- Server will run on http://localhost:3001"
echo "- React app will run on http://localhost:3000"
echo
echo "Press Ctrl+C to stop both servers"

# Wait for user to stop
wait
