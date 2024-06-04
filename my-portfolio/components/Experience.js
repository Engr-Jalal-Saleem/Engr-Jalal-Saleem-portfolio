import { useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const ExperienceCard = ({ period, title, description, index }) => {
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
      <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-green-500 to-blue-700"></div>
      <span className="text-gray-500 text-sm mb-2 block">{period}</span>
      <h3 className="text-2xl font-bold text-blue-800 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
      <div className="absolute bottom-0 right-0 w-16 h-16 bg-green-100 rounded-tl-full opacity-50 transform translate-x-1/2 translate-y-1/2"></div>
    </motion.div>
  );
};

const Experience = () => {
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

  const experienceData = [
    { period: 'Jun 2021 – Present', title: 'Social Media Manager @ JS Digital Marketer', description: 'Worked on Facebook, Instagram, and X as a Social Media Manager.' },
    { period: 'January 2022 – Present', title: 'Poster Designer', description: 'Worked on Facebook and Instagram as a Poster Designer, creating social media posts, posters, banners, and thumbnails.' },
    { period: 'Feb 2020 – May 2021', title: 'Content Creator @ XYZ Media', description: 'Developed engaging content for social media platforms, increasing engagement by 30%.' },
    { period: 'Sep 2019 – Jan 2020', title: 'Graphic Designer @ ABC Designs', description: 'Designed graphics for various marketing campaigns and collaborated with the marketing team to enhance visual communication.' }
  ];

  return (
    <section id="experience" className="py-24 text-center bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
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
          Experience
          <span className="absolute -bottom-2 left-0 w-full h-1 bg-green-500 transform origin-left" style={{
            scaleX: isLoaded ? 1 : 0,
            transition: 'transform 1s ease-out 0.5s'
          }}></span>
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {experienceData.map((exp, index) => (
            <ExperienceCard key={exp.title} {...exp} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;
