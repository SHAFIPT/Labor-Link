// import React, { useState } from 'react'
// import BookingManage from '../../components/Admin/NewAdminSide/BookingManage'
// import SideDrower from '../../components/Admin/NewAdminSide/SideDrower'
// import NavBar from '../../components/Admin/NewAdminSide/NavBar'

// const BookingMangementPage = () => {
//      // Shared state for sidebar collapse
//       const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    
//       // Function to toggle sidebar state
//       const toggleSidebar = () => {
//         setIsSidebarCollapsed(!isSidebarCollapsed);
//       };
//   return (
//     <div>
//       <div className="flex h-screen bg-gray-100">
//         <div>
//           <SideDrower
//             isCollapsed={isSidebarCollapsed}
//             toggleSidebar={toggleSidebar}
//           />
//         </div>
//         <div
//           className={`flex-1 flex flex-col overflow-hidden bg-gray-700 transition-all duration-300 ${
//             isSidebarCollapsed ? "ml-20" : "ml-64"
//           }`}
//         >
//           <NavBar />
//           <main className="flex-1 overflow-y-auto p-4">
//             <BookingManage/>
//           </main>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default BookingMangementPage
