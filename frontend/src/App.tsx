import { useState } from "react";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

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
      </div>
    </div>
  );
}

export default App;
