import React, { useEffect, useState } from "react";
import AdminTable from "../../ui/table";
import UseDebounce from "../../../Hooks/useDebounce";
import { toast } from "react-toastify";
import { fetchUser } from "../../../services/AdminAuthServices";
import Pagination from "../../ui/pegination";
import { HttpStatus } from "../../../enums/HttpStaus";
import { Messages } from "../../../constants/Messages";

// Define the User interface
export interface User {
  _id: string;
  firstName?: string;
  email: string;
  isBlocked: boolean;
  role?: string;
  index?: number;
}

const UserManagement = () => {
  const [searchTerm] = useState("");
  const debouncedSearchTerm = UseDebounce(searchTerm, 500);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedFilter] = useState("Filter");
  const [totalPages, setTotalPages] = useState(1);

  // Retrieve stored page number or default to 1
  const storedPage = localStorage.getItem("userManagementPage");
  const [page, setPage] = useState(storedPage ? parseInt(storedPage) : 1);

  const fetchUsers = async (
    query = "",
    pageNumber = 1,
    selectedFilter: string
  ) => {
    try {
      const response = await fetchUser({ query, pageNumber, selectedFilter });

      if (response.status === HttpStatus.OK) {
        const { usersFound, totalPage } = response.data.data;
        setTotalPages(totalPage);
        setUsers(usersFound);
      } else {
        toast.error(Messages.ERROR_FETCH_USER);
      }
    } catch (error) {
      console.error(Messages.ERROR_FETCH_USER, error);
      toast.error(Messages.ERROR_FETCH_USER);
    }
  };

  useEffect(() => {
    fetchUsers(debouncedSearchTerm, page, selectedFilter);
  }, [debouncedSearchTerm, page, selectedFilter]);

  useEffect(() => {
    localStorage.setItem("userManagementPage", page.toString()); // Store the current page
  }, [page]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <div className="p-6 bg-gray-900 rounded-lg shadow-lg">
      <h1 className="text-2xl md:text-3xl font-[Rockwell] text-white text-center md:text-left mb-6 tracking-wide">
        User Management
      </h1>
      <AdminTable
        title="User List"
        columns={[
          { key: "index", label: "ID" },
          { key: "firstName", label: "Name", sortable: true },
          { key: "email", label: "Email", sortable: true },
          { key: "role", label: "Role" },
          { key: "status", label: "Status", sortable: true },
          { key: "actions", label: "Actions" },
        ]}
        data={users.map((user, index) => ({
          ...user,
          index: index + 1,
          status: user.isBlocked ? "Inactive" : "Active",
        }))}
        tableType="users"
      />
      <div className="mt-4">
        <Pagination
          totalPages={totalPages}
          currentPage={page}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default UserManagement;
