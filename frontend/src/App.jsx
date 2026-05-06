import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home  from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import UploadDocument  from "./pages/UploadDocument";
import Documents from "./pages/Documents";
import ManageProfile from "./pages/ManageProfile";
import VerifyDocument from "./pages/VerifyDocument";
import SearchFactories from "./pages/SearchFactories";
import FactoryProfile from "./pages/FactoryProfile";
import ReportIssue from "./pages/ReportIssue";
import SavedSuppliers from "./pages/SavedSuppliers";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
         <Route path="/"              element={<Home />} />
        <Route path="/login"                element={<Login />} />
        <Route path="/signup"          element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/dashboard"       element={<Dashboard />} />
        <Route path="/upload"          element={<UploadDocument />} />
        <Route path='/documents'       element={<Documents />} />
        <Route path="/profile"         element={<ManageProfile />} />
        <Route path="/verify"          element={<VerifyDocument />} />
        <Route path="/search"          element={<SearchFactories />} />
        <Route path="/factory-profile" element={<FactoryProfile />} />
        <Route path="/report"    element={<ReportIssue />} />
        <Route path="/saved" element={<SavedSuppliers />} />
      </Routes>
    </BrowserRouter>
  );
}
