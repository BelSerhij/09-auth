"use client";

import css from './AuthNavigation.module.css';
import Link from 'next/link';
import { logout } from "@/lib/api/clientApi";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/authStore";

export default function AuthNavigation() {
  const router = useRouter();
  const { user, isAuthenticated, clearIsAuthenticated } = useAuthStore();

  const handleLogout = async () => {
    try {
      await logout();
      clearIsAuthenticated();
      router.push("/sign-in");
    } catch {
      console.log("Logout failed");
    }
  };

  return (
    <>
      {!isAuthenticated ? (
        <>
          <li className={css.navigationItem}>
            <Link href="/sign-in" prefetch={false} className={css.navigationLink}>
              Login
            </Link>
          </li>

          <li className={css.navigationItem}>
            <Link href="/sign-up" prefetch={false} className={css.navigationLink}>
              Sign up
            </Link>
          </li>
        </>
      ) : (
        <>
          <li className={css.navigationItem}>
            <Link href="/profile" prefetch={false} className={css.navigationLink}>
              Profile
            </Link>
          </li>

          <li className={css.navigationItem}>
            <p className={css.userEmail}>{user?.email}</p>
            <button onClick={handleLogout} className={css.logoutButton}>
              Logout
            </button>
          </li>
        </>
      )}
    </>
  );
}
