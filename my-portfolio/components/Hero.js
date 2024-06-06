
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLinkedin,
  faInstagram,
  faFacebook,
  faGithub,
  faNpm,
  faTwitter,
} from "@fortawesome/free-brands-svg-icons";

const icons = {
  linkedin: faLinkedin,
  instagram: faInstagram,
  facebook: faFacebook,
  github: faGithub,
  npm: faNpm,
  twitter: faTwitter,
};

const SocialLink = ({ href, icon, label, delay }) => (
  <motion.a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="text-white p-3 rounded-full hover:text-blue-200 transition-colors"
    style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24'%3E%3Cpath d='M0 0h24v24H0z' fill='none'/%3E%3Cpath d='M8 5v14l11-7z' fill='%23FFFFFF' opacity='0'/%3E%3C/svg%3E")`,
    }}
    whileHover={{
      scale: 1.1,
      rotate: 15,
      backgroundSize: "100%",
      transition: { duration: 0.3 },
    }}
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0, transition: { duration: 0.6, delay } }}
  >
    <FontAwesomeIcon icon={icons[icon]} className="fa-lg" />
    <span className="sr-only">{label}</span>
  </motion.a>
);

const Hero = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const darkModeQuery = window.matchMedia("(prefers-color-scheme: dark)");
    setIsDarkMode(darkModeQuery.matches);
    darkModeQuery.addListener((e) => setIsDarkMode(e.matches));
  }, []);

  const staggerChildren = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.4, delayChildren: 0.6 },
    },
  };

  const fadeIn = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
        mass: 1,
      },
    },
  };

  const slideInLeft = {
    hidden: { x: -100, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20,
        delay: 1,
      },
    },
  };

  const roles = [
    "Electrical Engineer",
    "Machine Learning Engineer",
    "Data Analyst",
    "Social Media Marketer",
  ];

  return (
    <motion.section
      id="home"
      className={`min-h-screen flex flex-col justify-center items-center py-20 relative ${
        isDarkMode
          ? "bg-gray-900"
          : "bg-gradient-to-br from-blue-50 via-indigo-100 to-purple-100"
      }`}
      initial="hidden"
      animate="visible"
      variants={staggerChildren}
    >
      <div className="absolute inset-0 z-0">
        <svg
          className="w-full h-full text-blue-200 dark:text-gray-800 opacity-50"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
        >
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop
                offset="0%"
                style={{
                  stopColor: isDarkMode ? "#4F46E5" : "#93C5FD",
                  stopOpacity: 0.5,
                }}
              />
              <stop
                offset="100%"
                style={{
                  stopColor: isDarkMode ? "#7C3AED" : "#C084FC",
                  stopOpacity: 0.5,
                }}
              />
            </linearGradient>
          </defs>
          <path
            fill="url(#gradient)"
            d="M0,224L80,197.3C160,171,320,117,480,133.3C640,149,800,235,960,240C1120,245,1280,171,1360,133.3L1440,96L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"
          ></path>
        </svg>
      </div>

      <div className="max-w-4xl mx-auto px-6 z-10">
        <motion.div
          className="relative w-40 h-40 md:w-56 md:h-56 mx-auto mb-8 rounded-full overflow-hidden shadow-2xl"
          whileHover={{ scale: 1.05, rotate: 5, transition: { duration: 0.3 } }}
          variants={fadeIn}
        >
          <Image
            src="/IMG_3045.jpg"
            alt="Jalal Saleem"
            layout="responsive"
            objectFit="cover"
            placeholder="blur"
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN88enTfwAJYwPNteQx0wAAAABJRU5ErkJggg=="
            width={500}
            height={300}
          />
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-blue-900 to-transparent opacity-0 hover:opacity-50 transition-opacity"
            whileHover={{ opacity: 0.5 }}
          />
        </motion.div>

        <motion.h1
          className={`text-4xl md:text-6xl font-extrabold mb-4 ${
            isDarkMode ? "text-white" : "text-blue-900"
          }`}
          variants={fadeIn}
        >
          <span className="relative inline-block">
            Engr.{" "}
            <span className="absolute -top-4 left-0 text-xs text-blue-600 dark:text-blue-400">
              B.Sc.
            </span>
          </span>{" "}
          Jalal Saleem
        </motion.h1>

        <motion.div className="text-xl mb-8 flex flex-col items-center space-y-2">
          {roles.map((role, index) => (
            <motion.span
              key={role}
              className={isDarkMode ? "text-gray-300" : "text-blue-800"}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 + index * 0.6, duration: 1 }}
            >
              {role}
            </motion.span>
          ))}
        </motion.div>

        <motion.div
          className="flex flex-wrap justify-center gap-4 mb-12"
          variants={staggerChildren}
          initial="hidden"
          animate="visible"
        >
          {[
            {
              href: "https://www.linkedin.com/in/engr-jalal-saleem",
              icon: "linkedin",
              label: "LinkedIn",
            },
            {
              href: "https://www.instagram.com/jalalbinsaleem/",
              icon: "instagram",
              label: "Instagram",
            },
            {
              href: "https://www.facebook.com/jalalsaleem786",
              icon: "facebook",
              label: "Facebook",
            },
            {
              href: "https://github.com/Engr-Jalal-Saleem",
              icon: "github",
              label: "GitHub",
            },
            {
              href: "https://www.npmjs.com/~engr_jalal_saleem",
              icon: "npm",
              label: "NPM",
            },
            {
              href: "https://twitter.com/JSaleem786",
              icon: "twitter",
              label: "Twitter",
            },
          ].map(({ href, icon, label }, i) => (
            <SocialLink
              key={icon}
              href={href}
              icon={icon}
              label={label}
              delay={i * 0.9 + 1}
            />
          ))}
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          variants={fadeIn}
        >
          <Link
            href="#contact"
            className={`inline-block px-8 py-3 font-bold rounded-full shadow-lg transform transition-all duration-300 ease-in-out ${
              isDarkMode
                ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700"
                : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700"
            }`}
          >
            Let&apos;s Innovate Together
          </Link>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default Hero;
