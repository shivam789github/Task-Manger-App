import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import './tailwind.css'
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { GoogleOAuthProvider } from "@react-oauth/google"

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <GoogleOAuthProvider clientId='69045014515-q3hbem4pn0o34j9hlo1up9ac6tp83hsa.apps.googleusercontent.com'>
    
      <App />
  
  </GoogleOAuthProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
