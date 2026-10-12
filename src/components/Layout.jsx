import React from 'react';
import Sidebar from "./Sidebar.jsx";
import Header from "./Header.jsx";
import Footer from "./Footer.jsx";
 
function Layout({children}) {
  return (
        <> 
            <Sidebar />
            <div className="main-wrapper">
                <Header />
                {children}
                <Footer />
            </div>
      </>
  )
}
export default Layout