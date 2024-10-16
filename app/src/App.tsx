import "./global.css";
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Layout from "./components/containers/Layout";
import Host from "./pages/Host";
import Resource from "./pages/Resource";

const App: React.FC = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/host" element={<Host />} />
          <Route path="/resource" element={<Resource />} />
          <Route path="/" element={<Navigate to="/host" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
