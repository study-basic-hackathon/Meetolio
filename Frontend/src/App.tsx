import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Header from "./components/Header";
import Login from "./pages/Login";
import PortfolioEdit from "./pages/PortfolioEdit";
import BusinessCardEdit from "./pages/BusinessCardEdit";
import BusinessCardDesign from "./pages/BusinessCardDesign";
import Settings from "./pages/AccountSettings";
import ChangeEmail from "./pages/ChangeEmail";
import ChangePassword from "./pages/ChangePassword";
import DeleteAccount from "./pages/DeleteAccount";
import "./App.css";
import Portfolio from "./pages/Portfolio";
import AccountRegister from "./pages/AccountRegister";
import QRCodePage from "./pages/QRCodePage";

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
              <Route path="/register" element={<AccountRegister />} />
              <Route path="/portfolio" element={<Portfolio />} />
              <Route path="/portfolio/:userId" element={<Portfolio />} />
              <Route
                path="/portfolio/:userId/edit"
                element={<PortfolioEdit />}
              />
              <Route
                path="/business-card/edit"
                element={<BusinessCardEdit />}
              />
              <Route
                path="/business-card/design"
                element={<BusinessCardDesign />}
              />
              <Route path="/settings" element={<Settings />} />
              <Route path="settings/qrcode" element={<QRCodePage />} />
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
