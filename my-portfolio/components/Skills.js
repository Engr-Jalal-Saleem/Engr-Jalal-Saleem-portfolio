import { useEffect, useState } from 'react';
import { motion, useAnimation, AnimatePresence, cubicBezier } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { 
  FaPython, FaCode, FaHtml5, FaCss3Alt, FaMicrochip, 
  FaBrain, FaChartBar, FaChartLine, FaPalette, FaComment, 
  FaCircuit, FaDraftingCompass, FaMobileAlt, FaCalculator
} from 'react-icons/fa';

// Original icon map, can be extended or modified as needed
const defaultIconMap = {
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

const SkillCard = ({ skill, proficiency, index, iconMap = {} }) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({ triggerOnce: true, rootMargin: '-50px 0px' });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  const combinedIconMap = { ...defaultIconMap, ...iconMap };
  const Icon = combinedIconMap[skill] || FaCode;

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

  const barVariants = {
    hidden: { width: 0 },
    visible: { 
      width: `${proficiency}%`, 
      transition: { 
        duration: 1.5, 
        ease: cubicBezier(0.12, 0, 0.39, 0),
        delay: index * 0.1 + 0.3 
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
      className="w-64 mb-10 mx-4"
    >
      <motion.div 
        variants={containerVariants}
        initial="rest"
        whileHover="hover"
        className="p-6 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105"
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
          <h3 className="font-bold text-blue-800 dark:text-blue-300 text-lg truncate flex-1" title={skill}>{skill}</h3>
        </div>
        <div className="relative h-4 bg-blue-200 dark:bg-blue-900 rounded-full overflow-hidden">
          <AnimatePresence>
            {isHovered && (
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 text-xs font-semibold text-blue-700 dark:text-blue-300 bg-white dark:bg-gray-800 px-2 py-1 rounded shadow"
              >
                {proficiency}%
              </motion.span>
            )}
          </AnimatePresence>
          <motion.div 
            variants={barVariants}
            initial="hidden"
            animate={controls}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full cursor-pointer"
          />
        </div>
      </motion.div>
    </motion.div>
  );
};

const SkillsTemplate = ({ title, subtitle, skills = [], darkModePreference = null }) => {
  const titleControls = useAnimation();
  const [titleRef, titleInView] = useInView({ triggerOnce: true, rootMargin: '-100px 0px' });
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (titleInView) {
      titleControls.start('visible');
    }
    if (darkModePreference !== null) {
      setIsDarkMode(darkModePreference);
    } else {
      const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDarkMode(prefersDarkMode);
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      if (darkModePreference === null) {
        setIsDarkMode(e.matches);
      }
    };
    mediaQuery.addListener(handleChange);
    return () => mediaQuery.removeListener(handleChange);
  }, [titleControls, titleInView, darkModePreference]);

  const titleVariants = {
    hidden: { opacity: 0, y: -50, rotateX: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      rotateX: 0, 
      transition: { duration: 1, ease: cubicBezier(0.6, 0.05, -0.01, 0.9) } 
    }
  };

  const backgroundVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: { 
      pathLength: 1, 
      opacity: 0.1, 
      transition: { duration: 2, ease: 'easeInOut', delay: 0.5 } 
    }
  };

  // Original skills data
  const defaultSkills = [
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

  const combinedSkills = skills.length > 0 ? skills : defaultSkills;

  return (
    <section 
      id="skills" 
      className={`py-24 text-center relative overflow-hidden transition-colors duration-500 ease-in-out ${isDarkMode ? 'bg-gradient-to-br from-gray-900 to-black' : 'bg-gradient-to-br from-blue-50 to-indigo-100'}`}
    >
      <div className="absolute top-0 left-0 w-full h-full">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
          <motion.path 
            fill={isDarkMode ? '#1E40AF' : '#3B82F6'} 
            fillOpacity="1" 
            d="M0,160L48,165.3C96,171,192,181,288,154.7C384,128,480,64,576,74.7C672,85,768,171,864,202.7C960,235,1056,213,1152,181.3C1248,149,1344,107,1392,85.3L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
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
          {title || 'My Skills Arsenal'}
          <motion.span 
            className={`absolute -bottom-2 left-0 w-full h-1.5 ${isDarkMode ? 'bg-blue-500' : 'bg-blue-600'}`}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.5, ease: cubicBezier(0.6, 0.05, -0.01, 0.9), delay: 0.5 }}
          />
        </motion.h2>
        <div className="flex flex-wrap justify-center -mx-4">
          {combinedSkills.map((skill, index) => (
            <SkillCard key={skill.skill} {...skill} index={index} />
          ))}
        </div>
        <motion.p 
          className={`mt-12 italic ${isDarkMode ? 'text-blue-300' : 'text-blue-700'}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: cubicBezier(0.6, 0.05, -0.01, 0.9), delay: 1.5 }}
        >
          {subtitle || 'Always learning, always growing. The journey never ends.'}
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

export default SkillsTemplate;