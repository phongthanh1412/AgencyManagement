import React, { useState } from "react";
import "../App.css";

function Sidebar({ currentPage, onNavigate, user }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const menuItems = [
    {
      id: 'agency',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z" />
        </svg>
      ),
      label: 'Agency',
      page: 'agency'
    },
    {
      id: 'export-receipt',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
        </svg>
      ),
      label: 'Export Receipt',
      page: 'export-receipt'
    },
    {
      id: 'payment-receipt',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 14V6c0-1.1-.9-2-2-2H3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zm-9-1c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm13-6v11c0 1.1-.9 2-2 2H4v-2h17V7h2z" />
        </svg>
      ),
      label: 'Payment Receipt',
      page: 'payment-receipt'
    },
    {
      id: 'revenue-report',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z" />
        </svg>
      ),
      label: 'Revenue Report',
      page: 'revenue-report'
    },
    {
      id: 'debt-report',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z" />
        </svg>
      ),
      label: 'Debt Report',
      page: 'debt-report'
    },
  ];

  const adminTools = [
    {
      id: 'add-agency',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
        </svg>
      ),
      label: 'Add Agency',
      page: 'add-agency'
    },
    {
      id: 'system-regulation',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.07.62-.07.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
        </svg>
      ),
      label: 'System Regulation',
      page: 'system-regulation'
    },
  ];

  const staffTools = [
    {
      id: 'create-export',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
        </svg>
      ),
      label: 'Create Export Receipt',
      page: 'create-export-receipt'
    },
    {
      id: 'create-payment',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
        </svg>
      ),
      label: 'Create Payment Receipt',
      page: 'create-payment-receipt'
    },
  ];

  const tools = user?.role?.toLowerCase() === 'admin' ? adminTools : staffTools;
  const toolsLabel = user?.role?.toLowerCase() === 'admin' ? 'ADMIN TOOLS' : 'STAFF TOOLS';

  return (
    <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <button className="sidebar-toggle" onClick={() => setIsCollapsed(!isCollapsed)} title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="black" stroke="black" style={{ transform: isCollapsed ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease' }}>
          <path d="M11.41 12l4.29-4.29-1.41-1.41L8.59 12l5.7 5.7 1.41-1.41z" />
          <path d="M6.41 12l4.29-4.29-1.41-1.41L3.59 12l5.7 5.7 1.41-1.41z" />
        </svg>
      </button>

      {!isCollapsed && (
        <>
          <div className="sidebar-header" onClick={() => onNavigate('general')} style={{ cursor: 'pointer' }}>
            <div className="sidebar-logo">
              <img src="/travel-agency.png" alt="Agency Logo" style={{ width: 32, height: 32, objectFit: 'contain' }} />
            </div>
            <div className="sidebar-title">Agency System</div>
            <div className="sidebar-subtitle">Management Platform</div>
          </div>

          <div className="sidebar-menu-label">MAIN MENU</div>
          <nav className="sidebar-menu">
            <ul>
              {menuItems.map((item) => (
                <li
                  key={item.id}
                  onClick={() => onNavigate(item.page)}
                  className={currentPage === item.page ? 'active' : ''}
                >
                  <span className="menu-icon">{item.icon}</span>
                  {item.label}
                </li>
              ))}
            </ul>
          </nav>

          <div className="sidebar-tools-label">{toolsLabel}</div>
          <div className="sidebar-tools">
            {tools.map((tool) => (
              <button
                key={tool.id}
                className={`sidebar-tool-btn ${currentPage === tool.page ? 'active' : ''}`}
                onClick={() => onNavigate(tool.page)}
              >
                {tool.icon}
                <span>{tool.label}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </aside>
  );
}

export default Sidebar;