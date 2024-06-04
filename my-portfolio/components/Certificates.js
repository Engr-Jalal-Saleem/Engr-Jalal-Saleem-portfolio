import { useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const CertificateCard = ({ title, description, link, index }) => {
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
        duration: 0.6, 
        ease: 'easeOut', 
        delay: index * 0.2 
      } 
    }
  };

  return (
    <motion.div 
      ref={ref}
      variants={cardVariants}
      initial="hidden"
      animate={controls}
      className="bg-white p-8 rounded-lg shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 duration-300 ease-in-out relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-purple-500 to-purple-700"></div>
      <h3 className="text-2xl font-bold text-purple-800 mb-2">{title}</h3>
      <p className="text-gray-600 text-xl mb-4">{description}</p>
      <a href={link} target="_blank" rel="noopener noreferrer">
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Verify
        </button>
      </a>
      <div className="absolute bottom-0 right-0 w-16 h-16 bg-purple-100 rounded-tl-full opacity-50 transform translate-x-1/2 translate-y-1/2"></div>
    </motion.div>
  );
};

const Certificates = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

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

  const certificatesData = [
    { title: 'Data Analyst and Business Intelligence', description: 'Completed a comprehensive data analysis course using Python from DigiSkills.', link: 'https://digiskills.pk/verify/' },
    { title: 'Data Analyst Skillpath: Excel, SQL & ML with Python in हिंदी', description: 'Gained expertise in machine learning algorithms and techniques through a detailed Coursera course.', link: 'https://www.udemy.com/certificate/UC-94cab125-cd34-4e1b-b99d-bdc3091d4c6f/' },
    { title: 'Communication and Soft Skills', description: 'Gained expertise in machine learning algorithms and techniques through a detailed Coursera course.', link: 'https://digiskills.pk/verify/' },
    { title: 'Freelancing', description: 'Gained expertise in machine learning algorithms and techniques through a detailed Coursera course.', link: 'https://digiskills.pk/verify/' },
    { title: 'Play It Safe: Manage Security Risks', description: 'Gained expertise in machine learning algorithms and techniques through a detailed Coursera course.', link: 'https://www.coursera.org/account/accomplishments/certificate/2A4AUES7GAXD' },
    { title: 'Brain Hacking Presentations Skills', description: 'Gained expertise in machine learning algorithms and techniques through a detailed Coursera course.', link: 'https://www.udemy.com/certificate/UC-aeeaa2bf-7959-42bf-a8f6-9531e9747c73/' },
    { title: 'MATLAB Onramp', description: 'Gained expertise in machine learning algorithms and techniques through a detailed Coursera course.', link: 'https://matlabacademy.mathworks.com/progress/share/certificate.html?id=361f3c11-71ff-4df2-aa61-34c2ea683ced&' },
    { title: 'Creating Video Lessons with Online Video Maker InVideo', description: 'Gained expertise in machine learning algorithms and techniques through a detailed Coursera course.', link: 'https://www.udemy.com/certificate/UC-aeeaa2bf-7959-42bf-a8f6-9531e9747c73/' },
    { title: 'Foundations of Cybersecurity', description: 'Gained expertise in machine learning algorithms and techniques through a detailed Coursera course.', link: 'https://www.coursera.org/account/accomplishments/certificate/6AH8D7CPDTRV' },
    { title: 'TypeScript Variables and Data Types', description: 'Learn TypeScript Variables and Different ways to declare them. Understand differences between var, let and const and Scope of variables. Understand TypeScript Data Types.', link: 'https://www.coursera.org/account/accomplishments/verify/YMN65MXM5DJC' }
  ];

  return (
    <section id="certificates" className="py-24 text-center bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full">
        <svg className="w-full h-full text-gray-200 opacity-70 transform -scale-x-100" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
          <path fill="currentColor" fillOpacity="1" d="M0,224L80,186.7C160,149,320,75,480,80C640,85,800,171,960,192C1120,213,1280,171,1360,149.3L1440,128L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"></path>
        </svg>
      </div>
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <motion.h2 
          ref={titleRef}
          variants={titleVariants}
          initial="hidden"
          animate={titleControls}
          className="text-4xl font-extrabold mb-8 text-gray-900 inline-block relative"
        >
          Certificates
          <span className="absolute -bottom-2 left-0 w-full h-1 bg-purple-500 transform origin-left" style={{
            scaleX: isLoaded ? 1 : 0,
            transition: 'transform 1s ease-out 0.5s'
          }}></span>
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {certificatesData.map((certificate, index) => (
            <CertificateCard key={certificate.title} {...certificate} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Certificates;
