import React, { useState } from "react";
import Axios from "axios";

export default function Anchorst() {
  const [key, setKey] = useState("");

  async function load() {
    Axios.get("");
  }

  return (
    <div>
      <h1>Anchor Protocol</h1>
      <h2>
        Get Notifications for Changes in Deposited UST on Anchor Ptrotocol's
        "Earn"
      </h2>
      <label>Enter your key: </label>
      <input onChange={(e) => setKey(e.target.value)}></input>{" "}
      <button onClick={async () => load()}>Load settings</button>
      <div>Key entered is {key}</div>
    </div>
  );
}
