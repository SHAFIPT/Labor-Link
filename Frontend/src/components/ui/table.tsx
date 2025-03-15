// import React, { useState } from 'react';
// import { ChevronLeft, ChevronRight,Eye, ArrowDown, ArrowUp, Search, MoreHorizontal, Edit, Trash, Check, X, Download } from 'lucide-react';

// const AdminTable = ({ 
//   title,
//   columns, 
//   data, 
//   itemsPerPage = 10,
//   tableType , // users, labors, bookings, payments, withdrawals
// }) => {
//   const [currentPage, setCurrentPage] = useState(1);
//   const [sortBy, setSortBy] = useState(null);
//   const [sortDirection, setSortDirection] = useState('asc');
//   const [searchTerm, setSearchTerm] = useState('');
  
//   // Handle sorting
//   const handleSort = (key) => {
//     if (sortBy === key) {
//       setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
//     } else {
//       setSortBy(key);
//       setSortDirection('asc');
//     }
//   };
  
//   // Filter data based on search
//   const filteredData = data.filter(item => {
//     return columns.some(column => {
//       const value = item[column.key];
//       if (typeof value === 'string') {
//         return value.toLowerCase().includes(searchTerm.toLowerCase());
//       }
//       return false;
//     });
//   });
  
//   // Sort data
//   const sortedData = sortBy
//     ? [...filteredData].sort((a, b) => {
//         const aValue = a[sortBy];
//         const bValue = b[sortBy];
        
//         if (sortDirection === 'asc') {
//           return aValue > bValue ? 1 : -1;
//         } else {
//           return aValue < bValue ? 1 : -1;
//         }
//       })
//     : filteredData;
  
//   // Pagination
//   const totalPages = Math.ceil(sortedData.length / itemsPerPage);
//   const startIndex = (currentPage - 1) * itemsPerPage;
//   const paginatedData = sortedData.slice(startIndex, startIndex + itemsPerPage);
  
//   // Generate status badge
//   const getStatusBadge = (status) => {
//     let bgColor = '';
//     let textColor = 'text-white';
    
//     if (status.toLowerCase() === 'active' || status.toLowerCase() === 'approved' || status.toLowerCase() === 'completed' || status.toLowerCase() === 'paid') {
//       bgColor = 'bg-green-500';
//     } else if (status.toLowerCase() === 'pending') {
//       bgColor = 'bg-yellow-500';
//     } else if (status.toLowerCase() === 'rejected' || status.toLowerCase() === 'cancelled' || status.toLowerCase() === 'inactive') {
//       bgColor = 'bg-red-500';
//     } else {
//       bgColor = 'bg-blue-500';
//     }
    
//     return (
//       <span className={`${bgColor} ${textColor} py-1 px-3 rounded-full text-sm font-medium`}>
//         {status}
//       </span>
//     );
//   };
  
//   // Action buttons based on table type
//   const getActionButtons = (item) => {
//     switch (tableType) {
//       case 'users':
//         return (
//           <div className="flex space-x-2">
//             <button className="p-2 text-blue-500 hover:bg-gray-700 rounded-full transition-colors">
//               <Edit size={18} />
//             </button>
//             <button className="p-2 text-red-500 hover:bg-gray-700 rounded-full transition-colors">
//               <Trash size={18} />
//             </button>
//           </div>
//         );
//       case 'labors':
//         return (
//           <div className="flex space-x-2">
//             <button className="p-2 text-blue-500 hover:bg-gray-700 rounded-full transition-colors">
//               <Eye size={18} />
//             </button>
//             <button className="p-2 text-blue-500 hover:bg-gray-700 rounded-full transition-colors">
//               <Edit size={18} />
//             </button>
//             <button className="p-2 text-red-500 hover:bg-gray-700 rounded-full transition-colors">
//               <Trash size={18} />
//             </button>
//           </div>
//         );
//       case 'bookings':
//         return (
//           <div className="flex space-x-2">
//             <button className="p-2 text-blue-500 hover:bg-gray-700 rounded-full transition-colors">
//               <Edit size={18} />
//             </button>
//             <button className="p-2 text-gray-400 hover:bg-gray-700 rounded-full transition-colors">
//               <MoreHorizontal size={18} />
//             </button>
//           </div>
//         );
//       case 'payments':
//         return (
//           <div className="flex space-x-2">
//             <button className="p-2 text-blue-500 hover:bg-gray-700 rounded-full transition-colors">
//               <Download size={18} />
//             </button>
//             <button className="p-2 text-gray-400 hover:bg-gray-700 rounded-full transition-colors">
//               <MoreHorizontal size={18} />
//             </button>
//           </div>
//         );
//       case 'withdrawals':
//         return (
//           <div className="flex space-x-2">
//             <button className="p-2 text-green-500 hover:bg-gray-700 rounded-full transition-colors">
//               <Check size={18} />
//             </button>
//             <button className="p-2 text-red-500 hover:bg-gray-700 rounded-full transition-colors">
//               <X size={18} />
//             </button>
//           </div>
//         );
//       default:
//         return null;
//     }
//   };

//   return (
//     <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
//       {/* Table Header */}
//       <div className="p-6">
//         <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
//           <h2 className="text-xl font-semibold text-white">{title}</h2>
//           <div className="relative">
//             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//               <Search size={18} className="text-gray-400" />
//             </div>
//             <input
//               type="text"
//               placeholder="Search..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="bg-gray-700 text-white text-sm rounded-md pl-10 pr-4 py-2 w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-gray-600 transition-colors"
//             />
//           </div>
//         </div>
//       </div>

