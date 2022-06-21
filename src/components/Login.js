import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { retrieveDataFromToken } from "../tokenDetails/retrieveDataFromtoken";
import "../styleSheets/login.css";

const Login = () => {
  const [id, setId] = useState(0);
  const [password, setPassword] = useState("");
  const [errormsg, setErrormsg] = useState("");
  const [loginStatus, setLoginStatus] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (loginStatus) navigate("/portfolio");
  }, [loginStatus]);

  const handleLogin = (e) => {
    console.log("hello " + id + password);
    e.preventDefault();
    fetch("https://localhost:44366/api/Auth", {
      method: "post",
      body: JSON.stringify({
        portFolioID: id,
        password,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.status === 401) {
          setErrormsg("The PortFolioId or Password is incorrect!");
          setId("");
          setPassword("");
        } else if (res.status === 200) {
          return res.json();
        }
      })
      .then((data) => {
        if (data) {
          console.log(data.tokenString);
          setErrormsg("");
          setId("");
          setPassword("");
          // localStorage.setItem("token", data.tokenString);
          retrieveDataFromToken(data.tokenString);
          setLoginStatus(true);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div style={{ paddingLeft: "300px" }}>
      <br />
      <form onSubmit={handleLogin}>
        <label>Enter the PortFolioId</label>
        <br />
        <input
          type="number"
          value={id}
          onChange={(e) =>
            e.target.value.length > 0
              ? setId(Number.parseInt(e.target.value))
              : setId("")
          }
        />
        <br />
        <label>Enter password</label>
        <br />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <br />
        <button className="colorbutton" type="submit">
          Login
        </button>
      </form>
      {errormsg.length > 0 ? <h3>{errormsg}</h3> : ""}
    </div>
  );
};

export default Login;
