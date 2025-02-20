import React from 'react'
import lightModeLogo from "../assets/laborLink_light-removebg-preview.png";

const Footer = () => {
  return (
     <footer className="bg-gray-200 text-gray-400 py-10 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
        
        {/* Left Logo & Social Icons */}
        <div className="flex flex-col items-center lg:items-start space-y-4">
          <img src={lightModeLogo} alt="Logo" className="w-32 h-auto" />
          <div className="flex space-x-4">
            <a href="#" className="text-gray-700 hover:text-white">
              <i className="fab fa-facebook text-xl"></i>
            </a>
            <a href="#" className="text-gray-700 hover:text-white">
              <i className="fab fa-instagram text-xl"></i>
            </a>
            <a href="#" className="text-gray-700 hover:text-white">
              <i className="fab fa-linkedin text-xl"></i>
            </a>
          </div>
        </div>

        {/* Footer Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:col-span-4 gap-6">
          {/* Platforms */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Platforms</h3>
            <ul className="space-y-2 text-gray-700">
              <li><a href="#" className="hover:text-gray-400">Windows</a></li>
              <li><a href="#" className="hover:text-gray-400">Mac</a></li>
              <li><a href="#" className="hover:text-gray-400">Linux</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Resources</h3>
            <ul className="space-y-2 text-gray-700">
              <li><a href="#" className="hover:text-gray-400">Blog</a></li>
              <li><a href="#" className="hover:text-gray-400">Docs</a></li>
              <li><a href="#" className="hover:text-gray-400">API</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Company</h3>
            <ul className="space-y-2 text-gray-700">
              <li><a href="#" className="hover:text-gray-400">About Us</a></li>
              <li><a href="#" className="hover:text-gray-400">Careers</a></li>
              <li><a href="#" className="hover:text-gray-400">Press</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Support</h3>
            <ul className="space-y-2 text-gray-700">
              <li><a href="#" className="hover:text-gray-400">Help Center</a></li>
              <li><a href="#" className="hover:text-gray-400">Contact Us</a></li>
              <li><a href="#" className="hover:text-gray-400">FAQ</a></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