//       {/* Table */}
//       <div className="overflow-x-auto">
//         <table className="min-w-full divide-y divide-gray-700">
//           <thead className="bg-gray-700">
//             <tr>
//               {columns.map((column) => (
//                 <th
//                   key={column.key}
//                   onClick={() => column.sortable && handleSort(column.key)}
//                   className={`px-6 py-4 text-left text-sm font-medium text-gray-300 uppercase tracking-wider ${column.sortable ? 'cursor-pointer hover:text-white' : ''}`}
//                 >
//                   <div className="flex items-center space-x-1">
//                     <span>{column.label}</span>
//                     {column.sortable && sortBy === column.key && (
//                       sortDirection === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
//                     )}
//                   </div>
//                 </th>
//               ))}
//             </tr>
//           </thead>
//           <tbody className="bg-gray-800 divide-y divide-gray-700">
//             {paginatedData.length > 0 ? (
//               paginatedData.map((item, index) => (
//                 <tr key={index} className="hover:bg-gray-750 transition-colors">
//                   {columns.map((column) => (
//                     <td key={column.key} className="px-6 py-4 whitespace-nowrap">
//                       {column.key === 'index' ? (
//                         <span className="text-gray-300">{startIndex + index + 1}</span>
//                       ) : column.key === 'profilePic' || column.key === 'laborProfilePic' || column.key === 'userProfilePic' ? (
//                         <div className="flex-shrink-0 h-12 w-12">
//                           <img 
//                             className="h-12 w-12 rounded-full object-cover border-2 border-gray-700"
//                             src={item[column.key] || "/api/placeholder/60/60"} 
//                             alt="Profile"
//                           />
//                         </div>
//                       ) : column.key === 'status' || column.key === 'approvalStatus' || column.key === 'paymentStatus' ? (
//                         getStatusBadge(item[column.key])
//                       ) : column.key === 'actions' ? (
//                         getActionButtons(item)
//                       ) : column.key === 'amount' || column.key === 'laborAmount' || column.key === 'totalAmount' || column.key === 'commissionAmount' || column.key === 'laborEarnings' ? (
//                         <span className="text-gray-200 font-medium">₹{item[column.key].toLocaleString()}</span>
//                       ) : (
//                         <span className="text-gray-200">{item[column.key]}</span>
//                       )}
//                     </td>
//                   ))}
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan={columns.length} className="px-6 py-10 text-center text-gray-400">
//                   No data found
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* Pagination */}
//       {totalPages > 1 && (
//         <div className="bg-gray-800 px-6 py-4 border-t border-gray-700">
//           <div className="flex items-center justify-between">
//             <div className="text-sm text-gray-400">
//               Showing <span className="font-medium text-white">{startIndex + 1}</span> to{' '}
//               <span className="font-medium text-white">{Math.min(startIndex + itemsPerPage, sortedData.length)}</span> of{' '}
//               <span className="font-medium text-white">{sortedData.length}</span> results
//             </div>
//             <div className="flex items-center space-x-2">
//               <button
//                 onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
//                 disabled={currentPage === 1}
//                 className={`p-2 rounded-md border border-gray-600 ${currentPage === 1 ? 'text-gray-500 cursor-not-allowed' : 'text-gray-300 hover:bg-gray-700'}`}
//               >
//                 <ChevronLeft size={18} />
//               </button>
//               {/* Page number buttons */}
//               <div className="hidden md:flex space-x-2">
//                 {Array.from({ length: totalPages }, (_, i) => i + 1)
//                   .filter(pageNum => {
//                     if (totalPages <= 5) return true;
//                     return pageNum === 1 || pageNum === totalPages || 
//                       (pageNum >= currentPage - 1 && pageNum <= currentPage + 1);
//                   })
//                   .map((pageNum, i, arr) => {
//                     // Add ellipsis
//                     if (i > 0 && pageNum > arr[i - 1] + 1) {
//                       return (
//                         <React.Fragment key={`ellipsis-${pageNum}`}>
//                           <span className="px-3 py-1 text-gray-400">...</span>
//                           <button
//                             onClick={() => setCurrentPage(pageNum)}
//                             className={`px-3 py-1 rounded-md ${currentPage === pageNum ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}
//                           >
//                             {pageNum}
//                           </button>
//                         </React.Fragment>
//                       );
//                     }
//                     return (
//                       <button
//                         key={pageNum}
//                         onClick={() => setCurrentPage(pageNum)}
//                         className={`px-3 py-1 rounded-md ${currentPage === pageNum ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}
//                       >
//                         {pageNum}
//                       </button>
//                     );
//                   })}
//               </div>
//               {/* Current page indicator for mobile */}
//               <span className="md:hidden text-gray-300">
//                 {currentPage} / {totalPages}
//               </span>
//               <button
//                 onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
//                 disabled={currentPage === totalPages}
//                 className={`p-2 rounded-md border border-gray-600 ${currentPage === totalPages ? 'text-gray-500 cursor-not-allowed' : 'text-gray-300 hover:bg-gray-700'}`}
//               >
//                 <ChevronRight size={18} />
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AdminTable;