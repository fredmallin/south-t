import { useState } from "react";
import {
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";
import { auth } from "../firebase";

export default function AdminChangePassword() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (!oldPassword || !newPassword || !confirmPassword) {
      return alert("Please fill all fields");
    }

    if (newPassword.length < 6) {
      return alert("New password must be at least 6 characters");
    }

    if (newPassword !== confirmPassword) {
      return alert("New passwords do not match");
    }

    const user = auth.currentUser;

    if (!user || !user.email) {
      return alert("No logged in user found");
    }

    setLoading(true);

    try {
      // Re-authenticate using old password
      const credential = EmailAuthProvider.credential(
        user.email,
        oldPassword
      );

      await reauthenticateWithCredential(user, credential);

      // Update to new password
      await updatePassword(user, newPassword);

      alert("Password updated successfully!");

      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error(error);

      if (error.code === "auth/wrong-password") {
        alert("Old password is incorrect");
      } else {
        alert("Failed to update password");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "80vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f5f7fb",
        padding: "20px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "450px",
          background: "#ffffff",
          padding: "40px",
          borderRadius: "16px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
          borderTop: "5px solid #793f12",
        }}
      >
        <h1
          style={{
            textAlign: "center",
            marginBottom: "30px",
            color: "#793f12",
            fontSize: "28px",
            fontWeight: "700",
          }}
        >
          Change Password
        </h1>

        <form
          onSubmit={handleChangePassword}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "18px",
          }}
        >
          <input
            type="password"
            placeholder="Old Password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            style={{
              padding: "14px 16px",
              border: "1px solid #dcdfe6",
              borderRadius: "10px",
              fontSize: "15px",
              outline: "none",
            }}
          />

          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            style={{
              padding: "14px 16px",
              border: "1px solid #dcdfe6",
              borderRadius: "10px",
              fontSize: "15px",
              outline: "none",
            }}
          />

          <input
            type="password"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            style={{
              padding: "14px 16px",
              border: "1px solid #dcdfe6",
              borderRadius: "10px",
              fontSize: "15px",
              outline: "none",
            }}
          />

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "14px",
              background: loading ? "#b08968" : "#793f12",
              color: "#fff",
              border: "none",
              borderRadius: "10px",
              fontSize: "16px",
              fontWeight: "600",
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Updating..." : "Change Password"}
          </button>
        </form>
      </div>
    </div>
  );
}