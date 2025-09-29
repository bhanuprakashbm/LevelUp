import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from "./components/Layout";
import Dashboard from "./components/Dashboard";
import Benchmarks from "./components/Benchmarks";
import Clubs from "./components/Clubs";
import Notifications from "./components/Notifications";
import Profile from "./components/Profile";
import Statistics from "./components/Statistics";
import VideoUpload from "./components/VideoUpload";

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/upload" element={<VideoUpload />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/benchmarks" element={<Benchmarks />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/statistics" element={<Statistics />} />
          <Route path="/clubs" element={<Clubs />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;