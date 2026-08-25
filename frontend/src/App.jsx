import { Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage.jsx';
import Workspace from './components/Workspace.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/workspace" element={<Workspace />} />
    </Routes>
  );
}

