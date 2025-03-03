import React, { useEffect, useState } from 'react';
import AdminSideRow from './AdminSideRow';
import { toast } from 'react-toastify';
import { fetchPending, submitData } from '../../../services/AdminAuthServices';

interface Laborer {
  firstName: string;
  lastName?: string;
}

interface Withdrawal {
  _id: string;
  amount: number;
  status: "pending" | "approved" | "rejected";
  laborerId?: Laborer;
  createdAt: string;
}


const WithdrowPendings = () => {
  // Demo pending withdrawals
  const [pendingWallets, setPendingWallets] = useState<Withdrawal[] | null>(null);
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

  useEffect(() => {
    const fetchPendingWithdrowalls = async () => {
      const response = await fetchPending();

      if (response.status === 200) {
        setPendingWallets(response.data.fetchedResponse);
        // toast.success('peingind fetch succefully')
      }
    };
    fetchPendingWithdrowalls();
  }, []);

  return (
    <div className="flex min-h-screen">
      <AdminSideRow />
      <div className="flex-1 p-6 w-full bg-[#D6CCCC]">
        <div className="flex flex-col sm:flex-row justify-between items-center w-full p-4">
          <h1 className="font-serif p-12 text-4xl sm:text-3xl md:text-4xl lg:text-5xl">
            Pending Withdrawals
          </h1>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-[#ABA0A0] rounded-lg">
            <thead>
              <tr className="bg-gray-200 text-left text-xs sm:text-sm font-semibold text-gray-700">
                <th className="p-3">Laborer Name</th>
                <th className="p-3">Amount (₹)</th>
                <th className="p-3">Requested Date</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {pendingWallets && pendingWallets.length > 0 ? ( // Ensure pendingWallets is not null
                pendingWallets.map((withdrawal) => (
                  <tr
                    key={withdrawal._id}
                    className="border-b border-gray-200 text-white"
                  >
                    <td className="p-3">
                      {withdrawal.laborerId?.firstName || "Unknown"}
                    </td>
                    <td className="p-3">
                      ₹{withdrawal.amount.toLocaleString()}
                    </td>
                    <td className="p-3">
                      {new Date(withdrawal.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-3">
                      {withdrawal.status === "pending" ? (
                        <div className="flex gap-2">
                          <button
                            className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded"
                            onClick={() =>
                              handleAction(withdrawal._id, "approved")
                            }
                          >
                            Approve
                          </button>
                          <button
                            className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded"
                            onClick={() =>
                              handleAction(withdrawal._id, "rejected")
                            }
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span
                          className={`px-2 py-1 rounded ${
                            withdrawal.status === "approved"
                              ? "bg-green-500"
                              : "bg-red-500"
                          }`}
                        >
                          {withdrawal.status}
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              ) : pendingWallets?.length === 0 ? ( // Check explicitly for empty array
                <tr>
                  <td colSpan={4} className="text-center p-4 text-gray-400">
                    No pending withdrawals
                  </td>
                </tr>
              ) : null}{" "}
              {/* Prevents rendering issues if pendingWallets is null */}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default WithdrowPendings;
