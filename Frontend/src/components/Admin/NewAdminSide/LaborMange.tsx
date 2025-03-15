// import { useState } from "react";
// import AdminTable from "../../ui/table";
// import { Eye, Pencil, Trash } from "lucide-react";
// import { Button } from "../../ui/buttonAdmin";
// const LaborManage = () => {

//     const [labors, setLabors] = useState([
//         { id: 1, name: "John Doe", role: "Electrician", status: "Active" },
//         { id: 2, name: "Jane Smith", role: "Plumber", status: "Inactive" },
//         { id: 3, name: "Samuel Green", role: "Carpenter", status: "Active" },
//     ]);
//     const handleView = (id) => {
//         console.log('hiii')
//     }

//    const handleEdit = (id) => {
//       console.log("Edit user with ID:", id);
//     };
  
//     const handleDelete = (id) => {
//       if (window.confirm("Are you sure you want to delete this user?")) {
//         setLabors(labors.filter((user) => user.id !== id));
//       }
//     };
  
//    const columns = [
//   { key: "id", label: "ID" },
//   { key: "name", label: "Name" },
//   { key: "role", label: "Role" },
//   { key: "status", label: "Status" },
//   {
//     key: "actions",
//     label: "Actions",
//     render: (user) => (
//       <div className="flex gap-2">
//         <Button size="sm" variant="outline" onClick={() => handleView(user.id)}>
//           <Eye className="w-4 h-4" />
//         </Button>
//         <Button size="sm" variant="outline" onClick={() => handleEdit(user.id)}>
//           <Pencil className="w-4 h-4" />
//         </Button>
//         <Button size="sm" variant="destructive" onClick={() => handleDelete(user.id)}>
//           <Trash className="w-4 h-4" />
//         </Button>
//       </div>
//     ),
//   },
// ];



//   return (
//     <div className="p-6 bg-gray-900 rounded-lg shadow-lg">
//       <h1 className="text-2xl md:text-3xl font-[Rockwell] text-white text-center md:text-left mb-6 tracking-wide">
//         Labor Management
//       </h1>
//       <AdminTable title='' columns={columns} data={labors} tableType='labors' />
//     </div>
      
    
//   );
// };

// export default LaborManage;
