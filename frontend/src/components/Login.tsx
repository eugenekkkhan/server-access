import { useState, FormEvent } from "react";
import { theme } from "../theme.config";

interface Props {
  onLogin: (token: string) => void;
}

export default function Login({ onLogin }: Props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const token = btoa(`${username}:${password}`);

    try {
      const res = await fetch("/auth/login", {
        method: "POST",
        headers: { Authorization: `Basic ${token}` },
      });

      if (!res.ok) {
        setError("Invalid credentials");
        return;
      }

      onLogin(token);
    } catch {
      setError("Connection error — is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={theme.loginWrapper}>
      <form style={theme.card} onSubmit={handleSubmit}>
        <h1 style={theme.cardTitle}>Server Access</h1>
        <p style={theme.cardSubtitle}>Enter your credentials to open a terminal</p>

        <label style={theme.inputLabel}>Username</label>
        <input
          style={theme.input}
          type="text"
          autoComplete="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <label style={theme.inputLabel}>Password</label>
        <input
          style={theme.input}
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && <p style={theme.errorText}>{error}</p>}

        <button style={theme.submitBtn} type="submit" disabled={loading}>
          {loading ? "Connecting…" : "Connect"}
        </button>
      </form>
    </div>
  );
}
