import { BrowserRouter, Route, Routes } from "react-router-dom"; // Thêm import BrowserRouter

import { Toaster } from "react-hot-toast";
import DefaultLayout from "./layout/DefaultLayout";
import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import CheckInPage from "./pages/CheckInPage";
import { LoadingProvider } from "./components/LoadingProvider";
import ProfilePage from "./pages/ProfilePage";

const App = () => {
  return (
    <LoadingProvider>
      <div data-theme={"dark"}>
        <BrowserRouter>
          <DefaultLayout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/check-in" element={<CheckInPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/signup" element={<SignUpPage />} />
              <Route path="/login" element={<LoginPage />} />
              {/* Các Route khác ở đây */}
            </Routes>
          </DefaultLayout>
          <Toaster />
        </BrowserRouter>
      </div>
    </LoadingProvider>
  );
};

export default App;
