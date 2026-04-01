"use client";

import { createAccount } from "@/app/apis/api";
import { AccountData } from "@/app/definations/account";
import React, { useEffect, useState } from "react";
import Loading from "../loading";
import { useAuth } from "@/app/context/UserAuth";
import { useRouter } from "next/navigation";

// Trigger a client-side download of a simple text receipt after account creation
const downloadAccountReceipt = (data: AccountData) => {
  const lines = [
    `Username: ${data.username}`,
    `Full name: ${data.name}`,
    `Password: ${data.password}`,
    `Role: ${data.role}`,
    `Created at: ${new Date().toISOString()}`,
  ];

  const blob = new Blob([lines.join("\n")], {
    type: "text/plain;charset=utf-8",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${data.username || "new"}-${data.name}-${new Date().toISOString()}.txt`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};

const roles: AccountData["role"][] = ["user", "admin"];

const CreateAccountForm: React.FC = () => {
  const router = useRouter();
  const { userAuth, isAuthLoading } = useAuth();

  const [formData, setFormData] = useState<AccountData>({
    username: "",
    name: "",
    password: "",
    role: "user",
  });
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateAccount = async () => {
    if (!formData.username || !formData.name || !formData.password) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      const response = await createAccount(formData);
      const message = `Tạo ${formData.username} vai trò ${formData.role} thành công!`;
      const createdAccount = { ...formData };

      if (response) {
        alert(message || response);
        downloadAccountReceipt(createdAccount);
        // Reset form after successful account creation
        setFormData({
          username: "",
          name: "",
          password: "",
          role: "user",
        });
      }
    } catch (error) {
      console.error("Failed to create account:", error);
      alert("Failed to create account. Please try again.");
    }
  };

  useEffect(() => {
    // Only redirect once auth finished loading; prevents false negatives on first render
    // isAuthLoading được khởi tạo là true, userAuth được khởi tạo là null,
    if (!isAuthLoading && !userAuth) {
      console.log("User is not authenticated, redirecting to login...");
      // alert("Bạn cần đăng nhập để xem báo cáo."); // to test
      router.push("/login");
    }

    if (userAuth && userAuth.role !== "admin") {
      console.log("User is authenticated but not an admin, redirecting...");
      router.push("/");
    }

  }, [router, userAuth, isAuthLoading]);

  const isNotAdmin = userAuth && userAuth.role !== "admin";

  if (isAuthLoading || !userAuth || isNotAdmin) return <Loading />;

  return (
    <main className="relative mx-auto flex min-h-screen w-full items-center justify-center bg-[#0f172a] overflow-hidden p-4">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-600/20 blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600/20 blur-[120px]" />

      <section className="relative z-10 flex w-full max-w-[30rem] flex-col space-y-10 rounded-2xl bg-white/5 p-10 shadow-2xl backdrop-blur-xl border border-white/10">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
            Create Account
          </h1>
        </div>

        <div className="flex flex-col space-y-6">
          <div className="group relative w-full border-b-2 border-gray-700 bg-transparent text-lg transition-all duration-500 focus-within:border-indigo-500">
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              className="peer w-full border-none bg-transparent py-2 outline-none placeholder:text-gray-600 focus:outline-none"
            />
            {/* Thanh bar chạy dưới chân khi focus */}
            <span className="absolute bottom-[-2px] left-0 h-[2px] w-0 bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500 group-focus-within:w-full" />
          </div>

          {/* Input Group: Full Name */}
          <div className="group relative w-full border-b-2 border-gray-700 bg-transparent text-lg transition-all duration-500 focus-within:border-indigo-500">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              className="peer w-full border-none bg-transparent py-2 outline-none placeholder:text-gray-600 focus:outline-none"
            />
            <span className="absolute bottom-[-2px] left-0 h-[2px] w-0 bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500 group-focus-within:w-full" />
          </div>

          <div className="group relative w-full border-b-2 border-gray-700 bg-transparent text-lg transition-all duration-500 focus-within:border-indigo-500">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="peer w-full border-none bg-transparent py-2 outline-none placeholder:text-gray-600 focus:outline-none"
            />
            <span className="absolute bottom-[-2px] left-0 h-[2px] w-0 bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500 group-focus-within:w-full" />
          </div>

          {/* Custom Role Select với hiệu ứng mũi tên xoay */}
          <div className="relative w-full border-b-2 border-gray-700 bg-transparent text-lg transition-all duration-500">
            <label className="block text-[10px] uppercase tracking-[0.2em] text-indigo-400/60">
              Select Role
            </label>
            <button
              type="button"
              className="w-full flex items-center justify-between bg-transparent py-2 pb-3 outline-none cursor-pointer text-gray-300 focus:text-white transition-colors duration-300"
              onClick={() => setRoleDropdownOpen((open) => !open)}
              onBlur={() => setTimeout(() => setRoleDropdownOpen(false), 100)}
              tabIndex={0}
            >
              <span>{formData.role}</span>
              <span
                className={`ml-2 transition-transform duration-300 ${roleDropdownOpen ? "rotate-180 text-indigo-400" : ""}`}
              >
                <svg
                  className="h-5 w-5 fill-none stroke-current stroke-2"
                  viewBox="0 0 24 24"
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </span>
            </button>
            {roleDropdownOpen && (
              <div className="absolute left-0 right-0 mt-1 z-20 rounded-md bg-[#1e293b] shadow-lg border border-indigo-500/30">
                {roles.map((role) => (
                  <div
                    key={role}
                    className={`px-4 py-2 cursor-pointer hover:bg-indigo-600/40 text-white ${formData.role === role ? "font-bold text-indigo-400" : ""}`}
                    onMouseDown={() => {
                      setFormData((prev) => ({ ...prev, role }));
                      setRoleDropdownOpen(false);
                    }}
                  >
                    {role}
                  </div>
                ))}
              </div>
            )}
            {/* Thanh bar chạy dưới chân */}
            <span className="absolute bottom-[-2px] left-0 h-[2px] w-0 bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500" />
          </div>

          {/* Submit Button với Glow Effect */}
          <button
            type="button"
            onClick={handleCreateAccount}
            className="relative mt-6 group overflow-hidden rounded-lg bg-indigo-600 py-3 font-bold transition-all duration-300 hover:bg-indigo-500 hover:shadow-[0_0_20px_rgba(79,70,229,0.6)] active:scale-95"
          >
            <span className="relative z-10 uppercase tracking-[0.2em]">
              Create Account
            </span>
            {/* Hiệu ứng tia sáng quét ngang khi hover */}
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-[shimmer_1.5s_infinite]" />
          </button>
        </div>
      </section>

      {/* Tailwind Keyframes (Thêm vào file CSS hoặc dùng style tag) */}
      <style jsx>{`
        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </main>
  );
};

export default CreateAccountForm;
