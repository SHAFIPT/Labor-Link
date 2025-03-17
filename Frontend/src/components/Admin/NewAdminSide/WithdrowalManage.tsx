import React, { useEffect, useState } from "react";
import AdminTable from "../../ui/table";
import { toast } from "react-toastify";
import { fetchPending } from "../../../services/AdminAuthServices";

interface PaymentRequest {
  laborerId?: {
    firstName?: string;
    lastName?: string;
  };
  amount: number;
  paymentMethod: string;
  createdAt: string;
  status: "pending" | "approved" | "rejected";
}

interface LaborerID {
  firstName: string;
  lastName: string;
  _id: string;
  // Other fields from the data structure
}

interface Withdrawal {
  _id: string;
  amount: number;
  status: string;
  laborerId: LaborerID;
  createdAt: string;
  paymentMethod: string;
  paymentDetails: string;
}

const WithdrawalManage = () => {
  const [pendingWallets, setPendingWallets] = useState<Withdrawal[]>([]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const fetchPendingWithdrawals = async () => {
    try {
      const response = await fetchPending();
      if (response.status === 200) {
        setPendingWallets(response.data.fetchedResponse);
      }
    } catch (error) {
      console.log(error);
      toast.error("Error fetching pending withdrawals");
    }
  };

  useEffect(() => {
    fetchPendingWithdrawals();
  }, []);

  const columns = [
    {
      key: "index",
      label: "ID",
    },
    {
      key: "laborName",
      label: "Labor Name",
      render: (item: PaymentRequest) => (
        <span className="text-gray-200">
          {item.laborerId?.firstName || ""} {item.laborerId?.lastName || ""}
        </span>
      ),
    },
    {
      key: "requestedAmount",
      label: "Requested Amount",
      render: (item: PaymentRequest) => (
        <span className="text-gray-200 font-medium">₹{item.amount}</span>
      ),
    },
    {
      key: "paymentMethod",
      label: "Payment Method",
      render: (item: PaymentRequest) => (
        <span className="text-gray-200">{item.paymentMethod}</span>
      ),
    },
    {
      key: "requestDate",
      label: "Request Date & Time",
      render: (item: PaymentRequest) => (
        <span className="text-gray-200">{formatDate(item.createdAt)}</span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (item: PaymentRequest) => (
        <span
          className={`py-1 px-3 rounded-full text-sm font-medium text-white ${
            item.status === "pending"
              ? "bg-yellow-500"
              : item.status === "approved"
              ? "bg-green-500"
              : "bg-red-500"
          }`}
        >
          {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
    },
  ];

  return (
    <>
      <div className="p-6 bg-gray-900 rounded-lg shadow-lg">
        <h1 className="text-2xl md:text-3xl font-[Rockwell] text-white text-center md:text-left mb-6 tracking-wide">
          Withdrawal Management
        </h1>
        <AdminTable
          title="Pending Withdrawals"
          columns={columns}
          data={pendingWallets}
          tableType="withdrawals"
          itemsPerPage={5}
        />
      </div>
    </>
  );
};

export default WithdrawalManage;
