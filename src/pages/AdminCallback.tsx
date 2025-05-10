import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { exchangeCodeForToken, getUserInfo } from "@/lib/auth";

const AdminCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get("code");
      const error = searchParams.get("error");

      if (error) {
        console.error("OAuth error:", error);
        navigate("/admin");
        return;
      }

      if (!code) {
        console.error("No code received");
        navigate("/admin");
        return;
      }

      try {
        const tokenResponse = await exchangeCodeForToken(code);
        const userInfo = await getUserInfo(tokenResponse.access_token);

        // Store the tokens and user info in localStorage or your preferred storage
        localStorage.setItem("access_token", tokenResponse.access_token);
        localStorage.setItem("refresh_token", tokenResponse.refresh_token);
        localStorage.setItem("user_info", JSON.stringify(userInfo));

        // Redirect to admin dashboard
        navigate("/admin/dashboard");
      } catch (error) {
        console.error("Error during authentication:", error);
        navigate("/admin");
      }
    };

    handleCallback();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Authenticating...</h1>
        <p>Please wait while we complete your authentication.</p>
      </div>
    </div>
  );
};

export default AdminCallback; 