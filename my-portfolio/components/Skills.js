import { useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const SkillCard = ({ skill, proficiency, index }) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({ triggerOnce: true, rootMargin: '-50px 0px' });

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.6, ease: 'easeOut', delay: index * 0.1 } 
    }
  };

  const barVariants = {
    hidden: { width: 0 },
    visible: { 
      width: `${proficiency}%`, 
      transition: { duration: 1, ease: 'easeInOut', delay: index * 0.1 + 0.3 } 
    }
  };

  return (
    <motion.div 
      ref={ref}
      variants={cardVariants}
      initial="hidden"
      animate={controls}
      className="w-48 mb-8"
    >
      <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 ease-in-out transform hover:scale-105 hover:bg-blue-50">
        <h3 className="font-semibold text-blue-800 text-center mb-4 truncate" title={skill}>{skill}</h3>
        <div className="relative h-4 bg-blue-200 rounded-full overflow-hidden">
          <motion.div 
            variants={barVariants}
            initial="hidden"
            animate={controls}
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
          />
        </div>
      </div>
    </motion.div>
  );
};

const Skills = () => {
  const titleControls = useAnimation();
  const [titleRef, titleInView] = useInView({ triggerOnce: true, rootMargin: '-100px 0px' });

  useEffect(() => {
    if (titleInView) {
      titleControls.start('visible');
    }
  }, [titleControls, titleInView]);

  const titleVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } }
  };

  const skills = [
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
    { skill: "Circuit Design and Analysis", proficiency: 75 },
    { skill: "Proficiency in CAD Software", proficiency: 75 },
    { skill: "Semiconductor Devices", proficiency: 75 },
    { skill: "MATLAB", proficiency: 40 },
    { skill: "Proteus / Multisim", proficiency: 75 },
    { skill: "Signal Processing", proficiency: 75 }
  ];

  return (
    <section 
      id="skills" 
      className="py-24 bg-gradient-to-br from-blue-50 to-gray-100 text-center relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-full h-full opacity-10">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
          <path fill="#4299E1" fillOpacity="1" d="M0,160L48,165.3C96,171,192,181,288,154.7C384,128,480,64,576,74.7C672,85,768,171,864,202.7C960,235,1056,213,1152,181.3C1248,149,1344,107,1392,85.3L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
      </div>
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <motion.h2 
          ref={titleRef}
          variants={titleVariants}
          initial="hidden"
          animate={titleControls}
          className="text-4xl font-extrabold mb-12 text-blue-900 inline-block relative"
        >
          My Skills Arsenal
          <span 
            className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-blue-700"
            style={{ transform: titleInView ? 'scaleX(1)' : 'scaleX(0)', transformOrigin: 'left', transition: 'transform 1s ease-out 0.5s' }}
          ></span>
        </motion.h2>
        <div className="flex flex-wrap justify-center -mx-4">
          {skills.map(({ skill, proficiency }, index) => (
            <SkillCard key={skill} skill={skill} proficiency={proficiency} index={index} />
          ))}
        </div>
        <p 
          className="mt-12 text-gray-600 italic opacity-0"
          style={{ 
            animation: titleInView ? 'fadeIn 1s ease-out 1.5s forwards' : 'none'
          }}
        >
          Always learning, always growing. The journey never ends.
        </p>
      </div>
    </section>
  );
};

export default Skills;