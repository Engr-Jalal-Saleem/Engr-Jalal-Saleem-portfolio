import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes, faCode, faBolt, faPalette, faHeart, faRocket } from '@fortawesome/free-solid-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';

library.add(faBars, faTimes, faCode, faBolt, faPalette, faHeart, faRocket);

const navItems = [
  { href: "#home", label: "Home", icon: faRocket, color: "from-pink-500 to-red-500" },
  { href: "#about", label: "About", icon: faHeart, color: "from-red-500 to-orange-500" },
  { href: "#education", label: "Education", icon: faCode, color: "from-orange-500 to-yellow-500" },
  { href: "#skills", label: "Skills", icon: faBolt, color: "from-yellow-500 to-green-500" },
  { href: "#projects", label: "Projects", icon: faPalette, color: "from-green-500 to-teal-500" },
  { href: "#experience", label: "Experience", icon: faCode, color: "from-teal-500 to-blue-500" },
  { href: "#certificates", label: "Certificates", icon: faBolt, color: "from-blue-500 to-indigo-500" },
  { href: "#interests", label: "Interests", icon: faHeart, color: "from-indigo-500 to-purple-500" },
  { href: "#contact", label: "Contact", icon: faRocket, color: "from-purple-500 to-pink-500" }
];

const NavItem = ({ href, label, icon, color, onClick, isActive }) => (
  <li className="group">
    <Link 
      href={href}
      onClick={onClick}
      className={`flex items-center py-2 px-4 rounded-full transition-all duration-500 ease-in-out transform hover:scale-110 hover:shadow-lg ${
        isActive 
          ? `bg-gradient-to-r ${color} text-white font-bold` 
          : 'text-gray-700 group-hover:text-white group-hover:bg-gradient-to-r group-hover:' + color
      }`}
    >
      <FontAwesomeIcon icon={icon} className={`w-4 h-4 mr-2 transition-transform duration-500 ease-bounce ${isActive ? 'animate-ping' : 'group-hover:animate-bounce'}`} />
      <span className="relative">
        {label}
        <span className="absolute inset-x-0 bottom-0 h-0.5 bg-white transform scale-x-0 origin-left transition-transform duration-500 ease-out group-hover:scale-x-100" />
      </span>
    </Link>
  </li>
);

function Header() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const headerRef = useRef(null);

  const handleScroll = () => {
    const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
    const currentScroll = window.scrollY;
    setScrollProgress(currentScroll / totalScroll);

    const sections = navItems.map(item => item.href.slice(1));
    const scrollPosition = window.scrollY + 200;

    for (let i = sections.length - 1; i >= 0; i--) {
      const section = document.getElementById(sections[i]);
      if (section && section.offsetTop <= scrollPosition) {
        setActiveSection(sections[i]);
        break;
      }
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMenuOpen(window.innerWidth > 768);
      if (window.innerWidth > 768) setIsMenuOpen(true);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleNavClick = () => {
    if (window.innerWidth <= 768) setIsMenuOpen(false);
  };

  return (
    <header 
      ref={headerRef}
      className="fixed w-full z-50 transition-all duration-1000 ease-in-out bg-white bg-opacity-80 backdrop-filter backdrop-blur-lg shadow-xl"
      style={{
        background: `linear-gradient(90deg, rgba(219, 39, 119, ${scrollProgress}) 0%, rgba(124, 58, 237, ${scrollProgress}) 100%)`,
        boxShadow: `0 4px 6px rgba(0, 0, 0, ${0.1 + scrollProgress * 0.1}), 0 1px 3px rgba(0, 0, 0, ${0.08 + scrollProgress * 0.08})`
      }}
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <div 
            className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-500 transition-all duration-1000"
            style={{
              backgroundPositionX: `${scrollProgress * 100}%`
            }}
          >
            Engr. Jalal Saleem
          </div>
          <button 
            className="md:hidden text-white focus:outline-none"
            onClick={toggleMenu}
            aria-label={isMenuOpen ? "Close Menu" : "Open Menu"}
          >
            <FontAwesomeIcon 
              icon={isMenuOpen ? faTimes : faBars} 
              className="w-6 h-6 transition-transform duration-500 ease-in-out hover:scale-110" 
              style={{ color: `hsl(${280 * scrollProgress}, 70%, 60%)` }}
            />
          </button>
        </div>
        <nav 
          className={`${isMenuOpen ? 'max-h-screen' : 'max-h-0 md:max-h-screen'} overflow-hidden transition-all duration-1000 ease-in-out`}
        >
          <ul className="md:flex md:justify-center md:space-x-1 space-y-2 md:space-y-0 p-4 md:p-0">
            {navItems.map(({ href, label, icon, color }, index) => (
              <NavItem 
                key={href} 
                href={href} 
                label={label}
                icon={icon}
                color={color}
                onClick={handleNavClick}
                isActive={activeSection === href.slice(1)}
              />
            ))}
          </ul>
        </nav>
      </div>
      <div 
        className="h-1 bg-gradient-to-r from-pink-500 to-purple-500 transition-all duration-1000 ease-in-out"
        style={{ width: `${scrollProgress * 100}%` }}
      />
    </header>
  );
}

export default Header;