import { FaGithub, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="hidden items-center justify-center border-t border-[var(--border)] bg-[var(--bg-primary)] px-8 py-4 text-sm text-[var(--text-muted)] md:flex">
      <p>
        Built with <span className="text-[var(--error)]">♥</span>{" "}
        <a
          href="http://github.com/git-aftab"
          target="_blank"
          rel="noreferrer"
          className="font-medium text-[var(--accent)] hover:underline"
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
          className="cursor-pointer transition-colors hover:text-[var(--accent)]"
        >
          <FaGithub size={16} />
        </a>

        <a
          href="http://"
          target="_blank"
          rel="noopener noreferrer"
          className="cursor-pointer transition-colors hover:text-[var(--accent)]"
        >
          <FaLinkedin size={15} />
        </a>
      </div>
    </footer>
  );
};

export default Footer;
