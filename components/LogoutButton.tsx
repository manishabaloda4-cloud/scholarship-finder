"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();
  const [user, setUser] = useState<{name: string; email: string} | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem("sf_user");
    if (raw) setUser(JSON.parse(raw));
  }, []);

  if (!user) return null;

  function logout() {
    localStorage.removeItem("sf_user");
    localStorage.removeItem("sf_profile");
    setUser(null);
    router.push("/login");
  }

  return (
    <div className="flex items-center gap-2 ml-2">
      <span className="text-xs text-gray-400 hidden sm:block">{user.name}</span>
      <button onClick={logout}
        className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-500 hover:border-red-300 hover:text-red-500 transition-all">
        Logout
      </button>
    </div>
  );
}