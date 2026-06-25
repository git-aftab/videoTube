import { FaGithub, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="hidden md:flex items-center justify-center px-8 py-4 border-t border-border bg-(--bg-primary)">
      <p className="text-s text-(--text-mute)">
        Built with <span className="text-(--error)">♥</span>{" "}
        <a
          href="http://github.com/git-aftab"
          target="_blank"
          rel="noreferrer"
          className="text-accent hover:underline font-medium"
        >
          Aftab
        </a>
        {" | "}
      </p>

      <div className="flex items-center gap-4 ml-2">
        <a
          href="http://github.com/git-aftab"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-accent cursor-pointer"
        >
          <FaGithub size={16} />
        </a>

        <a
          href="http://"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-accent cursor-pointer"
        >
          <FaLinkedin size={15} />
        </a>
      </div>
    </footer>
  );
};

export default Footer;
