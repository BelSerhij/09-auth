"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

type Props = {
  children: React.ReactNode;
};

const AuthLayout = ({ children }: Props) => {
  const router = useRouter();

  useEffect(() => {
    router.refresh();
  }, [router]);

  return <>{children}</>;
};

export default AuthLayout;