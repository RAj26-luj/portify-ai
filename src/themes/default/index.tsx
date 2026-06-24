"use client";

import React from "react";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Skills from "./components/Skills";
import Projects from "./components/Projects";
import IntroLoader from "./components/IntroLoader";
import CustomSection from "./components/CustomSection";
import Certifications from "./components/Certifications";
import Publications from "./components/Publications";
import OpenSource from "./components/OpenSource";
import CodingProfiles from "./components/CodingProfiles";
import Testimonials from "./components/Testimonials";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import CustomCursor from "./components/shared/CustomCursor";
import Career from "./components/Career";

export default function DefaultTheme({ portfolio }: any) {
  const data = portfolio;

  // Determine actual visibility from configuration sectionSettings arrays
  const isExperienceEnabled = data?.sectionSettings?.length
    ? data.sectionSettings.some(
        (s: any) => s.sectionKey?.toLowerCase() === "experience" && s.isEnabled
      )
    : true;

  const isEducationEnabled = data?.sectionSettings?.length
    ? data.sectionSettings.some(
        (s: any) => s.sectionKey?.toLowerCase() === "education" && s.isEnabled
      )
    : true;

  const sectionMap: Record<string, React.ReactNode> = {
    hero: <Hero portfolio={data} key="hero" />,

    about: <About portfolio={data} key="about" />,

    skills: <Skills portfolio={data} key="skills" />,

    projects: <Projects key="projects" projects={data?.projects || []} username={data?.username} />,

    career: (
      <Career
        key="career"
        experiences={data?.experiences || []}
        educations={data?.educations || []}
        portfolio={data}
        showExperience={isExperienceEnabled}
        showEducation={isEducationEnabled}
      />
    ),

    certifications: (
      <Certifications key="certifications" certifications={data?.certifications || []} />
    ),

    publications: <Publications key="publications" publications={data?.publications || []} />,

    opensource: (
      <OpenSource
        key="opensource"
        openSource={data?.openSourceProjects || []}
        username={data?.username}
      />
    ),
    "open-source": (
      <OpenSource
        key="open-source"
        openSource={data?.openSourceProjects || []}
        username={data?.username}
      />
    ),

    codingprofiles: (
      <CodingProfiles key="codingprofiles" codingProfiles={data?.codingProfiles || []} />
    ),

    "coding-profiles": (
      <CodingProfiles key="coding-profiles" codingProfiles={data?.codingProfiles || []} />
    ),

    testimonials: <Testimonials key="testimonials" testimonials={data?.testimonials || []} />,

    contact: <Contact key="contact" portfolio={data} />,
  };

  const enabledSections = data?.sectionSettings?.length
    ? data.sectionSettings
        .filter((section: any) => section.isEnabled)
        .sort((a: any, b: any) => a.displayOrder - b.displayOrder)
    : [
        { id: "hero", sectionKey: "hero" },
        { id: "about", sectionKey: "about" },
        { id: "skills", sectionKey: "skills" },
        { id: "projects", sectionKey: "projects" },
        { id: "experience", sectionKey: "experience" },
        { id: "education", sectionKey: "education" },
        { id: "certifications", sectionKey: "certifications" },
        { id: "publications", sectionKey: "publications" },
        { id: "open-source", sectionKey: "open-source" },
        { id: "coding-profiles", sectionKey: "coding-profiles" },
        { id: "testimonials", sectionKey: "testimonials" },
        { id: "contact", sectionKey: "contact" },
      ];

  const mergedSections: any[] = [];
  let careerAdded = false;

  for (const section of enabledSections) {
    const key = section.sectionKey.toLowerCase();

    if (key === "experience" || key === "education") {
      if (!careerAdded) {
        mergedSections.push({
          ...section,
          sectionKey: "career",
        });
        careerAdded = true;
      }
      continue;
    }
    mergedSections.push(section);
  }

  return (
    <div className="min-h-screen flex flex-col">
      <CustomCursor />
      <IntroLoader portfolio={data}>
        <Navbar
          portfolio={data}
          socialLinks={data?.socialLinks || []}
          sectionSettings={enabledSections}
        />

        <main className="flex-1">
          {mergedSections.map((section: any) => {
            const key = section.sectionKey;

            if (key === "custom-sections") {
              return (
                <React.Fragment key={section.id}>
                  {(data?.customSections || []).map((customSection: any) => (
                    <CustomSection key={customSection.id} sections={[customSection]} />
                  ))}
                </React.Fragment>
              );
            }

            if (key.startsWith("custom_")) {
              const customId = key.replace("custom_", "");
              const customSection =
                data?.customSections?.filter((item: any) => item.id === customId) || [];

              return <CustomSection key={section.id} sections={customSection} />;
            }

            return <React.Fragment key={section.id}>{sectionMap[key]}</React.Fragment>;
          })}
        </main>

        <Footer portfolio={data} />
      </IntroLoader>
    </div>
  );
}
