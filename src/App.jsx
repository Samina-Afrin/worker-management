import { BrowserRouter, Routes, Route } from "react-router";
import Sidebar from "./components/Sidebar.jsx";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import WorkerList from './components/pages/Worker/WorkerList.jsx'
import AddWorker from './components/pages/Worker/AddWorker.jsx'
import EditWorker from './components/pages/Worker/EditWorker.jsx'
import ViewWorker from './components/pages/Worker/ViewWorker.jsx'
import SalaryList from './components/Salary/salarylist.jsx'
import SalaryDetails from './components/Salary/salarydetails.jsx'
import SalaryAdd from './components/Salary/salaryadd.jsx'
import SalaryView from './components/Salary/SalaryView.jsx'
import AddDesignation from './components/pages/Designation/AddDesignation.jsx'
import EditDesignation from './components/pages/Designation/EditDesignation.jsx'
import ViewDesignation from './components/pages/Designation/ViewDesignation.jsx'
import ListDesignation from './components/pages/Designation/ListDesignation.jsx'
import Dashboard from './components/pages/Dashboard/Dashboard.jsx'
import BasicTables from './components/pages/Basic Tables/basic tables.jsx'



function App() {
  return (
    
    <BrowserRouter>
      <Sidebar />
      <div className="main-wrapper">
        <Header />

        <Routes>
          <Route index element={<Dashboard />} />
          <Route path="workers" element={<WorkerList />} />
          <Route path="workers Management/add" element={<AddWorker />} />
          <Route path="workers Management/edit/:id" element={<EditWorker />} />
          <Route path="workers Management/view/:id" element={<ViewWorker />} />
          
        </Routes>
        <Routes>
          <Route path="salary" element={<SalaryList />} />
          <Route path="salary/details/:id" element={<SalaryDetails />} />
          <Route path="salary/add" element={<SalaryAdd />} />
          <Route path="salary/view/:id" element={<SalaryView />} />
        </Routes>

        <Routes>
          <Route path="designation" element={<ListDesignation />} />
          <Route path="designation/add" element={<AddDesignation />} />
          <Route path="designation/edit/:id" element={<EditDesignation />} />
          <Route path="designation/view/:id" element={<ViewDesignation />} />
        </Routes>
         
        <Routes>
          <Route path="dashboard" element={<Dashboard />} />
        </Routes>
        <Routes>
          <Route path="basic-tables" element={<BasicTables />} />
        </Routes>
      
        <Footer />
      </div>
      
      

    </BrowserRouter>
  );
}

export default App;