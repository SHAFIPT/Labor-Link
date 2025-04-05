import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Eye, ArrowDown, ArrowUp, Search, MoreHorizontal, Edit, Trash, Check, X, Download, XCircle, CheckCircle } from 'lucide-react';
import { User } from '../Admin/NewAdminSide/UserMange';
import { useNavigate } from 'react-router-dom';
import { ILaborer } from '../../@types/labor';
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { toast } from 'react-toastify';
import { deleteLabor, submitData} from "../../services/AdminAuthServices";

// Base interface for all table items
interface BaseTableItem {
  [key: string]: string | number | boolean | null | undefined | object | object[];
}

// Interface for User table items
interface UserTableItem extends BaseTableItem, Partial<User> {
  profilePic?: string;
  status?: string;
  email: string;
}

// Interface for Labor table items
interface LaborTableItem extends BaseTableItem, Partial<ILaborer> {
  laborProfilePic?: string;
  email: string;
  status?: string;
}

// Interface for Booking table items
interface BookingTableItem extends BaseTableItem {
  userProfilePic?: string;
  status?: string;
}

// Interface for Payment table items
interface PaymentTableItem extends BaseTableItem {
  amount: number;
  paymentStatus?: string;
}

// Interface for Withdrawal table items
export interface WithdrawalTableItem extends BaseTableItem {
  _id: string;
  amount: number;
  status: string;
}

// Union type for all table item types
type TableItemType = UserTableItem | LaborTableItem | BookingTableItem | PaymentTableItem | WithdrawalTableItem;

// Define the Column interface
export interface Column<T> {
  key: keyof T | string;
  label: string;
  sortable?: boolean;
  render?: (item: T) => React.ReactNode;
}

// Define the props interface for AdminTable
interface AdminTableProps<T> {
  title: string;
  columns: Column<T>[];
  data: T[];
  itemsPerPage?: number;
  tableType: 'users' | 'labors' | 'bookings' | 'payments' | 'withdrawals';
}

