import React from "react";
import { ClipLoader } from "react-spinners";

function FullScreenLoader() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <ClipLoader color="#007bff" size={60} />
    </div>
  );
}

export default FullScreenLoader;
