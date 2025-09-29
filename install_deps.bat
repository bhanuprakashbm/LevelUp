@echo off
powershell -Command "Start-Process cmd -Verb RunAs -ArgumentList '/c cd /d %~dp0 && npm install react-router-dom recharts lucide-react react-hot-toast'"
