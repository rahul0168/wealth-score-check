#!/bin/bash

echo "Starting Wealth Score Application..."
echo

echo "Starting Backend Server..."
cd server && npm run dev &

echo "Waiting for backend to start..."
sleep 3

echo "Starting Frontend Server..."
cd .. && npm run dev &

echo
echo "Both servers are starting..."
echo "Backend: http://localhost:3001"
echo "Frontend: http://localhost:5173"
echo
echo "Press Ctrl+C to stop both servers"

# Wait for user input
wait 