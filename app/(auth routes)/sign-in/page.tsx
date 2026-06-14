    'use client';

import css from './SignInPage.module.css';
import { useState } from "react";
import { useRouter } from "next/navigation";
import { login, LoginRequest } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";

export default function SignInPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const setUser = useAuthStore((state) => state.setUser);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setError("");
      const formData = new FormData(e.currentTarget);
      const formValues = Object.fromEntries(formData) as LoginRequest;
      
      const user = await login(formValues);
      setUser(user);

      if (user) {
        router.push("/profile");
      }
    } catch (error) {
      console.log(error);
      setError("Something went wrong");
    }
  };

  return (
    <main className={css.mainContent}>
    <form onSubmit={handleSubmit} className={css.form}>
        <h1 className={css.formTitle}>Sign in</h1>

        <div className={css.formGroup}>
        <label htmlFor="email">Email</label>
        <input id="email" type="email" name="email" className={css.input} required />
        </div>

        <div className={css.formGroup}>
        <label htmlFor="password">Password</label>
        <input id="password" type="password" name="password" className={css.input} required />
        </div>

        <div className={css.actions}>
        <button type="submit" className={css.submitButton}>
            Log in
        </button>
        </div>

        <p className={css.error}>{error}</p>
    </form>
    </main>
  );
}
