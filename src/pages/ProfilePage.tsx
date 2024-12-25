import { Camera, Mail, User } from "lucide-react";
import { useEffect, useState } from "react";
import { IUser } from "../util/auth.type";
import avatarDefault from "../assets/avatar.png";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
const ProfilePage = () => {
  const [selectedImg, setSelectedImg] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [fullName, setFullName] = useState("");
  const [authUser, setAuthUser] = useState<IUser>();
  useEffect(() => {
    const storedUserData = localStorage.getItem("userData");
    if (storedUserData) {
      try {
        const parsedUserData = JSON.parse(storedUserData);

        if (parsedUserData) {
          setFullName(parsedUserData.fullName);
          setAuthUser(parsedUserData);
        }
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);
  const handleImageUpload = async (e: any) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = async () => {
      const base64Image: any = reader.result;
      setSelectedImg(base64Image);
      try {
        setIsUpdatingProfile(true);
        const res = await axiosInstance.put("auth/update_profile", {
          profilePic: base64Image,
        });
        if (res.status === 200) {
          setAuthUser(res.data);
          localStorage.setItem("userData", JSON.stringify(res.data));
        }
        toast.success("Profile updated successfully");
      } catch (error: any) {
        toast.error(error.response.data.message);
      } finally {
        setIsUpdatingProfile(false);
      }
      //   await updateProfile({ profilePic: base64Image });
      console.log("🚀 ~ reader.onload= ~ base64Image:", base64Image);
    };
  };
  const handleChangeProfile = async () => {
    // await updateProfile({ fullName: fullName });
    try {
      setIsLoading(true);
      const res = await axiosInstance.put("auth/update_profile", {
        fullName: fullName,
      });
      if (res.status === 200) {
        setAuthUser(res.data);
        localStorage.setItem("userData", JSON.stringify(res.data));
      }
      toast.success("Profile updated successfully");
    } catch (error: any) {
      toast.error(error.response.data.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="max-w-2xl mx-auto p-4 py-8">
        <div className="bg-base-300 rounded-xl p-6 space-y-8">
          <div className="text-center">
            <h1 className="text-2xl font-semibold ">Profile</h1>
            <p className="mt-2">Your profile information</p>
          </div>

          {/* avatar upload section */}

          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <img
                src={selectedImg || authUser?.profilePic || avatarDefault}
                alt="Profile"
                className="size-32 rounded-full object-cover border-4 "
              />
              <label
                htmlFor="avatar-upload"
                className={`
                absolute bottom-0 right-0 
                bg-base-content hover:scale-105
                p-2 rounded-full cursor-pointer 
                transition-all duration-200
                ${isUpdatingProfile ? "animate-pulse pointer-events-none" : ""}
              `}
              >
                <Camera className="w-5 h-5 text-base-200" />
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUpdatingProfile}
                />
              </label>
            </div>
            <p className="text-sm text-zinc-400">
              {isUpdatingProfile
                ? "Uploading..."
                : "Click the camera icon to update your photo"}
            </p>
          </div>

          <div className="space-y-6">
            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <User className="w-4 h-4" />
                Full Name
              </div>
              {/* <p className="px-4 py-2.5 bg-base-200 rounded-lg border">
                {authUser?.fullName}
              </p> */}
              <input
                type="text"
                className="px-4 py-2.5 bg-base-200 rounded-lg border w-full"
                defaultValue={fullName}
                onChange={(e) => setFullName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleChangeProfile();
                  }
                }}
              />
            </div>

            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border">
                {authUser?.email}
              </p>
            </div>
          </div>

          <div className="mt-6 bg-base-300 rounded-xl p-6">
            <h2 className="text-lg font-medium  mb-4">Account Information</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between py-2 border-b border-zinc-700">
                <span>Member Since</span>
                <span>{authUser?.createdAt?.split("T")[0]}</span>
              </div>
              {/* <div className="flex items-center justify-between py-2">
                <span>Account Status</span>
                <span className="text-green-500">Active</span>
              </div> */}
            </div>
          </div>
          <div className="flex justify-center">
            <button
              disabled={fullName === authUser?.fullName || isLoading}
              onClick={handleChangeProfile}
              className="btn btn-primary w-full"
            >
              {isLoading && <span className="loading loading-spinner"></span>}
              Update Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
