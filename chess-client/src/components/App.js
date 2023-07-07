import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import InitiatorScreen from "./InitiatorScreen";
import GameUI from "./GameUI";
import RoomFull from "./RoomFull";

const App = () => {
  const [user, setUser] = useState("guest");
  // function to ser user type
  function handleUser(userType) {
    setUser(userType);
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<InitiatorScreen handleUser={handleUser} />} />
        <Route path="/:id" element={<GameUI user={user} />} />
        <Route path="/full" element={<RoomFull />} />
      </Routes>
    </Router>
  );
};

export default App;
