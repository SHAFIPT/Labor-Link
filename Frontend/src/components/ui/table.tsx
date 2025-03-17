import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Eye, ArrowDown, ArrowUp, Search, MoreHorizontal, Edit, Trash, Check, X, Download, XCircle, CheckCircle } from 'lucide-react';
import { User } from '../Admin/NewAdminSide/UserMange';
import { useNavigate } from 'react-router-dom';
import { ILaborer } from '../../@types/labor';
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { toast } from 'react-toastify';
import { deleteLabor, submitData} from "../../services/AdminAuthServices";
// Define the Column interface
interface Column {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (item: any) => React.ReactNode;
}

// Define the props interface for AdminTable
interface AdminTableProps {
  title: string;
  columns: Column[];
  data: any[];
  itemsPerPage?: number;
  tableType: 'users' | 'labors' | 'bookings' | 'payments' | 'withdrawals';
}

const AdminTable: React.FC<AdminTableProps> = ({ 
  title,
  columns, 
  data, 
  itemsPerPage =6,
  tableType,
}) => {
  console.log('Thsi is the table data ::::',data)
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<string | null>(null);
  const navigate = useNavigate()
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [searchTerm, setSearchTerm] = useState('');
  const [openConfirm, setOpenConfirm] = useState(false);
  const [selectedLabor, setSelectedLabor] = useState<string | null>(null);

  const handleNavigateUserView = (user: User) => {
    navigate('/admin/viewUser',{state : user})
  }

  const confirmDelete = async () => {
  if (!selectedLabor) return;
  try {
    const response = await deleteLabor({ email: selectedLabor }); // Ensure deleteLabor accepts an ID
    
    if (response.status === 200) {
      toast.success("Labor deleted successfully!");
      setOpenConfirm(false)
    } else {
      toast.error("Error occurred during deletion!");
    }
  } catch (error) {
    console.error("Error during deletion:", error);
    toast.error("Error occurred during deletion!");
  }
  };
  
  const handleAction = async (id  :string, status : string) => {
      try {
        const response = await submitData( {id , status });
        if (response.status == 200) {
          toast.success("data uploaded succefully");
        }
      } catch (error) {
        console.log(error);
        toast.error("Errorn is submit actions...");
      }
    };


  const handleNavigeLaborView = (labor: ILaborer) => {
    navigate('/admin/viewLabor',{state : labor})
  }

  const handleDeleteClick = (laborId: string) => {
    setSelectedLabor(laborId);
    setOpenConfirm(true);
  };
  
  // Handle sorting
  const handleSort = (key: string) => {
    if (sortBy === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(key);
      setSortDirection('asc');
    }
  };
  
  // Filter data based on search
  const filteredData = data.filter(item => {
    return columns.some(column => {
      const value = item[column.key];
      if (typeof value === 'string') {
        return value.toLowerCase().includes(searchTerm.toLowerCase());
      }
      return false;
    });
  });
  
  // Sort data
  const sortedData = sortBy
    ? [...filteredData].sort((a, b) => {
        const aValue = a[sortBy];
        const bValue = b[sortBy];
        
        if (sortDirection === 'asc') {
          return aValue > bValue ? 1 : -1;
        } else {
          return aValue < bValue ? 1 : -1;
        }
      })
    : filteredData;
  
  // Pagination
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = sortedData.slice(startIndex, startIndex + itemsPerPage);
  
  // Generate status badge
  const getStatusBadge = (status: string) => {
    let bgColor = '';
    const textColor = 'text-white';
    
    if (status.toLowerCase() === 'active' || status.toLowerCase() === 'approved' || status.toLowerCase() === 'completed' || status.toLowerCase() === 'paid') {
      bgColor = 'bg-green-500';
    } else if (status.toLowerCase() === 'pending') {
      bgColor = 'bg-yellow-500';
    } else if (status.toLowerCase() === 'rejected' || status.toLowerCase() === 'cancelled' || status.toLowerCase() === 'inactive') {
      bgColor = 'bg-red-500';
    } else {
      bgColor = 'bg-blue-500';
    }
    
    return (
      <span className={`${bgColor} ${textColor} py-1 px-3 rounded-full text-sm font-medium`}>
        {status}
      </span>
    );
  };
  
  // Action buttons based on table type
  const getActionButtons = (item) => {
    switch (tableType) {
      case 'users':
        return (
          <div className="flex space-x-2">
            <button className="p-2 text-yellow-500 hover:bg-gray-700 rounded-full transition-colors"
            onClick={()=> handleNavigateUserView(item)}
            >
          <Eye size={18} />
        </button>
          </div>
        );
      case 'labors':
        return (
          <div className="flex space-x-2">
            <button className="p-2 text-yellow-500 hover:bg-gray-700 rounded-full transition-colors"
            onClick={()=> handleNavigeLaborView(item)}
            >
              <Eye size={18} />
            </button>
            <button className="p-2 text-red-500 hover:bg-gray-700 rounded-full transition-colors"
            onClick={() => handleDeleteClick(item.email)}
            >
              <Trash size={18} />
            </button>
          </div>
        );
      case 'bookings':
        return (
          <div className="flex space-x-2">
            <button className="p-2 text-blue-500 hover:bg-gray-700 rounded-full transition-colors">
              <Edit size={18} />
            </button>
            <button className="p-2 text-gray-400 hover:bg-gray-700 rounded-full transition-colors">
              <MoreHorizontal size={18} />
            </button>
          </div>
        );
      case 'payments':
        return (
          <div className="flex space-x-2">
            <button className="p-2 text-blue-500 hover:bg-gray-700 rounded-full transition-colors">
              <Download size={18} />
            </button>
            <button className="p-2 text-gray-400 hover:bg-gray-700 rounded-full transition-colors">
              <MoreHorizontal size={18} />
            </button>
          </div>
        );
      case 'withdrawals':
        // For withdrawals, check the status and show different UI based on status
        if (item.status && item.status.toLowerCase() === 'pending') {
          return (
            <div className="flex space-x-2">
              <button
                className="p-2 px-4 bg-green-600 hover:bg-green-700 text-white rounded-md flex items-center space-x-1 transition-colors"
                onClick={() => handleAction(item._id, "approved")}
              >
                <Check size={16} />
                <span>Approve</span>
              </button>
              <button
                className="p-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded-md flex items-center space-x-1 transition-colors"
                onClick={() => handleAction(item._id, "rejected")}
              >
                <X size={16} />
                <span>Reject</span>
              </button>
            </div>
          );
        } else if (item.status && item.status.toLowerCase() === 'approved') {
          return (
            <div className="flex items-center space-x-1 p-2 px-4 bg-green-600 text-white rounded-md">
              <CheckCircle size={16} />
              <span>Approved</span>
            </div>
          );
        } else if (item.status && item.status.toLowerCase() === 'rejected') {
          return (
            <div className="flex items-center space-x-1 p-2 px-4 bg-red-600 text-white rounded-md">
              <XCircle size={16} />
              <span>Rejected</span>
            </div>
          );
        }
        return null;
      default:
        return null;
    }
  };

  return (
    <>
    {openConfirm && (
        <Transition appear show={openConfirm} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={setOpenConfirm}>
          <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 flex items-center justify-center">
            <Dialog.Panel className="w-full max-w-sm bg-white rounded-md shadow-lg p-6">
              <Dialog.Title className="text-lg font-semibold">Confirm Deletion</Dialog.Title>
              <Dialog.Description className="text-sm text-gray-600">
                Are you sure you want to delete this labor? This action cannot be undone.
              </Dialog.Description>
              <div className="mt-4 flex justify-end space-x-3">
                <button className="px-4 py-2 border rounded-md" onClick={() => setOpenConfirm(false)}>Cancel</button>
                <button className="px-4 py-2 bg-red-600 text-white rounded-md" onClick={confirmDelete}>Delete</button>
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>
      </Transition>
    )}
    <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      {/* Table Header */}
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <h2 className="text-xl font-semibold text-white">{title}</h2>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-gray-700 text-white text-sm rounded-md pl-10 pr-4 py-2 w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-gray-600 transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-700">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  onClick={() => column.sortable && handleSort(column.key)}
                  className={`px-6 py-4 text-left text-sm font-medium text-gray-300 uppercase tracking-wider ${column.sortable ? 'cursor-pointer hover:text-white' : ''}`}
                >
                  <div className="flex items-center space-x-1">
                    <span>{column.label}</span>
                    {column.sortable && sortBy === column.key && (
                      sortDirection === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-gray-800 divide-y divide-gray-700">
            {paginatedData.length > 0 ? (
              paginatedData.map((item, index) => (
                <tr key={index} className="hover:bg-gray-750 transition-colors">
                  {columns.map((column) => (
                    <td key={column.key} className="px-6 py-4 whitespace-nowrap">
                      {column.render ? (
                        column.render(item)
                      ) : column.key === 'index' ? (
                        <span className="text-gray-300">{startIndex + index + 1}</span>
                      ) : column.key === 'profilePic' || column.key === 'laborProfilePic' || column.key === 'userProfilePic' ? (
                        <div className="flex-shrink-0 h-12 w-12">
                          <img 
                            className="h-12 w-12 rounded-full object-cover border-2 border-gray-700"
                            src={item[column.key] || "/api/placeholder/60/60"} 
                            alt="Profile"
                          />
                        </div>
                      ) : column.key === 'status' || column.key === 'approvalStatus' || column.key === 'paymentStatus' ? (
                        getStatusBadge(item[column.key])
                      ) : column.key === 'actions' ? (
                        getActionButtons(item)
                      ) : column.key === 'amount' || column.key === 'laborAmount' || column.key === 'totalAmount' || column.key === 'commissionAmount' || column.key === 'laborEarnings' ? (
                        <span className="text-gray-200 font-medium">₹{item[column.key].toLocaleString()}</span>
                      ) : (
                        <span className="text-gray-200 font-medium">
  ₹{item[column.key] ? item[column.key].toLocaleString() : '0'}
</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-6 py-10 text-center text-gray-400">
                  No data found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="bg-gray-800 px-6 py-4 border-t border-gray-700">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-400">
              Showing <span className="font-medium text-white">{startIndex + 1}</span> to{' '}
              <span className="font-medium text-white">{Math.min(startIndex + itemsPerPage, sortedData.length)}</span> of{' '}
              <span className="font-medium text-white">{sortedData.length}</span> results
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className={`p-2 rounded-md border border-gray-600 ${currentPage === 1 ? 'text-gray-500 cursor-not-allowed' : 'text-gray-300 hover:bg-gray-700'}`}
              >
                <ChevronLeft size={18} />
              </button>
              {/* Page number buttons */}
              <div className="hidden md:flex space-x-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(pageNum => {
                    if (totalPages <= 5) return true;
                    return pageNum === 1 || pageNum === totalPages || 
                      (pageNum >= currentPage - 1 && pageNum <= currentPage + 1);
                  })
                  .map((pageNum, i, arr) => {
                    // Add ellipsis
                    if (i > 0 && pageNum > arr[i - 1] + 1) {
                      return (
                        <React.Fragment key={`ellipsis-${pageNum}`}>
                          <span className="px-3 py-1 text-gray-400">...</span>
                          <button
                            onClick={() => setCurrentPage(pageNum)}
                            className={`px-3 py-1 rounded-md ${currentPage === pageNum ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}
                          >
                            {pageNum}
                          </button>
                        </React.Fragment>
                      );
                    }
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`px-3 py-1 rounded-md ${currentPage === pageNum ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
              </div>
              {/* Current page indicator for mobile */}
              <span className="md:hidden text-gray-300">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-md border border-gray-600 ${currentPage === totalPages ? 'text-gray-500 cursor-not-allowed' : 'text-gray-300 hover:bg-gray-700'}`}
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  );
};

export default AdminTable;