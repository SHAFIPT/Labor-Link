import React from 'react';
import { Link } from 'react-router-dom'; // Assuming you're using React Router for navigation

const Breadcrumb = ({ items, currentPage }) => {
  return (
    <nav className="flex py-4 px-4 sm:px-0" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-3">
        {items.map((item, index) => (
          <li key={index} className="inline-flex items-center">
            {index !== 0 && (
              <svg
              className={`w-6 h-6 ${
                currentPage === 'ProfilePage' || currentPage === 'userProfilePage' ? 'text-[#fff]' : 'text-gray-400'
              }`}
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              ></path>
            </svg>

            )}
            {item.link ? (
              <Link
                to={item.link}
                className={`text-sm font-medium ${
                   currentPage === 'ProfilePage' || currentPage === 'userProfilePage'
                    ? 'text-[#fff] hover:text-blue-700'
                    : 'text-gray-700 hover:text-blue-700'
                }`}
              >
                {item.label}
              </Link>
            ) : (
              <span
                className={`text-sm font-medium ${
                   currentPage === 'ProfilePage' || currentPage === 'userProfilePage' ? 'text-[#c8c4c4]' : 'text-gray-500'
                }`}
              >
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;