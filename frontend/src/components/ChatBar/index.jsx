import { useEffect, useState } from "react";

const Chat = ({ setOpenedChatTab, socket }) => {
  const [chat, setChat] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Only listen for message responses from the server
    const messageHandler = (data) => {
      setChat((prevChats) => [...prevChats, data]);
    };

    socket.on("messageResponse", messageHandler);

    // Cleanup the event listener on component unmount
    return () => {
      socket.off("messageResponse", messageHandler);
    };
  }, [socket]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() !== "") {
      // Send message to the server
      socket.emit("message", { message });
      // Add the message locally for the sender
      setChat((prevChats) => [...prevChats, { message, name: "You" }]);
      setMessage("");
    }
  };

  return (
    <div
      className="position-fixed top-0 right-0 h-100 bg-light shadow-lg"
      style={{
        width: "350px",
        maxWidth: "100%",
        borderRadius: "10px 0 0 10px",
        overflow: "hidden",
        maxHeight: "100vh", // Ensures the chat box does not exceed the viewport height
      }}
    >
      <button
        type="button"
        onClick={() => setOpenedChatTab(false)}
        className="btn btn-secondary w-100 py-2"
        style={{
          fontSize: "16px",
          textTransform: "uppercase",
          fontWeight: "500",
          borderRadius: "0",
        }}
      >
        Close
      </button>
      <div
        className="w-100 p-3"
        style={{
          height: "calc(100vh - 160px)", // Subtract the height of the header and footer
          overflowY: "auto",
          backgroundColor: "#f9f9f9",
          borderBottom: "1px solid #ddd",
        }}
      >
        {chat.map((msg, index) => (
          <p
            key={index * 999}
            className="my-2 px-3 py-2 rounded-3"
            style={{
              backgroundColor: msg.name === "You" ? "#d1f7c4" : "#e1e1e1",
              maxWidth: "80%",
              marginLeft: msg.name === "You" ? "auto" : "0",
              textAlign: msg.name === "You" ? "right" : "left",
              wordWrap: "break-word",
            }}
          >
            <strong>{msg.name}:</strong> {msg.message}
          </p>
        ))}
      </div>
      <form
        onSubmit={handleSubmit}
        className="d-flex p-3"
        style={{
          borderTop: "1px solid #ddd",
          backgroundColor: "#fff",
        }}
      >
        <input
          type="text"
          placeholder="Enter message"
          className="form-control rounded-0"
          style={{
            fontSize: "16px",
            borderRadius: "20px",
            padding: "10px 15px",
            marginRight: "10px",
            flexGrow: "1", // Ensures the input takes remaining space
          }}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          type="submit"
          className="btn btn-primary rounded-0"
          style={{
            fontSize: "16px",
            padding: "10px 20px",
            fontWeight: "600",
            borderRadius: "20px",
          }}
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default Chat;
