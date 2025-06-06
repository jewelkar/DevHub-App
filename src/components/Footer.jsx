import React from "react";

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-gray-800 shadow-inner mt-8">
      <div className="container mx-auto px-4 py-4 text-center text-gray-600 dark:text-gray-400">
        &copy; {new Date().getFullYear()} DevHub. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
