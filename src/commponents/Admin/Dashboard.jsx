import React from "react";
import { Users, FileText, MessageSquare, DollarSign } from "lucide-react";

const stats = [
  { title: "Total Users", value: "1,234", icon: Users, color: "bg-blue-500" },
  {
    title: "Total Articles",
    value: "56",
    icon: FileText,
    color: "bg-green-500",
  },
  {
    title: "Active Chats",
    value: "23",
    icon: MessageSquare,
    color: "bg-yellow-500",
  },
  {
    title: "Total Revenue",
    value: "$12,345",
    icon: DollarSign,
    color: "bg-purple-500",
  },
];

function Dashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Dashboard Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <h2 className="text-gray-600 text-sm">{stat.title}</h2>
                  <p className="text-2xl font-semibold">{stat.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Activities</h2>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((_, i) => (
              <div
                key={i}
                className="flex items-center py-2 border-b last:border-0"
              >
                <div className="w-2 h-2 rounded-full bg-blue-500 mr-3"></div>
                <div>
                  <p className="text-sm text-gray-600">New user registered</p>
                  <p className="text-xs text-gray-400">2 hours ago</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Latest Transactions</h2>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((_, i) => (
              <div
                key={i}
                className="flex items-center justify-between py-2 border-b last:border-0"
              >
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-gray-200 mr-3"></div>
                  <div>
                    <p className="text-sm font-medium">Transaction #{i + 1}</p>
                    <p className="text-xs text-gray-500">User ID: {1000 + i}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-green-600">+$99.00</p>
                  <p className="text-xs text-gray-500">Today</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

