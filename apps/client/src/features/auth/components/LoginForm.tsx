import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLogin } from "../api/login.ts";

export const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const { mutate: login, isPending, isError, error } = useLogin();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier || !password) return;

    login(
      { identifier, password },
      {
        onSuccess: () => {
          // After successful login, navigate to the dashboard
          navigate("/dashboard");
        },
        onError: (err) => {
          console.error("Login error:", err);
        },
      },
    );
  };

  return (
    <div className="card p-6 w-full max-w-md border-(--color-border) bg-surface">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs uppercase tracking-widest text-text-muted mb-1 font-bold">
            Identifier (Roll No / Email)
          </label>
          <input
            type="text"
            className="input-base"
            placeholder="e.g. 002510503048 or user@gmail.com"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            disabled={isPending}
            required
          />
        </div>

        <div>
          <label className="block text-xs uppercase tracking-widest text-text-muted mb-1 font-bold">
            Password
          </label>
          <input
            type="password"
            className="input-base"
            placeholder="••••••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isPending}
            required
          />
        </div>

        {isError && (
          <div className="p-2 border border-(--color-danger) bg-primary-dim text-primary-hover text-xs rounded">
            ⚠ {(error as Error).message || "Invalid credentials"}
          </div>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="w-full py-2 px-4 bg-(--color-primary) hover:bg-primary-hover text-(--color-text-inverse) font-bold text-xs uppercase tracking-widest rounded transition-colors disabled:opacity-50 cursor-pointer"
        >
          {isPending ? "Authenticating..." : "Login"}
        </button>
      </form>
    </div>
  );
};
