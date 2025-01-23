import LaborDashBoardNav from "./LaborDashBoardNav"

import React from 'react';
import { HomeIcon, MessageSquare, Receipt, Briefcase, User, LogOut, DollarSign } from 'lucide-react';
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store/store";

const LaborDashBoard = () => {
  //  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
      const theme = useSelector((state: RootState) => state.theme.mode);
  const stats = [
    { title: "Total Work Taken", value: "24", icon: Briefcase },
    { title: "Work Completed", value: "18", icon: Receipt },
    { title: "Total Earnings", value: "$2,450", icon: DollarSign },
    { title: "Pending Tasks", value: "6", icon: MessageSquare },
  ];

  return (
    <div>
      <LaborDashBoardNav />
      <div className="flex h-screen ">
        {/* Desktop Sidebar */}
        {theme == 'light' ?(
            <>
            <div className="hidden lg:block w-64 bg-white shadow-lg">
          <div className="flex flex-col h-full">
            <div className="p-4 border-b">
              <h2 className="text-xl font-bold">Labor Panel</h2>
            </div>

            <nav className="flex-1 p-4 space-y-2">
              {[
                { name: "Dashboard", icon: HomeIcon, href: "/dashboard" },
                { name: "Browse Labors", icon: User, href: "/browse-labors" },
                { name: "Chats", icon: MessageSquare, href: "/chats" },
                { name: "Billing History", icon: Receipt, href: "/billing" },
                { name: "Total Works", icon: Briefcase, href: "/works" },
                { name: "View Profile", icon: User, href: "/labor/ProfilePage" },
              ].map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="flex items-center w-full px-4 py-3 text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors"
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  <span>{item.name}</span>
                </a>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-6">
            <div className="flex justify-center mb-8">
              <h1 className="text-3xl md:text-[35px] font-bold font-[Rockwell]">
                Welcome to Labor Dashboard
              </h1>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat) => (
                <div
                  key={stat.title}
                  className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center justify-between mb-4">
                    <stat.icon className="w-8 h-8 text-blue-500" />
                    <span className="text-2xl font-bold">{stat.value}</span>
                  </div>
                  <h3 className="text-gray-600 font-medium">{stat.title}</h3>
                </div>
              ))}
            </div>
          </div>
        </div>
            </>
        ):(
          <>
            <div className="hidden bg-[#0f8585] lg:mt-8 lg:block w-64 h-[460px] border border-gray-700 rounded-md shadow-lg">
          <div className="flex flex-col h-full">
            <div className="p-4 border-b">
              <h2 className="text-xl font-bold">Labor Panel</h2>
            </div>

            <nav className="flex-1 p-4 space-y-2">
              {[
                { name: "Dashboard", icon: HomeIcon, href: "/dashboard" },
                { name: "Browse Labors", icon: User, href: "/browse-labors" },
                { name: "Chats", icon: MessageSquare, href: "/chats" },
                { name: "Billing History", icon: Receipt, href: "/billing" },
                { name: "Total Works", icon: Briefcase, href: "/works" },
                { name: "View Profile", icon: User, href: "/labor/ProfilePage" },
              ].map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="flex items-center w-full px-4 py-3  rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors"
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  <span>{item.name}</span>
                </a>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-6">
            <div className="flex justify-center mb-8">
              <h1 className="text-3xl md:text-[35px] font-bold font-[Rockwell]">
                Welcome to Labor Dashboard
              </h1>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat) => (
                <div
                  key={stat.title}
                  className="bg-[#0f8585] p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center justify-between mb-4">
                    <stat.icon className="w-8 h-8 " />
                    <span className="text-2xl font-bold">{stat.value}</span>
                  </div>
                  <h3 className=" font-medium">{stat.title}</h3>
                </div>
              ))}
            </div>
          </div>
        </div>
        </>  
        )}
        
      </div>
    </div>
  );
};

export default LaborDashBoard;
