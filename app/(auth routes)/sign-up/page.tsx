'use client';

import css from './SignUpPage.module.css';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { register, RegisterRequest } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";

export default function SignUpPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const setUser = useAuthStore((state) => state.setUser);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setError("");
      const formData = new FormData(e.currentTarget);
      const formValues = Object.fromEntries(formData) as RegisterRequest;
      
      const user = await register(formValues);
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
    <h1 className={css.formTitle}>Sign up</h1>
        <form onSubmit={handleSubmit} className={css.form}>
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
            Register
        </button>
        </div>

        <p className={css.error}>{error}</p>
    </form>
    </main>
  );
}
