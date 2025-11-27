import { useState } from "react";
import { useTranslation } from "react-i18next";

interface AdminLoginProps {
  onLoginSuccess: () => void;
}

function AdminLogin({ onLoginSuccess }: AdminLoginProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { t, i18n } = useTranslation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Mock validation - just check if fields are filled
    if (username && password) {
      onLoginSuccess();
    } else {
      setError(t("admin.login.error"));
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gray-100"
      dir={i18n.language === "he" ? "rtl" : "ltr"}
    >
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          {t("admin.login.title")}
        </h1>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">
              {t("admin.login.username")}
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={t("admin.login.usernamePlaceholder")}
              dir={i18n.language === "he" ? "rtl" : "ltr"}
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">
              {t("admin.login.password")}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={t("admin.login.passwordPlaceholder")}
              dir={i18n.language === "he" ? "rtl" : "ltr"}
            />
          </div>

          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            {t("admin.login.loginButton")}
          </button>
        </form>

        <p className="text-gray-500 text-sm mt-4 text-center">
          {t("admin.login.mockNote")}
        </p>
      </div>
    </div>
  );
}

export default AdminLogin;
