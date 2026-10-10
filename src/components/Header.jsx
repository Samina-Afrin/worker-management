
import React from "react";

const Header = () => {
  return (
      <header className="navbar-custom">

        {/* Left Section */}
        <div className="navbar-left">
      <button
        className="btn-desktop-toggle d-none d-xl-flex align-items-center justify-content-center me-3"
        id="desktop-sidebar-toggle"
        aria-label="Minimize Sidebar">

         <i className="bi bi-chevron-bar-left"></i>
       </button>

          <button
            className="sidebar-toggle-btn me-2"
            id="sidebar-toggle"
            aria-label="Toggle Navigation">
          
            <i className="bi bi-list"></i>
          </button>

          {/* Quick Action */}
          <div className="dropdown ms-2">
            <button
              className="btn-quick-action dropdown-toggle"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              id="quick-actions-dropdown">
            
              <i className="bi bi-plus-lg"></i>
              <span>Create</span>
            </button>

            <ul
              className="dropdown-menu dropdown-menu-quick-action"
              aria-labelledby="quick-actions-dropdown">
            
              <li className="dropdown-header">
                Quick Action Shortcuts
              </li>

              <li>
                <a className="dropdown-item" href="#">
                  <i className="bi bi-file-earmark-plus"></i>
                  <span>New Invoice</span>
                </a>
              </li>

              <li>
                <a className="dropdown-item" href="#">
                  <i className="bi bi-person-plus"></i>
                  <span>New User</span>
                </a>
              </li>

              <li>
                <a className="dropdown-item" href="#">
                  <i className="bi bi-box-seam"></i>
                  <span>New Product</span>
                </a>
              </li>

              <li>
                <hr className="dropdown-divider" />
              </li>

              <li>
                <a className="dropdown-item" href="#">
                  <i className="bi bi-gear"></i>
                  <span>System Settings</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Search Section */}
        <div className="navbar-search-wrapper">
          <input
            type="text"
            className="navbar-search-input"
            placeholder="Search anything in Spark..."
            id="main-search"
          />

          <button
            className="navbar-search-btn"
            aria-label="Search">
          
            <i className="bi bi-search"></i>
          </button>
        </div>

        {/* Right Section */}
        <div className="navbar-actions">

          {/* Fullscreen Button */}
          <button
            className="navbar-action-btn me-1"
            aria-label="Toggle Fullscreen"
            id="btn-fullscreen">
          
            <i className="bi bi-arrows-fullscreen"></i>
          </button>

          {/* Notification */}
          <div className="dropdown">
            <button
              className="navbar-action-btn dropdown-toggle"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              id="btn-notifications"
              data-bs-auto-close="outside">
            
              <i className="bi bi-bell"></i>
              <span className="navbar-action-badge"></span>
            </button>

            <div
              className="dropdown-menu dropdown-menu-end dropdown-menu-notification p-0"
              aria-labelledby="btn-notifications">
            
              <div className="notification-header">
                <h6 className="notification-title">
                  Notifications
                </h6>

                <button
                  className="btn-clear-all"
                  type="button">
                
                  Mark all read
                </button>
              </div>

              <div className="notification-list">

                {/* Notification 1 */}
                <a href="#" className="notification-item">
                  <div className="notification-icon bg-success text-white">
                    <i className="bi bi-wallet2"></i>
                  </div>

                  <div className="notification-content">
                    <p className="notification-text">
                      New sale received: <strong>$150.00</strong>
                    </p>

                    <span className="notification-time">
                      2 mins ago
                    </span>
                  </div>

                  <span className="notification-unread-dot"></span>
                </a>

                {/* Notification 2 */}
                <a href="#" className="notification-item">
                  <div className="notification-icon bg-primary text-white">
                    <i className="bi bi-person-plus-fill"></i>
                  </div>

                  <div className="notification-content">
                    <p className="notification-text">
                      New user registered: <strong>John Doe</strong>
                    </p>

                    <span className="notification-time">
                      1 hour ago
                    </span>
                  </div>

                  <span className="notification-unread-dot"></span>
                </a>

                {/* Notification 3 */}
                <a href="#" className="notification-item">
                  <div className="notification-icon bg-warning text-dark">
                    <i className="bi bi-box-seam-fill"></i>
                  </div>

                  <div className="notification-content">
                    <p className="notification-text">
                      Stock running low: <strong>Hoodie</strong>
                    </p>

                    <span className="notification-time">
                      3 hours ago
                    </span>
                  </div>
                </a>

              </div>

              <a href="#" className="notification-footer">
                View All Notifications
              </a>
            </div>
          </div>

          {/* Profile */}
          <div className="dropdown ms-2">
            <button
              className="navbar-profile-btn dropdown-toggle"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              id="profile-dropdown">
            
              <img
                src="/assets/images/avatar.png"
                alt="Profile Image"
                className="navbar-profile-img"
              />

              <span className="navbar-profile-name d-none d-md-inline">
                Administrator
              </span>

              <i className="bi bi-chevron-down navbar-profile-caret"></i>
            </button>

            <ul
              className="dropdown-menu dropdown-menu-end dropdown-menu-profile"
              aria-labelledby="profile-dropdown">
            
              <li className="dropdown-header">
                Welcome!
              </li>

              <li>
                <a className="dropdown-item" href="#">
                  <i className="bi bi-person"></i>
                  <span>My Account</span>
                </a>
              </li>

              <li>
                <a className="dropdown-item" href="#">
                  <i className="bi bi-gear"></i>
                  <span>Settings</span>
                </a>
              </li>

              <li>
                <a className="dropdown-item" href="#">
                  <i className="bi bi-lock"></i>
                  <span>Lock Screen</span>
                </a>
              </li>

              <li>
                <hr className="dropdown-divider" />
              </li>

              <li>
                <a
                  className="dropdown-item text-danger"
                  href="page-login.html">
                
                  <i className="bi bi-box-arrow-right"></i>
                  <span>Logout</span>
                </a>
              </li>
            </ul>
          </div>

        </div>
      </header>
  );
}

export default Header;
