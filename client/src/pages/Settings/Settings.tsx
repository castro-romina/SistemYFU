import { useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { useTheme } from "../../Context/ThemeContext";
import { changePassword, changeEmail, deleteAccount } from "../../lib/api";
import { logout } from "../../lib/auth";
import { useNavigate } from "react-router-dom";
import ModalConfirm from "../../components/common/ModalConfirm";

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={`relative w-11 h-6 rounded-full transition-colors ${
        checked ? "bg-purple-600" : "bg-gray-300"
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
          checked ? "translate-x-5" : ""
        }`}
      />
    </button>
  );
}

export default function Settings() {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  // Notificaciones — TODO: cargar el valor real desde getMyProfile (notifEmail/notifPush)
  // y pegarle a updateNotifications() en cada cambio, siguiendo el mismo patrón de abajo.
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifPush, setNotifPush] = useState(true);

  // Cambiar contraseña
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordMsg, setPasswordMsg] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);

  // Cambiar email
  const [newEmail, setNewEmail] = useState("");
  const [emailPassword, setEmailPassword] = useState("");
  const [emailMsg, setEmailMsg] = useState("");
  const [emailError, setEmailError] = useState("");
  const [savingEmail, setSavingEmail] = useState(false);

  // Eliminar cuenta
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [showFinalConfirm, setShowFinalConfirm] = useState(false);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordMsg("");
    setSavingPassword(true);
    try {
      await changePassword({ currentPassword, newPassword });
      setPasswordMsg("Password updated successfully.");
      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
      setPasswordError(err instanceof Error ? err.message : "Failed to change password.");
    } finally {
      setSavingPassword(false);
    }
  };

  const handleChangeEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError("");
    setEmailMsg("");
    setSavingEmail(true);
    try {
      await changeEmail({ newEmail, password: emailPassword });
      setEmailMsg("Email updated. Please sign in again with your new email.");
      setNewEmail("");
      setEmailPassword("");
    } catch (err) {
      setEmailError(err instanceof Error ? err.message : "Failed to change email.");
    } finally {
      setSavingEmail(false);
    }
  };

  const handleDeleteAccount = async () => {
    setDeleteError("");
    setDeleting(true);
    try {
      await deleteAccount(deletePassword);
      logout();
      navigate("/login");
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : "Failed to delete account.");
      setDeleting(false);
    }
  };

  return (
    <DashboardLayout title="Settings">
      <div className="max-w-2xl mx-auto space-y-6 pb-10">
        {/* Apariencia */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Appearance</h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">Dark mode</p>
              <p className="text-xs text-gray-500">
                {theme === "dark" ? "Dark theme is on" : "Light theme is on"}
              </p>
            </div>
            <Toggle checked={theme === "dark"} onChange={toggleTheme} />
          </div>
        </div>

        {/* Notificaciones */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Notifications</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">Email notifications</p>
                <p className="text-xs text-gray-500">Updates about your applications and messages</p>
              </div>
              <Toggle checked={notifEmail} onChange={() => setNotifEmail((v) => !v)} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">Push notifications</p>
                <p className="text-xs text-gray-500">Real-time alerts on this device</p>
              </div>
              <Toggle checked={notifPush} onChange={() => setNotifPush((v) => !v)} />
            </div>
          </div>
        </div>

        {/* Cambiar contraseña */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Change password</h2>
          <form onSubmit={handleChangePassword} className="space-y-3">
            <div>
              <label className="text-xs font-medium block mb-1">Current password</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-lg p-3 text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-medium block mb-1">New password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={8}
                className="w-full border border-gray-300 rounded-lg p-3 text-sm"
              />
            </div>
            {passwordError && <p className="text-red-500 text-sm font-semibold">{passwordError}</p>}
            {passwordMsg && <p className="text-green-600 text-sm font-semibold">{passwordMsg}</p>}
            <button
              type="submit"
              disabled={savingPassword}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition disabled:opacity-50"
            >
              {savingPassword ? "Saving..." : "Update password"}
            </button>
          </form>
        </div>

        {/* Cambiar email */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Change email</h2>
          <form onSubmit={handleChangeEmail} className="space-y-3">
            <div>
              <label className="text-xs font-medium block mb-1">New email</label>
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-lg p-3 text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-medium block mb-1">Password</label>
              <input
                type="password"
                value={emailPassword}
                onChange={(e) => setEmailPassword(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-lg p-3 text-sm"
              />
            </div>
            {emailError && <p className="text-red-500 text-sm font-semibold">{emailError}</p>}
            {emailMsg && <p className="text-green-600 text-sm font-semibold">{emailMsg}</p>}
            <button
              type="submit"
              disabled={savingEmail}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition disabled:opacity-50"
            >
              {savingEmail ? "Saving..." : "Update email"}
            </button>
          </form>
        </div>

        {/* Eliminar cuenta */}
        <div className="bg-white border border-red-200 rounded-xl p-6">
          <h2 className="font-semibold text-red-600 mb-1">Delete account</h2>
          <p className="text-xs text-gray-500 mb-4">
            This permanently deletes your profile and applications. This can't be undone.
          </p>

          {!showDeleteConfirm ? (
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              className="px-4 py-2 border border-red-300 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50 transition"
            >
              Delete my account
            </button>
          ) : (
            <div className="space-y-3">
              <label className="text-xs font-medium block mb-1">Confirm your password to continue</label>
              <input
                type="password"
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 text-sm"
              />
              {deleteError && <p className="text-red-500 text-sm font-semibold">{deleteError}</p>}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setDeletePassword("");
                    setDeleteError("");
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => setShowFinalConfirm(true)}
                  disabled={deleting || !deletePassword}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition disabled:opacity-50"
                >
                  {deleting ? "Deleting..." : "Yes, delete my account"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <ModalConfirm
        isOpen={showFinalConfirm}
        title="Delete your account?"
        message="This will permanently delete your profile and applications. This action can't be undone."
        confirmLabel="Delete account"
        cancelLabel="Cancel"
        variant="danger"
        onConfirm={() => {
          setShowFinalConfirm(false);
          handleDeleteAccount();
        }}
        onCancel={() => setShowFinalConfirm(false)}
      />
    </DashboardLayout>
  );
}