import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Homepage from "./pages/Homepage";
import Criteria from "./pages/Criteria";
import Alternative from "./pages/Alternative";
import Calculate from "./pages/Calculate";
import Results from "./pages/Result";
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/homepage"
          element={
            <ProtectedRoute authRole={["Admin", "Juri"]}>
              <Homepage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/criteria"
          element={
            <ProtectedRoute authRole={["Admin", "Juri"]}>
              <Criteria />
            </ProtectedRoute>
          }
        />
        <Route
          path="/alternative"
          element={
            <ProtectedRoute authRole={["Admin", "Juri"]}>
              <Alternative />
            </ProtectedRoute>
          }
        />
        <Route
          path="/calculate"
          element={
            <ProtectedRoute authRole={["Admin", "Juri"]}>
              <Calculate />
            </ProtectedRoute>
          }
        />
        <Route
          path="/result"
          element={
            <ProtectedRoute authRole={["Admin", "Juri"]}>
              <Results />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;