import React, { useState } from "react";
import Axios from "axios";

export default function MIMUST() {
  const [key, setKey] = useState("");

  async function load() {
    Axios.get("");
  }

  return (
    <div>
      <h1>MIM-UST</h1>
      <h2>Get Notifications for Borowable MIM against UST on ETH</h2>
      <label>Enter your key: </label>
      <input onChange={(e) => setKey(e.target.value)}></input>{" "}
      <button onClick={async () => load()}>Load settings</button>
      <div>Key entered is {key}</div>
    </div>
  );
}
