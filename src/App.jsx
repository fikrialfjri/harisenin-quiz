import React, { lazy, Suspense, useEffect } from "react";
import {
  Route,
  Router,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";

const QuizPage = lazy(() => import("./pages/Quiz"));
const LeaderboardPage = lazy(() => import("./pages/Leaderboard"));

const App = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { pathname } = location;

  useEffect(() => {
    if (pathname === "/") navigate("/quiz");
  }, [pathname]);

  return (
    <div style={{ minHeight: "100vh", width: "100%" }}>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/quiz" element={<QuizPage />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
        </Routes>
      </Suspense>
    </div>
  );
};

export default App;
