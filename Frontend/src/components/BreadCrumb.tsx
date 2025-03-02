import React from 'react';
import { Link } from 'react-router-dom';

interface BreadcrumbItem {
  label: string;
  link?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];  // Array of breadcrumb items
  currentPage: string;  // The current page name (e.g., 'ProfilePage')
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, currentPage }) => {
  return (
    <nav className="py-3 px-4 sm:px-6 lg:px-8" aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center space-x-1 sm:space-x-2 md:space-x-3">
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            {/* Chevron Arrow Icon (Hidden for First Item) */}
            {index !== 0 && (
              <svg
                className={`w-5 h-5 sm:w-6 sm:h-6 ${
                  currentPage === 'ProfilePage' || currentPage === 'userProfilePage'
                    ? 'text-white'
                    : 'text-gray-400'
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

            {/* Breadcrumb Link or Label */}
            {item.link ? (
              <Link
                to={item.link}
                className={`${
                  currentPage === 'userChatPage' 
                    ? 'text-xs'  // Apply smaller font size for userChatPage
                    : 'text-xs sm:text-sm md:text-base'
                } font-medium transition-colors ${
                  currentPage === 'ProfilePage' || currentPage === 'userProfilePage'
                    ? 'text-white hover:text-blue-500'
                    : 'text-gray-700 hover:text-blue-700'
                }`}
              >
                {item.label}
              </Link>
            ) : (
               <span
                className={`${
                  currentPage === 'userChatPage'
                    ? 'text-xs' // Apply smaller font size for userChatPage
                    : 'text-xs sm:text-sm md:text-base'
                } font-medium ${
                  currentPage === 'ProfilePage' || currentPage === 'userProfilePage'
                    ? 'text-gray-300'
                    : 'text-gray-500'
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
