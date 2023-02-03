import React from "react";
import ReactDOM from "react-dom/client";
import "./css/index.css";
import GA4React from "ga-4-react";

import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

const ga4react = new GA4React("G-Z33FNTEPP9");
(async () => {
  await ga4react.initialize();

  const root = ReactDOM.createRoot(document.getElementById("root"));
  root.render(<App />);
})();

