import React, { useEffect, useState } from 'react';
import { motion, useAnimation, AnimatePresence, cubicBezier } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { 
  FaPython, FaCode, FaHtml5, FaCss3Alt, FaMicrochip, 
  FaBrain, FaChartBar, FaChartLine, FaPalette, FaComment, 
  FaCircuit, FaDraftingCompass, FaMobileAlt, FaCalculator
} from 'react-icons/fa';

const iconMap = {
  'Python': FaPython,
  'C++ / C': FaCode,
  'TypeScript': FaCode,
  'JavaScript': FaCode,
  'HTML': FaHtml5,
  'CSS': FaCss3Alt,
  'VHDL / HDL': FaMicrochip,
  'Machine Learning': FaBrain,
  'Power BI': FaChartBar,
  'Data Analytics': FaChartLine,
  'Data Visualization': FaChartBar,
  'Poster Designer': FaPalette,
  'Prompt Engineering': FaComment,
  'Circuit Design': FaCircuit,
  'CAD Software': FaDraftingCompass,
  'Semiconductor': FaMobileAlt,
  'MATLAB': FaCalculator,
  'Proteus / Multisim': FaCircuit,
  'Signal Processing': FaChartLine
};

const SkillCard = ({ skill, proficiency, index }) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({ triggerOnce: true, rootMargin: '-50px 0px' });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  const Icon = iconMap[skill] || FaCode;

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
      className="bg-white dark:bg-gray-800 p-6 rounded-lg relative overflow-hidden group w-full md:w-1/2 lg:w-1/3"
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
        <div className="flex items-center mb-4">
          <Icon className="text-3xl text-blue-600 dark:text-blue-400 mr-4 group-hover:text-white" />
          <h3 className="text-xl font-bold text-blue-800 dark:text-blue-300 group-hover:text-white">{skill}</h3>
        </div>
        <div className="relative h-4 bg-blue-200 dark:bg-blue-900 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${proficiency}%` }}
            transition={{ duration: 1.5, ease: cubicBezier(0.12, 0, 0.39, 0), delay: index * 0.3 + 0.3 }}
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"
          />
        </div>
        <AnimatePresence>
          {isHovered && (
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 text-sm font-semibold text-blue-700 dark:text-blue-300 bg-white dark:bg-gray-800 px-2 py-1 rounded shadow group-hover:text-white"
            >
              {proficiency}%
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

const Skills = () => {
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

  const skillsData = [
    { skill: "Python", proficiency: 75 },
    { skill: "C++ / C", proficiency: 75 },
    { skill: "TypeScript", proficiency: 60 },
    { skill: "JavaScript", proficiency: 60 },
    { skill: "HTML", proficiency: 75 },
    { skill: "CSS", proficiency: 75 },
    { skill: "VHDL / HDL", proficiency: 75 },
    { skill: "Machine Learning", proficiency: 75 },
    { skill: "Power BI", proficiency: 75 },
    { skill: "Data Analytics", proficiency: 100 },
    { skill: "Data Visualization", proficiency: 75 },
    { skill: "Poster Designer", proficiency: 75 },
    { skill: "Prompt Engineering", proficiency: 75 },
    { skill: "Circuit Design", proficiency: 75 },
    { skill: "CAD Software", proficiency: 75 },
    { skill: "Semiconductor", proficiency: 75 },
    { skill: "MATLAB", proficiency: 40 },
    { skill: "Proteus / Multisim", proficiency: 75 },
    { skill: "Signal Processing", proficiency: 75 }
  ];

  return (
    <section id="skills" className={`py-24 text-center relative overflow-hidden transition-colors duration-500 ease-in-out ${isDarkMode ? 'bg-gradient-to-br from-gray-900 to-black' : 'bg-gradient-to-br from-blue-100 to-indigo-200'}`}>
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
          My Skills Arsenal
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
        <div className="flex flex-wrap -mx-4">
          {skillsData.map((skill, index) => (
            <SkillCard key={skill.skill} {...skill} index={index} />
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

export default Skills;