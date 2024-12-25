import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";
import { IDataLogin } from "../util/auth.type";
import { axiosInstance } from "../lib/axios";
import LogoIcon from "../assets/logo/logo.jpg";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<IDataLogin>({
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const [isLoggingIng, setIsLoggingIng] = useState(false);
  const validateForm = () => {
    if (!formData.email.trim()) {
      return toast.error("Email is required");
    }

    if (!formData.password.trim()) {
      return toast.error("Password is required");
    }

    if (formData.password.length < 6) {
      return toast.error("Password must be at least 6 characters");
    }

    if (!/\S+@\S+\.\S+/.test(formData.email))
      return toast.error("Invalid email format");
    return true;
  };
  useEffect(() => {
    const storedUserData = localStorage.getItem("userData");
    if (storedUserData) {
      try {
        const parsedUserData = JSON.parse(storedUserData);

        if (parsedUserData) {
          navigate("/");
        }
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const isValidateForm = validateForm();
    if (isValidateForm === true) {
      try {
        setIsLoggingIng(true);
        const res = await axiosInstance.post("auth/login", formData);
        if (res.status === 201) {
          toast.success("Login successful");

          localStorage.setItem("userData", JSON.stringify(res.data));
          navigate("/");
        }
      } catch (error) {
        console.log("🚀 ~ handleSubmit ~ error:", error);
      } finally {
        setIsLoggingIng(false);
      }

      console.log(formData);
    }
  };
  return (
    <div className="flex h-screen flex-col justify-center items-center p-6 sm:p-12">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center mb-8">
          <div className="flex flex-col items-center gap-2 group">
            <div className="size-16 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              {/* <MessageSquare className="size-6 text-primary" /> */}
              <img src={LogoIcon} alt="Ha Hoang" className="rounded-2xl" />
            </div>
            <h1 className="text-2xl font-bold mt-2"> Create Account</h1>
            <p className="text-base-content/60">
              GET started with your free account
            </p>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Email</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="size-5 text-base-content/40" />
              </div>
              <input
                type="email"
                className={`input input-bordered w-full pl-10`}
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Password</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="size-5 text-base-content/40" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                className={`input input-bordered w-full pl-10`}
                placeholder="Your password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="size-5 text-base-content/40" />
                ) : (
                  <Eye className="size-5 text-base-content/40" />
                )}
              </button>
            </div>
          </div>
          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={isLoggingIng}
          >
            {isLoggingIng ? (
              <>
                <Loader2 className="size-5 animate-spin" />
              </>
            ) : (
              "Sign in"
            )}
          </button>
        </form>
        <div className="text-center">
          <p className="text-base-content/60">Already have an account?</p>
          <Link to="/signup" className="link link-primary">
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
