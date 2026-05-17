import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Login';
import Dashboard from './Dashboard';
import AiCoach from './AiCoach';
import Profile from './Profile';
import Nutrition from './Nutrition';
import Ranking from './Ranking';
import InjuryPredictor from "./InjuryPredictor";         
import Opportunities from './Opportunities';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/aicoach" element={<AiCoach />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/nutrition" element={<Nutrition/>} />
        <Route path="/ranking" element={<Ranking />} />
        <Route path="/injury" element={<InjuryPredictor />} />
        <Route path="/opportunities" element={<Opportunities />} />
      </Routes>
    </Router>
  );
}
export default App;// Preeti test change
// Preeti test change
