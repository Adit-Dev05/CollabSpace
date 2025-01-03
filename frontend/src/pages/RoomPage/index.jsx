import { useState, useRef, useEffect } from "react";
import "./index.css";
import WhiteBoard from "../../components/Whiteboard";
import Chat from "../../components/ChatBar";
import { toast } from "react-toastify";

const RoomPage = ({ user, socket, users, setUsers, roomId }) => {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);

  const [tool, setTool] = useState("pencil");
  const [color, setColor] = useState("black");
  const [elements, setElements] = useState([]);
  const [history, setHistory] = useState([]);
  const [openedUserTab, setOpenedUserTab] = useState(false);
  const [openedChatTab, setOpenedChatTab] = useState(false);

  const handleClearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setElements([]);
  };

  const undo = () => {
    if (elements.length > 0) {
      setHistory([...history, elements.pop()]);
      setElements([...elements]);
    }
  };

  const redo = () => {
    if (history.length > 0) {
      setElements([...elements, history.pop()]);
      setHistory([...history]);
    }
  };

  useEffect(() => {
    socket.on("userJoinedMessageBroadcasted", (data) => {
      setUsers(data.users);
      toast.info(`${data.name} joined the room`);
    });

    socket.on("allUsers", setUsers);
    socket.on("userLeftMessageBroadcasted", (data) => {
      toast.info(`${data.name} left the room`);
    });

    return () => {
      socket.off("userJoinedMessageBroadcasted");
      socket.off("allUsers");
      socket.off("userLeftMessageBroadcasted");
    };
  }, [socket, setUsers]);

  useEffect(() => {
    if (user) {
      socket.emit("joinRoom", { roomId, user });
      return () => {
        socket.emit("leaveRoom", { roomId, userId: user.userId });
      };
    }
  }, [user, roomId, socket]);

  return (
    <div>
      <header>
        <h1>
          White Board Sharing App{" "}
          <span className="users-count">[Users Online: {users.length}]</span>
        </h1>
      </header>

      <div className="toolbar">
        <div className="form-group">
          <label htmlFor="tool-select">Tool:</label>
          <select
            id="tool-select"
            value={tool}
            onChange={(e) => setTool(e.target.value)}
          >
            <option value="pencil">Pencil</option>
            <option value="line">Line</option>
            <option value="rect">Rectangle</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="color-picker">Color:</label>
          <input
            type="color"
            id="color-picker"
            value={color}
            onChange={(e) => setColor(e.target.value)}
          />
        </div>

        <button className="btn btn-primary" onClick={undo}>
          Undo
        </button>
        <button className="btn btn-secondary" onClick={redo}>
          Redo
        </button>
        <button className="btn btn-danger" onClick={handleClearCanvas}>
          Clear
        </button>
      </div>

      <div className="sidebar-btns">
  <button
    className="btn btn-dark"
    onClick={() => setOpenedUserTab(true)}
  >
    Users
  </button>
  <button
    className="btn btn-primary"
    onClick={() => setOpenedChatTab(true)}
  >
    Chats
  </button>
</div>


      <div className="canvas-box">
        <WhiteBoard
          canvasRef={canvasRef}
          ctxRef={ctxRef}
          elements={elements}
          setElements={setElements}
          color={color}
          tool={tool}
          user={user}
          socket={socket}
        />
      </div>

      {openedUserTab && (
        <div className="user-tab">
          <button className="close-btn" onClick={() => setOpenedUserTab(false)}>
            Close
          </button>
          {users.map((usr) => (
            <p key={usr.userId}>
              {usr.name} {user.userId === usr.userId && "(You)"}
            </p>
          ))}
        </div>
      )}

      {openedChatTab && <Chat setOpenedChatTab={setOpenedChatTab} socket={socket} />}
    </div>
  );
};

export default RoomPage;
