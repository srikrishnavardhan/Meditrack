import Dashboard from "./dashboard";
import Landing from "./landing";
import Login from "./login";
import Signup from "./signup";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
  

function App(){
  return (
    <Router>
      <Routes>
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
        <Route path="/" element={<Landing />} />
        <Route path="dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  )
}
export default App