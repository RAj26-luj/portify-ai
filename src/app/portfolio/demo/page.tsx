"use client";

import "./developer.css";

import Hero from "./components/Hero";
import About from "./components/About";
import SkillsGrid from "./components/SkillsGrid";
import Projects from "./components/Projects";
import Timeline from "./components/Timeline";
import CodingProfiles from "./components/CodingProfiles";
import Certifications from "./components/Certifications";
import Publications from "./components/Publications";
import OpenSource from "./components/OpenSource";


import Testimonials from "./components/Testimonials";

import Contact from "./components/Contact";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";

import CustomCursor from "./components/shared/CustomCursor";

import { useEffect, useState } from "react";

export default function DeveloperTheme() {
  const [mousePos, setMousePos] = useState({
    x: 0,
    y: 0,
  });

  const [isCursorHovered, setIsCursorHovered] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: e.clientX,
        y: e.clientY,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (

    <div className="developer-theme">
      <CustomCursor
        mousePos={mousePos}
        isCursorHovered={isCursorHovered}
      />
      <Navbar />
      <div className="bg-grid" />

    <main>
  <Hero />

  <About />

  <SkillsGrid />

  <CodingProfiles />

  <Projects />

  <OpenSource />

  <Timeline />

  <Certifications />

  <Publications />

  <Testimonials />

  <Contact />
</main>

      <Footer />
    </div>
  );
}