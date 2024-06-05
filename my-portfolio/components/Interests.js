import { useEffect, useState } from 'react';
import { motion, useAnimation, AnimatePresence, cubicBezier } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { 
  FaLaptopCode, FaLightbulb, FaProjectDiagram, FaBrain, 
  FaRobot, FaPuzzlePiece, FaUsers, FaGraduationCap 
} from 'react-icons/fa';

const iconMap = {
  'Technology': FaLaptopCode,
  'Innovation': FaLightbulb,
  'Project Management': FaProjectDiagram,
  'Continuous Learning': FaBrain,
  'Artificial Intelligence': FaRobot,
  'Problem Solving': FaPuzzlePiece,
  'Team Leadership': FaUsers,
  'Education': FaGraduationCap
};

const InterestCard = ({ title, description, index }) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({ triggerOnce: true, rootMargin: '-50px 0px' });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  const Icon = iconMap[title] || FaCode;

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
      backgroundColor: '#F0F5FF', 
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      transition: { duration: 0.3, ease: 'easeOut' }
    }
  };

  const proficiency = 75 + Math.floor(Math.random() * 26); // Random proficiency between 75 and 100

  return (
    <motion.div 
      ref={ref}
      variants={cardVariants}
      initial="hidden"
      animate={controls}
      className="w-full md:w-1/2 lg:w-1/4 p-4"
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
            className="text-3xl text-indigo-600 dark:text-indigo-400 mr-4"
          >
            <Icon />
          </motion.div>
          <h3 className="font-bold text-indigo-800 dark:text-indigo-300 text-xl">{title}</h3>
        </div>
        <p className="text-gray-600 dark:text-gray-400 mb-4 flex-grow">{description}</p>
        <div className="relative h-4 bg-indigo-200 dark:bg-indigo-900 rounded-full overflow-hidden">
          <AnimatePresence>
            {isHovered && (
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 text-xs font-semibold text-indigo-700 dark:text-indigo-300 bg-white dark:bg-gray-800 px-2 py-1 rounded shadow"
              >
                {proficiency}%
              </motion.span>
            )}
          </AnimatePresence>
          <motion.div 
            style={{ width: `${proficiency}%` }}
            initial={{ scaleX: 0 }}
            animate={controls}
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full"
            transition={{ duration: 1.5, ease: cubicBezier(0.12, 0, 0.39, 0), delay: index * 0.1 + 0.3 }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
          />
        </div>
      </motion.div>
    </motion.div>
  );
};

const Interests = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDarkMode(prefersDarkMode);

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => setIsDarkMode(e.matches);
    mediaQuery.addListener(handleChange);
    return () => mediaQuery.removeListener(handleChange);
  }, []);

  const titleControls = useAnimation();
  const [titleRef, titleInView] = useInView({ triggerOnce: true, rootMargin: '-100px 0px' });

  useEffect(() => {
    if (titleInView) {
      titleControls.start('visible');
    }
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

  const interestsData = [
    { title: 'Technology', description: 'Exploring new tech and working on innovative projects.', index: 0 },
    { title: 'Innovation', description: 'Tackling complex problems with efficient solutions.', index: 1 },
    { title: 'Project Management', description: 'Leading projects to successful completion.', index: 2 },
    { title: 'Continuous Learning', description: 'Always expanding my knowledge base.', index: 3 },
    { title: 'Artificial Intelligence', description: 'Exploring the frontiers of AI.', index: 4 },
    { title: 'Problem Solving', description: 'Cracking complex puzzles.', index: 5 },
    { title: 'Team Leadership', description: 'Guiding teams to victory.', index: 6 },
    { title: 'Education', description: 'Sharing knowledge with others.', index: 7 }
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
      id="interests" 
      className={`py-24 text-center relative overflow-hidden transition-colors duration-500 ease-in-out ${isDarkMode ? 'bg-gradient-to-br from-gray-900 to-black' : 'bg-gradient-to-br from-indigo-50 to-blue-100'}`}
    >
      <div className="absolute top-0 right-0 w-full h-full opacity-10 transform scale-x-100">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
          <motion.path 
            fill={isDarkMode ? '#1E40AF' : '#3B82F6'} 
            fillOpacity="1"
            d="M0,192L60,208C120,224,240,256,360,261.3C480,267,600,245,720,240C840,235,960,245,1080,218.7C1200,192,1320,128,1380,96L1440,64L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
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
          className={`text-5xl font-black mb-12 inline-block relative ${isDarkMode ? 'text-indigo-300' : 'text-indigo-800'}`}
        >
          My Interests Arsenal
          <motion.span 
            className={`absolute -bottom-2 left-0 w-full h-1.5 ${isDarkMode ? 'bg-indigo-500' : 'bg-indigo-600'}`}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.5, ease: cubicBezier(0.6, 0.05, -0.01, 0.9), delay: 0.5 }}
          />
        </motion.h2>
        <div className="flex flex-wrap -mx-4">
          {interestsData.map((interest, index) => (
            <InterestCard key={interest.title} {...interest} index={index} />
          ))}
        </div>
        <motion.p 
          className={`mt-12 italic ${isDarkMode ? 'text-indigo-300' : 'text-indigo-700'}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: cubicBezier(0.6, 0.05, -0.01, 0.9), delay: 1.5 }}
        >
          Curiosity drives me, passion guides me, growth defines me.
        </motion.p>
      </div>
      <button 
        onClick={() => setIsDarkMode(!isDarkMode)} 
        className={`fixed bottom-4 right-4 p-3 rounded-full text-white transition-all duration-500 ease-in-out transform hover:scale-110 hover:rotate-12 ${isDarkMode ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-blue-600 hover:bg-blue-700'}`}
      >
        {isDarkMode ? '🌙' : '☀️'}
      </button>
    </section>
  );
};

export default Interests;