import { FaLinkedin, FaGithub, FaInstagram, FaKaggle } from "react-icons/fa";
import ReactCountryFlag from "react-country-flag";
const Navbar = () => {
  return (
    <nav className="z-[9999] container mx-auto mb-20 flex items-center justify-between bg-transparent py-4 fixed w-full border-b border-gray-800 ">
      <div className="flex flex-shrink-0 items-center">
        <h1 className="underline decoration-wavy decoration-orange-400  text-2xl font-bold mx-4">
          <ReactCountryFlag
            countryCode="PK"
            svg
            style={{
              width: "2em",
              height: "1em",
            }}
            title="PK"
          />
        </h1>
      </div>

      <div>
        <ul className="flex gap-6">
          <li className="hover:text-gray-500 lg:mx-4 mx-2">
            {" "}
            <a href="#about">About</a>
          </li>
          <li className="hover:text-gray-500 lg:mx-4 mx-2">
            {" "}
            <a href="#projects">Projects</a>
          </li>
          <li className="hover:text-gray-500 lg:mx-4 mx-4">
            {" "}
            <a href="#contact">Contact</a>
          </li>
        </ul>
      </div>
      <div className="lg:flex items-center justify-center gap-4 text-2xl mr-4 hidden ">
        <a href="https://www.instagram.com/maddii._1" target="_blank">
          {" "}
          <FaInstagram />
        </a>
        <a href="https://www.linkedin.com/in/mdhamad/" target="_blank">
          {" "}
          <FaLinkedin />
        </a>
        <a href="https://github.com/ChaudaryHammad" target="_blank">
          {" "}
          <FaGithub />
        </a>
        <a href="https://www.kaggle.com/fa20bcs090hammad" target="_blank">
          <FaKaggle />
        </a>
      </div>
    </nav>
  );
};

export default Navbar;
