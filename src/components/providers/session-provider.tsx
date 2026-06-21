"use client";

import { SessionProvider } from "next-auth/react";

export default function AppSessionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SessionProvider

  refetchInterval={300}

  refetchOnWindowFocus={true}

>

  {children}

</SessionProvider>;
}