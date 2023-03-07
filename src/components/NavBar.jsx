import React, { useContext } from "react";
import { GlobalContex } from "../globalContext";

const NavBar = () => {
  const { totalTime } = useContext(GlobalContex);
  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "30px",
          alignItems: "center",
        }}
      >
        <div style={{ fontSize: "40px" }}>
          Finding <b>Falcone</b>{" "}
          <span style={{ fontSize: "20px" }}>
            {totalTime ? "in " + totalTime + " Days" : ""}
          </span>
        </div>
        <div style={{ display: "flex" }}>
          <div
            style={{ cursor: "pointer" }}
            onClick={(e) => window.location.reload()}
          >
            Reset
          </div>
          <div style={{ padding: "0px 10px" }}>|</div>
          <div
            style={{ cursor: "pointer" }}
            onClick={(e) => window.location.reload()}
          >
            Home
          </div>
        </div>
      </div>
    </>
  );
};

export default NavBar;
