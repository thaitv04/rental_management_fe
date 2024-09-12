import React, { useState } from "react";
import "../sidebar/sidebar.css";

function SideBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState();


  const openNav = () => {
    setIsOpen(true);
  };

  const closeNav = () => {
    setIsOpen(false);
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setIsOpen(false); // Close the sidebar after selecting a tab
  };

  return (
    <div>
      <div className={isOpen ? "sidebar open" : "sidebar"}>
        <a href="#" className="closebtn" onClick={closeNav}>
          ×
        </a>
        <a 
          href="/host" 
          className={activeTab === "About" ? "active" : ""} 
          onClick={() => handleTabClick("About")}
        >
          Nhà đang cho thuê
        </a>
        <a 
          href="/create" 
          className={activeTab === "Services" ? "active" : ""} 
          onClick={() => handleTabClick("Services")}
        >
          Thêm nhà cho thuê
        </a>
        <a 
          href="/history" 
          className={activeTab === "Clients" ? "active" : ""} 
          onClick={() => handleTabClick("Clients")}
        >
          Lịch sử thuê
        </a>
        <a 
          href="#contact" 
          className={activeTab === "Contact" ? "active" : ""} 
          onClick={() => handleTabClick("Contact")}
        >
          Contact
        </a>
      </div>
      <div id="main">
        <button className="openbtn" onClick={openNav}>
          ☰
        </button>
        <div className="content">
          {activeTab === "About" && <div></div>}
          {activeTab === "Services" && <div></div>}
          {activeTab === "Clients" && <div></div>}
          {activeTab === "Contact" && <div></div>}
        </div>
      </div>
    </div>
  );
}

export default SideBar;