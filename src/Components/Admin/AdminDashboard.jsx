import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import HeroEditor from "./HeroEditor";
import ServicesEditor from "./ServicesEditor";
import AboutEditor from "./AboutEditor";
import ContactEditor from "./ContactEditor";
import TeamEditor from "./TeamEditor";
import { FiHome, FiSettings, FiUsers, FiPhone, FiLogOut } from "react-icons/fi";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("hero");
  const { signOut } = useAuth();

  const tabs = [
    { id: "hero", label: "Homepage Hero", icon: FiHome },
    { id: "services", label: "Services", icon: FiSettings },
    { id: "about", label: "About Section", icon: FiHome },
    { id: "contact", label: "Contact Info", icon: FiPhone },
    { id: "team", label: "Team Members", icon: FiUsers },
  ];

  const handleSignOut = async () => {
    if (window.confirm("Are you sure you want to sign out?")) {
      await signOut();
      window.location.href = "/";
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 pt-36 pb-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Admin Dashboard</h1>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            <FiLogOut />
            Sign Out
          </button>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Tab Navigation */}
          <div className="flex overflow-x-auto border-b border-gray-200">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 whitespace-nowrap font-medium transition-colors ${
                    activeTab === tab.id
                      ? "text-heroBg border-b-2 border-heroBg"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  <Icon className="size-5" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === "hero" && <HeroEditor />}
            {activeTab === "services" && <ServicesEditor />}
            {activeTab === "about" && <AboutEditor />}
            {activeTab === "contact" && <ContactEditor />}
            {activeTab === "team" && <TeamEditor />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
