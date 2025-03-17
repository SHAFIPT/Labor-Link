import { useEffect, useState } from "react";
import AdminTable from "../../ui/table";
import UseDebounce from "../../../Hooks/useDebounce";
import { toast } from "react-toastify";
import { fetchLabor } from "../../../services/AdminAuthServices";
import Pagination from "../../ui/pegination";

interface Labor {
  _id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  isBlocked?: boolean;
  categories?: string[];
  status?: "pending" | "approved" | "rejected";
}

const LaborManage = () => {
  const [searchTerm] = useState("");
  const [Labors, setLabors] = useState<Labor[]>([]);
  const debouncedSearchTerm = UseDebounce(searchTerm, 500);
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
    const resoponse = await fetchLabor({ query, pageNumber, selectedFilter });

    if (resoponse.status === 200) {
      const { laborFound, totalPage } = resoponse.data.data;
      setTotalPages(totalPage);
      setLabors(laborFound);
    } else {
      toast.error("Error occurd during fetchUser....!");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchUsers(debouncedSearchTerm, page, selectedFilter);
    };

    fetchData();
  }, [debouncedSearchTerm, page, selectedFilter]);

  useEffect(() => {
    localStorage.setItem("userManagementPage", page.toString()); // Store the current page
  }, [page]);

  const columns = [
    { key: "index", label: "ID" },
    { key: "firstName", label: "Name" },
    { key: "categories", label: "Role" },
    {
      key: "status",
      label: "Status",
      sortable: true,
    },
    {
      key: "actions",
      label: "Actions",
    },
  ];

  const tableData = Labors.map((user, index) => ({
    ...user,
    index: index + 1,
  }));

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <div className="p-6 bg-gray-900 rounded-lg shadow-lg">
      <h1 className="text-2xl md:text-3xl font-[Rockwell] text-white text-center md:text-left mb-6 tracking-wide">
        Labor Management
      </h1>
      <AdminTable
        title=""
        columns={columns}
        data={tableData}
        tableType="labors"
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

export default LaborManage;
