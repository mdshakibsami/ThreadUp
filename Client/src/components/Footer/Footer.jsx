import React from "react";

const Footer = () => {
  return (
    <footer className="bg-[#eeeeee] sm:px-10 text-gray-700 py-6 border-t border-[#E43636]">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
        <span className="text-sm">
          © {new Date().getFullYear()} ThreadUp. All rights reserved.
        </span>
        <div className="flex gap-4 mt-2 md:mt-0">
          <a href="/" className="hover:text-[#E43636] transition-colors">
            Home
          </a>
          <a
            href="/announcements"
            className="hover:text-[#E43636] transition-colors"
          >
            Announcement
          </a>
          <a href="/posts" className="hover:text-[#E43636] transition-colors">
            All Post
          </a>
          <a href="/about" className="hover:text-[#E43636] transition-colors">
            About Us
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
