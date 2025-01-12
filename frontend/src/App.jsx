import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import io from "socket.io-client";

import "./App.css";
import Forms from "./components/Forms";
import RoomPage from "./pages/RoomPage";

const connectionOptions = {
  "force new connection": true,
  reconnectionAttempts: "Infinity",
  timeout: 10000,
  transports: ["websocket"],
};

// Use relative path to connect to the backend (works for same domain)
const socket = io("/", connectionOptions);

const App = () => {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    socket.on("userIsJoined", (data) => {
      if (data.success) {
        setUsers(data.users);
      } else {
        console.error("Error joining user");
      }
    });

    socket.on("allUsers", (data) => {
      setUsers(data);
    });

    socket.on("userLeftMessageBroadcasted", (data) => {
      toast.info(`${data.name} left the room`);
    });

    // Cleanup socket listeners on unmount
    return () => {
      socket.off("userIsJoined");
      socket.off("allUsers");
      socket.off("userLeftMessageBroadcasted");
    };
  }, []);

  const uuid = () => {
    let S4 = () => (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    return `${S4()}${S4()}-${S4()}-${S4()}-${S4()}-${S4()}${S4()}${S4()}`;
  };

  return (
    <div className="container">
      <ToastContainer />
      <Routes>
        <Route
          path="/"
          element={
            <Forms
              uuid={uuid}
              socket={socket}
              setUser={setUser}
            />
          }
        />
        <Route
          path="/:roomId"
          element={
            <RoomPage
              socket={socket}
              user={user}
              users={users}
              setUsers={setUsers}
              roomId={window.location.pathname.split("/")[1]}
            />
          }
        />
      </Routes>
    </div>
  );
};

export default App;
