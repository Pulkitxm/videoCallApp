import { Navigate, Route, Routes } from "react-router-dom";

import "./main.css";
import Home from "./pages/Home";
import Room from "./pages/Room";
import { useState } from "react";

const App = () => {
  const [redirected, setredirected] = useState(false);
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home setredirected={setredirected} />} />
        <Route path="/:id" element={<Room redirected={redirected} />} />
        <Route path="*" element={<Navigate to={"/"}/>} />
      </Routes>
    </div>
  );
};

export default App;