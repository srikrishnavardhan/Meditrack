import Dashboard from "./dashboard";
import Landing from "./landing";
import Login from "./login";
import Signup from "./signup";
import Predict from "./predict";
import Appointments from "./appointments";
import Prescriptions from "./prescriptions";
import LabReports from "./labreports";
import Profile from "./profile";
import Settings from "./settings";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
  

function App(){
  return (
    <Router>
      <Routes>
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
        <Route path="/" element={<Landing />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="predict" element={<Predict />} />
        <Route path="appointments" element={<Appointments />} />
        <Route path="prescriptions" element={<Prescriptions />} />
        <Route path="labreports" element={<LabReports />} />
        <Route path="profile" element={<Profile />} />
        <Route path="settings" element={<Settings />} />
      </Routes>
    </Router>
  )
}
export default App