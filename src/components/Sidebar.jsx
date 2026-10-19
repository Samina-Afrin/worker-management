import { NavLink } from 'react-router'
function Sidebar() {
    return (
<div className="sidebar-wrapper" id="sidebar">
        
        <a href="index.html" className="sidebar-brand">
        <i className="bi bi-asterisk"></i>
        <span>Spark Admin</span>
        </a>

        <div className="flex-grow-1 overflow-y-auto">
        
        <div className="sidebar-menu-section">
            <div className="sidebar-menu-title">Menu</div>
            <ul className="sidebar-menu-list">
            <li className="sidebar-menu-item">
                <NavLink to="/Dashboard" className="sidebar-menu-link active" id="menu-overview" title="Overview">
                <i className="bi bi-grid-fill"></i>
                <span>Dashboard</span>
                </NavLink>
            </li>
            </ul>
        </div>

        
        <div className="sidebar-menu-section">
            <div className="sidebar-menu-title">Components</div>
            <ul className="sidebar-menu-list">
            <li className="sidebar-menu-item">
                <NavLink to="/basic-tables" className="sidebar-menu-link" id="menu-basictables" title="Basic Tables">
                <i className="bi bi-table"></i>
                <span>Basic Tables</span>
                </NavLink>
            </li>
           
            </ul>
        </div>

        
        <div className="sidebar-menu-section">
            <div className="sidebar-menu-title">Pages</div>
            <ul className="sidebar-menu-list">
            <li className="sidebar-menu-item">
                <NavLink to="/workers" className="sidebar-menu-link" id="menu-uibuttons" title="Buttons">
                <i className="bi bi-person-workspace"></i>
                <span>Worker</span>
                </NavLink>
            </li>
            <li className="sidebar-menu-item">
                <NavLink to="/designation" className="sidebar-menu-link" id="menu-uiforms" title="designation">
                <i className="bi bi-person-badge"></i>
                <span>designation</span>
                </NavLink>
            </li>
            <li className="sidebar-menu-item">
                <NavLink to="/salary" className="sidebar-menu-link" id="menu-404" title="404 Page">
                <i className="bi bi-cash-stack"></i>
                <span>Salary</span>
                </NavLink>
            </li>
              <li className="sidebar-menu-item">
                <NavLink to="/attendance" className="sidebar-menu-link" id="menu-blankpage" title="attendance">
                <i className="bi bi-clock-fill"></i>
                <span>Attendance</span>
                </NavLink>
            </li>
            </ul>
        </div>
        </div>
        

        
        <div className="sidebar-profile">
        <img src="assets/images/avatar.png" alt="Administrator" className="sidebar-profile-img"
            onError="this.src='https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop'"/>
        <div className="sidebar-profile-info">
            <div className="sidebar-profile-name">Administrator</div>
            <div className="sidebar-profile-email">admin@email.com</div>
        </div>
        </div>
    </div>
    );
}

export default Sidebar