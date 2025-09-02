import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Header from "./components/Header";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MyPage from "./pages/MyPage";
import ProfileEdit from "./pages/ProfileEdit";
import BusinessCardEdit from "./pages/BusinessCardEdit";
import BusinessCardDesign from "./pages/BusinessCardDesign";
import Settings from "./pages/Settings";
import ChangeEmail from "./pages/ChangeEmail";
import ChangePassword from "./pages/ChangePassword";
import DeleteAccount from "./pages/DeleteAccount";
import "./App.css";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/mypage" element={<MyPage />} />
              <Route path="/profile/:userId" element={<MyPage />} />
              <Route path="/profile/edit" element={<ProfileEdit />} />
              <Route
                path="/business-card/edit"
                element={<BusinessCardEdit />}
              />
              <Route
                path="/business-card/design"
                element={<BusinessCardDesign />}
              />
              <Route path="/settings" element={<Settings />} />
              <Route path="/settings/email" element={<ChangeEmail />} />
              <Route path="/settings/password" element={<ChangePassword />} />
              <Route path="/settings/delete" element={<DeleteAccount />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
