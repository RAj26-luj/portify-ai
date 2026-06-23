// src/app/page.tsx
import { auth } from "@/auth";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import HomeClient from "@/components/home/home-client";

export default async function HomePage() {
  const session = await auth();

  return (
    <>
      <Navbar />
      <HomeClient session={session} />
      <Footer />
    </>
  );
}
