import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-300 py-6 mt-12">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
        <p className="text-sm">&copy; {new Date().getFullYear()} Resumalyze. All rights reserved.</p>
        <nav className="mt-3 md:mt-0 space-x-4">
          <a
            href="https://github.com/Khaleel1911/AI-Resume-Analyzer" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            GitHub
          </a>
          <a
            href="/"
            className="hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            Privacy Policy
          </a>
          <a
            href="/contact"
            className="hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            Contact
          </a>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
