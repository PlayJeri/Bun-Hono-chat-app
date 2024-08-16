import { useState } from "react";
import { useAuth } from "./contexts/useAuth";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);
  const authContext = useAuth();

  const openWS = () => {
    const ws = new WebSocket("ws://localhost:3000/ws");

    ws.onopen = () => {
      const message = {
        type: "message",
        payload: {
          content: "iso molo",
        },
      };

      console.log("Ws connection open");
      ws.send(JSON.stringify(message));
    };

    ws.onmessage = (event) => {
      console.log(event.data);
    };
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <div className="bg-green-500 flex flex-col items-center justify-center px-16 py-8 rounded-2xl">
        <h1 className="text-4xl text-red-400 text-center">Hello</h1>
        <button
          className="bg-blue-600 text-red-200 rounded-xl px-4"
          onClick={() => setCount(count + 1)}
        >
          {count}
        </button>
        <button onClick={() => authContext.login("IsoMies", "isomolc")}>
          Login
        </button>
        <p>{authContext.user ? authContext.user.username : "not logged in"}</p>
        <button
          onClick={openWS}
          className="bg-blue-700 text-red-300 rounded-xl px-4"
        >
          Open WS
        </button>
      </div>
    </div>
  );
}

export default App;
