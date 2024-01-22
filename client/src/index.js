import React from "react";
import ReactDOM from "react-dom/client";
import Test from "./component/Test";
import App from "./App";
import "./index.css";
import reportWebVitals from "./reportWebVitals";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
      <div className="dark:bg-slate-400  min-h-screen">
      {/* <Test /> */}
      <App />
    </div>
  </React.StrictMode>
);

reportWebVitals();
