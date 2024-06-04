import { useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const ProjectCard = ({ title, description, period, location, index }) => {
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
      transition: { 
        type: 'spring', 
        stiffness: 60, 
        damping: 10, 
        delay: index * 0.1 
      } 
    }
  };

  return (
    <motion.div 
      ref={ref}
      variants={cardVariants}
      initial="hidden"
      animate={controls}
      whileHover={{ scale: 1.05, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)" }}
      className="bg-white p-8 rounded-lg shadow-md transition-all duration-300 ease-in-out relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-blue-500 to-blue-700"></div>
      <h3 className="text-2xl font-bold mb-3 text-blue-800">{title}</h3>
      <p className="text-gray-600 mb-4 leading-relaxed">{description}</p>
      {period && location && (
        <div className="text-sm text-gray-500 italic">
          <span>{period}</span> | <span>{location}</span>
        </div>
      )}
      <div className="absolute bottom-0 right-0 w-16 h-16 bg-blue-200 rounded-tl-full opacity-50 transform translate-x-1/2 translate-y-1/2"></div>
    </motion.div>
  );
};

const Projects = () => {
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

  const projects = [
    { title: 'AI-Based Fault Detection in Smart Grids', description: 'Developed an AI model to predict and detect faults in smart grids using machine learning techniques.' },
    { title: 'Smart Home Automation System', description: 'Designed a home automation system that integrates various IoT devices for enhanced home security and energy management.' },
    { title: 'ML Model For The Ranking', description: 'I developed a machine learning model that predicts a student\'s rank based on their marks. The model was trained using a dataset of student marks and ranks. I utilized libraries such as pandas, numpy, matplotlib, plotly express, and scikit-learn in the development of this project.', period: 'May 2023 – June 2023', location: 'Lahore, Pakistan' },
    { title: 'Supermart Management Store', description: 'As part of my semester project, I developed a Supermart Management System in Python. The system facilitates customers, administrators, and cashiers, featuring an inventory database, secure login credentials, and file handling for data persistence.', period: 'Dec 2022 – April 2023', location: 'Lahore, Pakistan' },
    { title: 'Chat Bot Development using Google\'s Palm API', description: 'Developed a real-time chat bot using Google\'s Palm API. The bot is designed to answer FAQs and provide information, demonstrating the practical application of advanced APIs in communication tools.', period: 'July 2023', location: 'Sargodha, Pakistan' },
    { title: 'Visualization of Accidents & Causes', description: 'I developed an interactive dashboard in Excel for a project titled "Visualization of Accidents & Causes". The dashboard provides insights into accident cases, causes, and death rates.', period: 'Aug 2023 – Sep 2023', location: 'Sargodha, Pakistan' },
    { title: 'Student LMS, Semester Project', description: 'Developed a comprehensive student management system using DSA, featuring functionalities to add, delete, search, update, and display student records, as well as sort by CGPA and name. Implemented file operations for saving and loading data.', period: 'Jan 2024 – May 2024', location: 'Lahore, Pakistan' },
    { title: 'Weather CLI Based Application', description: 'I developed a command-line interface application, "Weather CLI", using Node.js, TypeScript, and the OpenWeatherMap API. The application fetches real-time weather data for a specified city.', period: 'Jan 2024', location: 'PIAIC, Lahore, Pakistan' }
  ];

  return (
    <section id="projects" className="py-24 bg-gradient-to-br from-gray-100 to-blue-50 text-center relative overflow-hidden">
      <div className="absolute top-0 right-0 w-full h-full opacity-10 transform -scale-x-100">
        <svg className="w-full h-full text-blue-300" viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg">
          <path fill="currentColor" d="M0,288L48,272C96,256,192,224,288,186.7C384,149,480,96,576,117.3C672,139,768,235,864,234.7C960,235,1056,171,1152,144C1280,107,1360,75,1400,58.7L1440,43L1440,320L0,320Z"></path>
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
          My Project Portfolio
          <span 
            className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-blue-700"
            style={{ transform: titleInView ? 'scaleX(1)' : 'scaleX(0)', transformOrigin: 'left', transition: 'transform 1s ease-out 0.5s' }}
          ></span>
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <ProjectCard key={project.title} {...project} index={index} />
          ))}
        </div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="mt-12 text-gray-600 italic"
        >
          Each project is a step forward, a challenge overcome, a lesson learned.
        </motion.p>
      </div>
    </section>
  );
};

export default Projects;