/*
Copyright 2023 PRADUMN

Chess With Friends is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

Chess With Friends is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with Chess With Friends. If not, see <https://www.gnu.org/licenses/>.
*/

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
        <Route
          path="/:id"
          element={<GameUI user={user} handleUser={handleUser} />}
        />
        <Route path="/full" element={<RoomFull />} />
      </Routes>
    </Router>
  );
};

export default App;
