import { useEffect, useState } from 'react';
import { motion, useAnimation, AnimatePresence, cubicBezier } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FaRocket, FaHome, FaRobot, FaStore, FaComment, FaChartBar, FaUserGraduate, FaCloudSun } from 'react-icons/fa';

const iconMap = {
  'AI-Based Fault Detection': FaRocket,
  'Smart Home Automation': FaHome,
  'ML Model For The Ranking': FaRobot,
  'Supermart Management': FaStore,
  'Chat Bot Development': FaComment,
  'Visualization of Accidents': FaChartBar,
  'Student LMS': FaUserGraduate,
  'Weather CLI': FaCloudSun
};

const ProjectCard = ({ title, description, period, location, index }) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({ triggerOnce: true, rootMargin: '-50px 0px' });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  const Icon = iconMap[title.split(',')[0]] || FaRocket;

  const cardVariants = {
    hidden: { opacity: 0, y: 50, rotateY: -15 },
    visible: { 
      opacity: 1, 
      y: 0, 
      rotateY: 0,
      transition: { 
        duration: 0.6, 
        ease: cubicBezier(0.6, 0.05, -0.01, 0.9), 
        delay: index * 0.1 
      } 
    }
  };

  const containerVariants = {
    rest: { backgroundColor: 'white', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' },
    hover: { 
      backgroundColor: '#EBF8FF', 
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      transition: { duration: 0.3, ease: 'easeOut' }
    }
  };

  return (
    <motion.div 
      ref={ref}
      variants={cardVariants}
      initial="hidden"
      animate={controls}
      className="w-full md:w-1/2 lg:w-1/3 p-4"
    >
      <motion.div 
        variants={containerVariants}
        initial="rest"
        whileHover="hover"
        className="p-6 rounded-lg transition-all duration-300 ease-in-out h-full flex flex-col"
      >
        <div className="flex items-center mb-6">
          <motion.div 
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: index * 0.1 + 0.6, duration: 0.5, type: 'spring', stiffness: 200 }}
            className="text-3xl text-blue-600 dark:text-blue-400 mr-4"
          >
            <Icon />
          </motion.div>
          <h3 className="font-bold text-blue-800 dark:text-blue-300 text-xl">{title}</h3>
        </div>
        <p className="text-gray-600 dark:text-gray-400 mb-4 flex-grow">{description}</p>
        <AnimatePresence>
          {isHovered && period && location && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="text-sm text-blue-700 dark:text-blue-300 italic mt-auto"
            >
              <span>{period}</span> | <span>{location}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

const Projects = () => {
  const titleControls = useAnimation();
  const [titleRef, titleInView] = useInView({ triggerOnce: true, rootMargin: '-100px 0px' });
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (titleInView) {
      titleControls.start('visible');
    }
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDarkMode(prefersDarkMode);

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => setIsDarkMode(e.matches);
    mediaQuery.addListener(handleChange);
    return () => mediaQuery.removeListener(handleChange);
  }, [titleControls, titleInView]);

  const titleVariants = {
    hidden: { opacity: 0, y: -50, rotateX: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      rotateX: 0, 
      transition: { duration: 1, ease: cubicBezier(0.6, 0.05, -0.01, 0.9) } 
    }
  };

  const projects = [
    { title: 'AI-Based Fault Detection', description: 'Developed an AI model to predict and detect faults in smart grids using machine learning techniques.' },
    { title: 'Smart Home Automation', description: 'Designed a home automation system that integrates various IoT devices for enhanced home security and energy management.' },
    { title: 'ML Model For The Ranking', description: 'Developed a machine learning model that predicts a student\'s rank based on their marks.', period: 'May 2023 – June 2023', location: 'Lahore, Pakistan' },
    { title: 'Supermart Management', description: 'Developed a Supermart Management System in Python, facilitating customers, administrators, and cashiers.', period: 'Dec 2022 – April 2023', location: 'Lahore, Pakistan' },
    { title: 'Chat Bot Development', description: 'Developed a real-time chat bot using Google\'s Palm API to answer FAQs.', period: 'July 2023', location: 'Sargodha, Pakistan' },
    { title: 'Visualization of Accidents', description: 'Developed an interactive dashboard in Excel for visualizing accident cases and causes.', period: 'Aug 2023 – Sep 2023', location: 'Sargodha, Pakistan' },
    { title: 'Student LMS', description: 'Developed a comprehensive student management system using DSA.', period: 'Jan 2024 – May 2024', location: 'Lahore, Pakistan' },
    { title: 'Weather CLI', description: 'Developed a command-line interface application for fetching real-time weather data.', period: 'Jan 2024', location: 'PIAIC, Lahore, Pakistan' }
  ];

  const backgroundVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: { 
      pathLength: 1, 
      opacity: 0.1, 
      transition: { duration: 2, ease: 'easeInOut', delay: 0.5 } 
    }
  };

  return (
    <section 
      id="projects" 
      className={`py-24 text-center relative overflow-hidden transition-colors duration-500 ease-in-out ${isDarkMode ? 'bg-gradient-to-br from-gray-900 to-black' : 'bg-gradient-to-br from-blue-50 to-indigo-100'}`}
    >
      <div className="absolute top-0 left-0 w-full h-full">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
          <motion.path 
            fill={isDarkMode ? '#1E40AF' : '#3B82F6'} 
            fillOpacity="1" 
            d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,80C960,64,1056,32,1152,48C1248,64,1344,128,1392,160L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            variants={backgroundVariants}
            initial="hidden"
            animate="visible"
          />
        </svg>
      </div>
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <motion.h2 
          ref={titleRef}
          variants={titleVariants}
          initial="hidden"
          animate={titleControls}
          className={`text-5xl font-black mb-12 inline-block relative ${isDarkMode ? 'text-blue-300' : 'text-blue-800'}`}
        >
          My Project Portfolio
          <motion.span 
            className={`absolute -bottom-2 left-0 w-full h-1.5 ${isDarkMode ? 'bg-blue-500' : 'bg-blue-600'}`}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.5, ease: cubicBezier(0.6, 0.05, -0.01, 0.9), delay: 0.5 }}
          />
        </motion.h2>
        <div className="flex flex-wrap -mx-4">
          {projects.map((project, index) => (
            <ProjectCard key={project.title} {...project} index={index} />
          ))}
        </div>
        <motion.p 
          className={`mt-12 italic ${isDarkMode ? 'text-blue-300' : 'text-blue-700'}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: cubicBezier(0.6, 0.05, -0.01, 0.9), delay: 1.5 }}
        >
          Each project is a step forward, a challenge overcome, a lesson learned.
        </motion.p>
      </div>
      <button 
        onClick={() => setIsDarkMode(!isDarkMode)} 
        className={`fixed bottom-4 right-4 p-3 rounded-full text-white transition-all duration-500 ease-in-out transform hover:scale-110 hover:rotate-12 ${isDarkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-indigo-600 hover:bg-indigo-700'}`}
      >
        {isDarkMode ? '🌙' : '☀️'}
      </button>
    </section>
  );
};

export default Projects;