import { useEffect, useRef, useState } from 'react';
import { motion, useAnimation, AnimatePresence, cubicBezier } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FaBolt, FaBrain, FaChartLine, FaCode, FaPalette, FaBullhorn } from 'react-icons/fa';

const skillsData = [
  { name: 'Electrical Engineering', icon: FaBolt, color: 'from-yellow-400 to-orange-500' },
  { name: 'Machine Learning', icon: FaBrain, color: 'from-green-400 to-blue-500' },
  { name: 'Data Analysis', icon: FaChartLine, color: 'from-blue-400 to-indigo-500' },
  { name: 'Programming', icon: FaCode, color: 'from-purple-400 to-pink-500' },
  { name: 'Graphic Design', icon: FaPalette, color: 'from-pink-400 to-red-500' },
  { name: 'Social Media Marketing', icon: FaBullhorn, color: 'from-orange-400 to-yellow-500' },
];

const SkillBadge = ({ skill, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDarkMode(prefersDarkMode);

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => setIsDarkMode(e.matches);
    mediaQuery.addListener(handleChange);
    return () => mediaQuery.removeListener(handleChange);
  }, []);

  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ 
        duration: 0.6, 
        ease: cubicBezier(0.6, 0.05, -0.01, 0.9), 
        delay: index * 0.1 + 0.8 
      }}
      whileHover={{ scale: 1.1, rotate: [0, -5, 5, -5, 0], transition: { duration: 0.5 } }}
      className={`inline-flex items-center px-3 py-2 m-2 rounded-full text-sm font-semibold cursor-pointer relative overflow-hidden ${isDarkMode ? 'text-white shadow-lg' : 'text-gray-800 bg-white shadow-md'}`}
      style={{ backgroundImage: `linear-gradient(to right, ${skill.color})` }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <skill.icon className="mr-2 text-lg" />
      {skill.name}
      <AnimatePresence>
        {isHovered && (
          <motion.span
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.2 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            style={{ backgroundImage: `linear-gradient(to right, ${skill.color})` }}
            className="absolute inset-0 rounded-full"
          />
        )}
      </AnimatePresence>
    </motion.span>
  );
};

const About = () => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: true,
    rootMargin: '-100px 0px',
  });

  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDarkMode(prefersDarkMode);

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => setIsDarkMode(e.matches);
    mediaQuery.addListener(handleChange);

    setIsLoaded(true);

    return () => mediaQuery.removeListener(handleChange);
  }, [controls, inView]);

  const titleVariants = {
    hidden: { opacity: 0, y: -50, rotateX: -15 },
    visible: { 
      opacity: 1, 
      y: 0, 
      rotateX: 0, 
      transition: { duration: 0.8, ease: cubicBezier(0.6, 0.05, -0.01, 0.9) } 
    },
  };

  const textVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.8, ease: cubicBezier(0.6, 0.05, -0.01, 0.9), delay: 0.4 } 
    },
  };

  const backgroundVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: { 
      pathLength: 1, 
      opacity: 1, 
      transition: { duration: 2, ease: 'easeInOut', delay: 0.5 } 
    }
  };

  return (
    <section id="about" className={`py-24 text-center relative overflow-hidden transition-colors duration-500 ease-in-out ${isDarkMode ? 'bg-gradient-to-br from-gray-900 to-black' : 'bg-gradient-to-br from-purple-50 to-indigo-100'}`}>
      <div className="absolute top-0 left-0 w-full h-full">
        <svg className="w-full h-full opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
          <motion.path 
            fill={isDarkMode ? '#4338CA' : '#8B5CF6'} 
            fillOpacity="1" 
            d="M0,224L80,197.3C160,171,320,117,480,90.7C640,64,800,64,960,74.7C1120,85,1280,107,1360,117.3L1440,128L1440,0L1360,0C1280,0,1120,0,960,0C800,0,640,0,480,0C320,0,160,0,80,0L0,0Z"
            variants={backgroundVariants}
            initial="hidden"
            animate="visible"
          />
        </svg>
      </div>
      <div className="max-w-4xl mx-auto px-6 relative z-10" ref={ref}>
        <motion.h2 
          className={`text-5xl font-black mb-8 relative inline-block ${isDarkMode ? 'text-purple-300' : 'text-indigo-800'}`}
          variants={titleVariants}
          initial="hidden"
          animate={controls}
        >
          About Me
          <motion.span 
            className={`absolute -bottom-2 left-0 w-full h-1.5 ${isDarkMode ? 'bg-purple-500' : 'bg-indigo-600'}`}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: isLoaded ? 1 : 0 }}
            transition={{ duration: 1.2, ease: cubicBezier(0.6, 0.05, -0.01, 0.9), delay: 1 }}
          />
        </motion.h2>
        <motion.p 
          className={`text-lg mb-12 leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}
          variants={textVariants}
          initial="hidden"
          animate={controls}
        >
          I&apos;m Engr. Jalal Saleem, a passionate student with a kaleidoscope of skills. My journey through tech and design has painted me with a unique blend of analytical precision and creative flair. I don&apos;t just crunch data; I turn it into a compass, guiding campaigns to their true north and illuminating the path to informed decisions. As an Electrical Engineering student, I see beyond circuits—I see complex systems that have taught me to untangle even the most knotted problems. I&apos;m not just eager to collaborate; I&apos;m excited to weave my thread into the tapestry of innovative projects that leave a lasting impact. Let&apos;s not just innovate—let&apos;s create a masterpiece together!
        </motion.p>
        <motion.h3 
          className={`text-3xl font-bold mb-8 ${isDarkMode ? 'text-purple-400' : 'text-indigo-700'}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: cubicBezier(0.6, 0.05, -0.01, 0.9), delay: 0.9 }}
        >
          My Skills Arsenal
        </motion.h3>
        <div className="flex flex-wrap justify-center">
          {skillsData.map((skill, index) => (
            <SkillBadge key={skill.name} skill={skill} index={index} />
          ))}
        </div>
      </div>
      <button 
        onClick={() => setIsDarkMode(!isDarkMode)} 
        className={`fixed bottom-4 right-4 p-3 rounded-full text-white transition-all duration-500 ease-in-out transform hover:scale-110 hover:rotate-12 ${isDarkMode ? 'bg-purple-600 hover:bg-purple-700' : 'bg-indigo-600 hover:bg-indigo-700'}`}
      >
        {isDarkMode ? '🌙' : '☀️'}
      </button>
    </section>
  );
};

export default About;