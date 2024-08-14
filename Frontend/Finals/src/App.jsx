import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from "./Components/navbar";
import Home from "./Components/Home";
import About from "./Components/about";
import Login from './Components/login'; 
import Signup from './Components/signup'; 

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Parent route for login and signup */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Nested route for Navbar and its children */}
        <Route path="/" element={<Navbar />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
