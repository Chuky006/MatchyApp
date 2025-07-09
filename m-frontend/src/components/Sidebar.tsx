import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react"; //lucide-react for icons

interface SidebarLink {
  label: string;
  path: string;
  onClick?: () => void;
}

const Sidebar = ({ links }: { links: SidebarLink[] }) => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Mobile Topbar Menu Toggle */}
      <div className="md:hidden bg-purple-700 text-white flex justify-between items-center px-4 py-3 shadow font-sans">
        <div className="text-lg font-bold tracking-wide">MATCHY</div>
        <button onClick={handleToggle}>
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`${
          isOpen ? "block" : "hidden"
        } md:block w-64 h-screen bg-purple-800 text-white fixed top-0 left-0 z-40 md:z-auto shadow-lg font-sans`}
      >
        <div className="p-6 font-bold text-2xl border-b border-purple-600 hidden md:block">
          MATCHY
        </div>
        <nav className="flex flex-col mt-4 space-y-2 p-4">
          {links.map((link) => (
            <button
              key={link.label}
              onClick={() => {
                if (link.onClick) link.onClick();
                setIsOpen(false); //close menu on mobile after click
              }}
              className={`text-left px-4 py-2 rounded w-full transition font-medium ${
                location.pathname === link.path
                  ? "bg-purple-600 text-white"
                  : "hover:bg-purple-700"
              }`}
            >
              {link.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Content shift on desktop */}
      <div className="md:ml-64" />
    </>
  );
};

export default Sidebar;
