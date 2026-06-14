import css from './ProfilePage.module.css';
import Link from 'next/link';
import Image from 'next/image';
import { getMe } from '@/lib/api/serverApi';
import { Metadata } from 'next';


export const metadata: Metadata = {
  title: "Profile",
  description: "User profile page",
};

export default async function ProfilePage() {
  // const response = await checkSession();
  // const user = response.data;
  const user = await getMe();
  return (
    <main className={css.mainContent}>
    <div className={css.profileCard}>
        <div className={css.header}>
            <h1 className={css.formTitle}>Profile Page</h1>
            <Link href="/profile/edit" className={css.editProfileButton}>
            Edit Profile
            </Link>
        </div>
        <div className={css.avatarWrapper}>
        <Image
            src={
              user?.avatar ||
              "https://ac.goit.global/fullstack/react/default-avatar.jpg"
            }
            alt="User Avatar"
            width={120}
            height={120}
            className={css.avatar}
        />
        </div>
        <div className={css.profileInfo}>
        <p>
            Username: {user?.username}
        </p>
        <p>
            Email: {user?.email}
        </p>
        </div>
    </div>
    </main>
  );
}
