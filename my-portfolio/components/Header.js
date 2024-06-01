import Link from 'next/link';


const Header = () => {
  return (
    <header className="bg-cover bg-center text-white p-8 flex justify-between items-center" style={{ backgroundImage: "url('/Banner.jpg')" }}>
      <div className="text-2xl font-bold">Engr. Jalal Saleem</div>
      <nav>
        <ul className="flex space-x-4">
          <li><Link href="#home">Home</Link></li>
          <li><Link href="#about">About</Link></li>
          <li><Link href="#education">Education</Link></li>
          <li><Link href="#skills">Skills</Link></li>
          <li><Link href="#projects">Projects</Link></li>
          <li><Link href="#experience">Experience</Link></li>
          <li><Link href="#certificates">Certificates</Link></li>
          <li><Link href="#interests">Interests</Link></li>
          <li><Link href="#contact">Contact</Link></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;