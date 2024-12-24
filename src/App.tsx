import { BrowserRouter, Route, Routes } from "react-router-dom"; // Thêm import BrowserRouter

import { Toaster } from "react-hot-toast";
import DefaultLayout from "./layout/DefaultLayout";
import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";

const App = () => {
  return (
    <div data-theme={"dark"}>
      <BrowserRouter>
        <DefaultLayout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/login" element={<LoginPage />} />
            {/* Các Route khác ở đây */}
          </Routes>
        </DefaultLayout>
        <Toaster />
      </BrowserRouter>
    </div>
  );
};

export default App;
