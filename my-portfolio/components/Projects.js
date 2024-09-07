import React, { useEffect, useState } from 'react';
import { motion, useAnimation, AnimatePresence, cubicBezier } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FaRocket, FaHome, FaRobot, FaStore, FaComment, FaChartBar, FaUserGraduate, FaCloudSun } from 'react-icons/fa';

const iconMap = {
  'ML Model For The Ranking': FaRobot,
  'Supermart Management': FaStore,
  'Chat Bot Development': FaComment,
  'Visualization of Accidents': FaChartBar,
  'Student LMS': FaUserGraduate,
  'Weather CLI': FaCloudSun
};

const ProjectCard = ({ title, description, period, location, index, type }) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({ triggerOnce: true, rootMargin: '-50px 0px' });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  const Icon = iconMap[title] || FaRocket;

  const cardVariants = {
    hidden: { opacity: 0, y: 50, rotateY: -15 },
    visible: { 
      opacity: 1, 
      y: 0, 
      rotateY: 0,
      transition: { 
        duration: 0.8, 
        ease: cubicBezier(0.6, 0.05, -0.01, 0.9),
        delay: index * 0.3 
      } 
    }
  };

  const hoverVariants = {
    rest: { scale: 1, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' },
    hover: { 
      scale: 1.05, 
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      transition: { type: 'spring', stiffness: 400, damping: 10 }
    }
  };

  return (
    <motion.div 
      ref={ref}
      variants={cardVariants}
      initial="hidden"
      animate={controls}
      whileHover="hover"
      className="bg-white dark:bg-gray-800 p-8 rounded-lg relative overflow-hidden group"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <motion.div 
        variants={hoverVariants}
        className="absolute inset-0 bg-gradient-to-br from-blue-700 to-indigo-900 dark:from-blue-900 dark:to-indigo-1100 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out"
      />
      <motion.div 
        className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-blue-500 to-indigo-600"
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ delay: index * 0.3 + 0.5, duration: 0.6, ease: cubicBezier(0.6, 0.05, -0.01, 0.9) }}
      />
      <div className="relative z-10 transition-colors duration-300 group-hover:text-white">
        <span className="text-gray-500 dark:text-gray-400 text-sm mb-2 block group-hover:text-blue-200">{period}</span>
        <h3 className="text-2xl font-bold text-blue-800 dark:text-blue-400 mb-2 group-hover:text-white">{title}</h3>
        <p className="text-gray-600 dark:text-gray-400 group-hover:text-blue-200">{description}</p>
        <p className="text-gray-600 dark:text-gray-400 mt-2 group-hover:text-blue-200">{location}</p>
      </div>
      <AnimatePresence>
        {isHovered && (
          <motion.div 
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 45 }}
            transition={{ type: 'spring', stiffness: 300, damping: 15 }}
            className="absolute bottom-4 right-4 text-white text-opacity-90 text-4xl"
          >
            <Icon />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const Projects = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDarkMode(prefersDarkMode);
  }, []);

  const titleControls = useAnimation();
  const [titleRef, titleInView] = useInView({ triggerOnce: true, rootMargin: '-100px 0px' });

  useEffect(() => {
    if (titleInView) {
      titleControls.start('visible');
    }
  }, [titleControls, titleInView]);

  const titleVariants = {
    hidden: { opacity: 0, y: -50, rotateX: -15 },
    visible: { 
      opacity: 1, 
      y: 0, 
      rotateX: 0, 
      transition: { duration: 1, ease: cubicBezier(0.6, 0.05, -0.01, 0.9), delay: 0.2 } 
    }
  };

  const projectsData = [
    { title: 'ML Model For The Ranking', description: 'Developed a machine learning model that predicts a student\'s rank based on their marks.', period: 'May 2023 – June 2023', location: 'Lahore, Pakistan' },
    { title: 'Supermart Management', description: 'Developed a Supermart Management System in Python, facilitating customers, administrators, and cashiers.', period: 'Dec 2022 – April 2023', location: 'Lahore, Pakistan' },
    { title: 'Chat Bot Development', description: 'Developed a real-time chat bot using Google\'s Palm API to answer FAQs.', period: 'July 2023', location: 'Sargodha, Pakistan' },
    { title: 'Visualization of Accidents', description: 'Developed an interactive dashboard in Excel for visualizing accident cases and causes.', period: 'Aug 2023 – Sep 2023', location: 'Sargodha, Pakistan' },
    { title: 'Student LMS', description: 'Developed a comprehensive student management system using DSA.', period: 'Jan 2024 – May 2024', location: 'Lahore, Pakistan' },
    { title: 'Weather CLI', description: 'Developed a command-line interface application for fetching real-time weather data.', period: 'Jan 2024', location: 'PIAIC, Lahore, Pakistan' }
  ];

  return (
    <section id="projects" className={`py-24 text-center relative overflow-hidden transition-colors duration-500 ease-in-out ${isDarkMode ? 'bg-gradient-to-br from-gray-900 to-black' : 'bg-gradient-to-br from-blue-100 to-indigo-200'}`}>
      <div className="absolute top-0 left-0 w-full h-full">
        <svg className="w-full h-full text-blue-300 dark:text-blue-900 opacity-50 transform -scale-x-100" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
          <path fill="currentColor" fillOpacity="1" d="M0,160L48,138.7C96,117,192,75,288,69.3C384,64,480,96,576,128C672,160,768,192,864,186.7C960,181,1056,139,1152,133.3C1248,128,1344,160,1392,176L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
      </div>
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <motion.h2 
          ref={titleRef}
          variants={titleVariants}
          initial="hidden"
          animate={titleControls}
          className={`text-5xl font-black mb-12 inline-block relative ${isDarkMode ? 'text-blue-300' : 'text-blue-900'}`}
        >
          My Project Portfolio
          <motion.span 
            className={`absolute -bottom-2 left-0 w-full h-1.5 ${isDarkMode ? 'bg-blue-500' : 'bg-blue-600'}`}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: isLoaded ? 1 : 0 }}
            transition={{ 
              duration: 1.5, 
              ease: cubicBezier(0.6, 0.05, -0.01, 0.9), 
              delay: 1 
            }}
          />
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {projectsData.map((project, index) => (
            <ProjectCard key={project.title} {...project} index={index} />
          ))}
        </div>
      </div>
      <button 
        onClick={() => setIsDarkMode(!isDarkMode)} 
        className={`fixed bottom-4 right-4 p-3 rounded-full text-white transition-colors duration-300 ease-in-out ${isDarkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-indigo-600 hover:bg-indigo-700'}`}
      >
        {isDarkMode ? '🌙' : '☀️'}
      </button>
    </section>
  );
};

export default Projects;