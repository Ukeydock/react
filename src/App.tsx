import React from "react";
import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import AuthMain from "./pages/services/auth/Auth.page";
import "./App.css";
import AuthCallback from "./components/auth/AuthCallback";
import ErrorBoundary from "./components/error/CatchError";
import Startpage from "./pages/services/start/Start.page";
import Mainpage from "./pages/services/main/Mainpage";
import SearchPage from "./pages/services/main/SearchPage";
import UserPage from "./pages/services/user/Userpage";

const Layout = () => {
  return (
    <div
      style={{
        margin: " auto",
        maxWidth: "1600px",
        backgroundColor: "black",
        marginTop: "80px",
      }}
    >
      <Nav />
      <Outlet />
      <Footer />
    </div>
  );
};

function App() {
  return (
    <div>
      <ErrorBoundary>
        <Routes>
          <Route path="/">
            <Route path="auth" element={<AuthMain />} />
            <Route path="auth/google/callback" element={<AuthCallback />} />
            <Route path="start" element={<Startpage />} />
            <Route path="api" element={<Layout />}>
              <Route path="main" element={<Mainpage />} />
            </Route>
            <Route path="api" element={<Layout />}>
              <Route path="search" element={<SearchPage />} />
            </Route>
            <Route path="api" element={<Layout />}>
              <Route path="user" element={<UserPage />} />
            </Route>

            <Route path="/" element={<Navigate to="/auth" replace />} />
            {/* <Route path="/admin" element={<ServiceRouter />} /> */}
          </Route>
        </Routes>
      </ErrorBoundary>
    </div>
  );
}

export default App;
