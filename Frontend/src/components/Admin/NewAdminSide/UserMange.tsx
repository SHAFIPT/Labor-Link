// import React, { useState } from "react";
// import { Pencil, Trash } from "lucide-react";
// import { Button } from "../../ui/buttonAdmin";
// import AdminTable from "../../ui/table";

// const UserManagement = () => {
//   const [users, setUsers] = useState([
//     { id: 1, name: "John Doe", email: "john@example.com", role: "Admin" },
//     { id: 2, name: "Jane Smith", email: "jane@example.com", role: "User" },
//     { id: 3, name: "Alice Brown", email: "alice@example.com", role: "Editor" },
//   ]);

//   const handleEdit = (id) => {
//     console.log("Edit user with ID:", id);
//   };

//   const handleDelete = (id) => {
//     if (window.confirm("Are you sure you want to delete this user?")) {
//       setUsers(users.filter((user) => user.id !== id));
//     }
//   };

//   const columns = [
//     { key: "id", label: "ID" },
//     { key: "name", label: "Name" },
//     { key: "email", label: "Email" },
//     { key: "role", label: "Role" },
//     {
//       key: "actions",
//       label: "Actions",
//       render: (user) => (
//         <div className="flex gap-2">
//           <Button size="sm" variant="outline" onClick={() => handleEdit(user.id)}>
//             <Pencil className="w-4 h-4" />
//           </Button>
//           <Button size="sm" variant="danger" onClick={() => handleDelete(user.id)}>
//             <Trash className="w-4 h-4" />
//           </Button>

//         </div>
//       ),
//     },
//   ];

//   return (
//      <div className="p-6 bg-gray-900 rounded-lg shadow-lg">
//       <h1 className="text-2xl md:text-3xl font-[Rockwell] text-white text-center md:text-left mb-6 tracking-wide">
//         User Management
//       </h1>
//       <AdminTable title="" columns={columns} data={users} tableType='users' />
//     </div>
//   );
// };

// export default UserManagement;
