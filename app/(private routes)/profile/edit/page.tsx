"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { editProfile, EditProfileRequest } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";
import Image from "next/image";

import css from "./EditProfilePage.module.css";

export default function NewProfile() {
  const router = useRouter();
  const [error, setError] = useState("");
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setError("");
      const formData = new FormData(e.currentTarget);
      const formValues = Object.fromEntries(formData) as EditProfileRequest;
      // Виконуємо запит
      const newUser = await editProfile(formValues);
      setUser(newUser);

      if (newUser) {
        router.push("/profile");
      }
    } catch (error) {
      console.log(error);
      setError("Something went wrong");
    }
  };

  return (
    <>
      <main className={css.mainContent}>
        <div className={css.profileCard}>
          <h1 className={css.formTitle}>Edit Profile</h1>

          <Image
            src={
              user?.avatar ||
              "https://ac.goit.global/fullstack/react/avatar-placeholder.png"
            }
            alt="User Avatar"
            width={120}
            height={120}
            className={css.avatar}
          />

          <form onSubmit={handleSubmit} className={css.profileInfo}>
            <div className={css.usernameWrapper}>
              <label htmlFor="username">Username:</label>
              <input
                id="username"
                name="username"
                defaultValue={user?.username || ""}
                type="text"
                className={css.input}
              />
            </div>

            <p>Email: {user?.email}</p>

            <div className={css.actions}>
              <button type="submit" className={css.saveButton}>
                Save
              </button>
              <button
                onClick={() => router.back()}
                type="button"
                className={css.cancelButton}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </main>
    </>
  );
}