import React, { useState, useEffect } from "react";
import Axios from "axios";

export default function MIMUST() {
  const [key, setKey] = useState("");
  const [settings, setsettings] = useState(false);
  const [newMIM, setnewMIM] = useState("");
  const [newANC, setnewANC] = useState("");
  const [final, setfinal] = useState(false);
  const [gettime, sgettime] = useState(false);

  Axios.defaults.withCredentials = true;

  useEffect(async () => {
    const res = await Axios.get(
      "https://aqueous-fjord-71548.herokuapp.com/gettime"
    );
    sgettime(res.data.message);
  }, []);

  async function keyg() {
    const keygr = await Axios.get(
      "https://aqueous-fjord-71548.herokuapp.com/getkey"
    );
    const res = await Axios.get(
      "https://aqueous-fjord-71548.herokuapp.com/gettime"
    );
    sgettime(res.data.message);
  }

  async function load() {
    const loadr = await Axios.get(
      "https://aqueous-fjord-71548.herokuapp.com/getsettings+" + key
    );
    setsettings(loadr.data.message);
  }

  async function save(kind) {
    if (kind === "ANC") {
      const saver = await Axios.put(
        "https://aqueous-fjord-71548.herokuapp.com/configanc/" + newANC
      );
      setfinal(saver.data);
    }
    if (kind === "MIM") {
      const saver = await Axios.put(
        "https://aqueous-fjord-71548.herokuapp.com/configmim" + newMIM
      );
      setfinal(saver.data);
    }
  }

  return (
    <div>
      <h1>MIM-UST and Anchor Protocol</h1>
      <h2>
        Get Notifications for Borowable MIM against UST on ETH and Get
        Notifications for Changes in Deposited UST on Anchor Ptrotocol's "Earn"
      </h2>
      <br />
      {gettime && (
        <p style={{ fontSize: "8pt" }}>
          You can only get 1 key in 5 minute, last time you got a key was:
        </p>
      )}
      {gettime && <p>{gettime}</p>}
      <button onClick={async () => keyg()}>Get Key</button>
      <br />
      <br />
      <label>Enter your key: </label> <br />
      <input onChange={(e) => setKey(e.target.value)}></input>{" "}
      <button onClick={async () => load()}>Load settings</button>
      <br />
      <br />
      {settings && (
        <>
          {" "}
          <label>MIM now is: </label>
          <label>{settings.MIM}</label> <br />
          <label>Enter your newMIM: </label> <br />
          <input onChange={(e) => setnewMIM(e.target.value)}></input>
          <button onClick={async () => save("MIM")}>Update to new MIM</button>
          <br></br>
          <br></br>
          <label>ANC now is: </label>
          <label>{settings.ANC}</label> <br />
          <label>Enter your newANC: </label> <br />
          <input onChange={(e) => setnewANC(e.target.value)}></input>
          <button onClick={async () => save("ANC")}>Update to new ANC</button>
        </>
      )}
      <br />
      <br />
      <br />
      {final && (
        <>
          {" "}
          <label>So now it is: </label> <br />
          <div>{final.message}</div>
        </>
      )}
    </div>
  );
}