const AdminTable = <T extends TableItemType>({ 
  title,
  columns, 
  data, 
  itemsPerPage = 6,
  tableType,
}: AdminTableProps<T>) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<string | null>(null);
  const navigate = useNavigate();
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [searchTerm, setSearchTerm] = useState('');
  const [openConfirm, setOpenConfirm] = useState(false);
  const [selectedLabor, setSelectedLabor] = useState<string | null>(null);

  const handleNavigateUserView = (user: User) => {
    navigate('/admin/viewUser', { state: user });
  };

  const confirmDelete = async () => {
    if (!selectedLabor) return;
    try {
      const response = await deleteLabor({ email: selectedLabor });
      
      if (response.status === 200) {
        toast.success("Labor deleted successfully!");
        setOpenConfirm(false);  
      } else {
        toast.error("Error occurred during deletion!");
      }
    } catch (error) {
      console.error("Error during deletion:", error);
      toast.error("Error occurred during deletion!");
    }
  };
  
  const handleAction = async (id: string, status: string) => {
    try {
      const response = await submitData({ id, status });
      if (response.status === 200) {
        toast.success("Data uploaded successfully");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error in submit actions...");
    }
  };

  const handleNavigeLaborView = (labor: ILaborer) => {
    navigate('/admin/viewLabor', { state: labor });
  };

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
  
  const filteredData = data.filter(item => {
    return columns.some(column => {
      const value = item[column.key as keyof TableItemType]; 
      if (typeof value === 'string') {
        return value.toLowerCase().includes(searchTerm.toLowerCase());
      }
      return false;
    });
  });

  
  // Sort data
  const sortedData = sortBy
    ? [...filteredData].sort((a, b) => {
        const aValue = a[sortBy as keyof TableItemType] ?? ""; // Provide a default value
        const bValue = b[sortBy as keyof TableItemType] ?? "";

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

  const renderCellValue = (value: string | number | boolean | null | undefined | object | object[]): React.ReactNode => {
    if (value === null || value === undefined) {
      return '';
    }
    
    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
      return String(value);
    }
    
    // For object types, stringify them
    return JSON.stringify(value);
  };
  
  // Generate status badge
  const getStatusBadge = (status: string | number | boolean | null | undefined | object | object[]): React.ReactNode => {
    if (!status) return <span className="px-2 py-1 text-xs bg-gray-600 text-gray-200 rounded-full">Unknown</span>;
    
    const statusStr = String(status).toLowerCase();
    
    if (statusStr === 'active' || statusStr === 'approved' || statusStr === 'paid') {
      return <span className="px-2 py-1 text-xs bg-green-800 text-green-200 rounded-full">{String(status)}</span>;
    } else if (statusStr === 'pending') {
      return <span className="px-2 py-1 text-xs bg-yellow-800 text-yellow-200 rounded-full">{String(status)}</span>;
    } else if (statusStr === 'inactive' || statusStr === 'rejected' || statusStr === 'failed') {
      return <span className="px-2 py-1 text-xs bg-red-800 text-red-200 rounded-full">{String(status)}</span>;
    }
    
    return <span className="px-2 py-1 text-xs bg-blue-800 text-blue-200 rounded-full">{String(status)}</span>;
  };
  
  // Action buttons based on table type
  const getActionButtons = (item: TableItemType) => {
    switch (tableType) {
      case "users":
        return (
          <div className="flex space-x-2">
            <button
              className="p-2 text-yellow-500 hover:bg-gray-700 rounded-full transition-colors"
              onClick={() => handleNavigateUserView(item as User)}
            >
              <Eye size={18} />
            </button>
          </div>
        );
      case "labors":
        return (
          <div className="flex space-x-2">
            <button
              className="p-2 text-yellow-500 hover:bg-gray-700 rounded-full transition-colors"
              onClick={() => handleNavigeLaborView(item as ILaborer)}
            >
              <Eye size={18} />
            </button>
            <button
              className="p-2 text-red-500 hover:bg-gray-700 rounded-full transition-colors"
              onClick={() => handleDeleteClick((item as LaborTableItem).email)}
            >
              <Trash size={18} />
            </button>
          </div>
        );
      case "bookings":
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
      case "payments":
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
      case "withdrawals": {
        const withdrawalItem = item as WithdrawalTableItem;
        // For withdrawals, check the status and show different UI based on status
        if (
          withdrawalItem.status &&
          withdrawalItem.status.toLowerCase() === "pending"
        ) {
          return (
            <div className="flex space-x-2">
              <button
                className="p-2 px-4 bg-green-600 hover:bg-green-700 text-white rounded-md flex items-center space-x-1 transition-colors"
                onClick={() => handleAction(withdrawalItem._id, "approved")}
              >
                <Check size={16} />
                <span>Approve</span>
              </button>
              <button
                className="p-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded-md flex items-center space-x-1 transition-colors"
                onClick={() => handleAction(withdrawalItem._id, "rejected")}
              >
                <X size={16} />
                <span>Reject</span>
              </button>
            </div>
          );
        } else if (
          withdrawalItem.status &&
          withdrawalItem.status.toLowerCase() === "approved"
        ) {
          return (
            <div className="flex items-center space-x-1 p-2 px-4 bg-green-600 text-white rounded-md">
              <CheckCircle size={16} />
              <span>Approved</span>
            </div>
          );
        } else if (
          withdrawalItem.status &&
          withdrawalItem.status.toLowerCase() === "rejected"
        ) {
          return (
            <div className="flex items-center space-x-1 p-2 px-4 bg-red-600 text-white rounded-md">
              <XCircle size={16} />
              <span>Rejected</span>
            </div>
          );
        }
        return null;
      }
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
                  key={String(column.key)}
                  onClick={() => column.sortable && handleSort(String(column.key))}
                  className={`px-6 py-4 text-left text-sm font-medium text-gray-300 uppercase tracking-wider ${column.sortable ? 'cursor-pointer hover:text-white' : ''}`}
                >
                  <div className="flex items-center space-x-1">
                    <span>{column.label}</span>
                    {column.sortable && sortBy === String(column.key) && (
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
                  {columns.map((column) => {
                    const columnKey = String(column.key);
                    const cellValue = item[columnKey];
                    
                    return (
                      <td key={columnKey} className="px-6 py-4 whitespace-nowrap">
                        {column.render ? (
                          column.render(item)
                        ) : columnKey === 'index' ? (
                          <span className="text-gray-300">{startIndex + index + 1}</span>
                        ) : ['profilePic', 'laborProfilePic', 'userProfilePic'].includes(columnKey) ? (
                          <div className="flex-shrink-0 h-12 w-12">
                            <img 
                              className="h-12 w-12 rounded-full object-cover border-2 border-gray-700"
                              src={typeof cellValue === 'string' ? cellValue : "/api/placeholder/60/60"} 
                              alt="Profile"
                            />
                          </div>
                        ) : ['status', 'approvalStatus', 'paymentStatus'].includes(columnKey) ? (
                          getStatusBadge(cellValue)
                        ) : columnKey === 'actions' ? (
                          getActionButtons(item)
                        ) : ['amount', 'laborAmount', 'totalAmount', 'commissionAmount', 'laborEarnings'].includes(columnKey) ? (
                          <span className="text-gray-200 font-medium">
                            ₹{typeof cellValue === 'number' ? cellValue.toLocaleString() : '0'}
                          </span>
                        ) : (
                          <span className="text-gray-200 font-medium">
                            {Array.isArray(cellValue) 
                              ? cellValue.join(', ')  // ✅ Convert array to a comma-separated string
                              : typeof cellValue === 'number' 
                              ? `₹${cellValue.toLocaleString()}`
                              : renderCellValue(cellValue)}
                          </span>
                        )}
                      </td>
                    );
                  })}
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