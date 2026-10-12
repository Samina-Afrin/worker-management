import { BrowserRouter, Routes, Route } from "react-router";
import { useState } from "react";
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
import Dashboard from './components/pages/Dashboard.jsx'
import BasicTables from './components/pages/Basic Tables/basic tables.jsx'

import Login from "./components/Login.jsx";
import Register from "./components/Register.jsx";
import Protected from './Auth/Protected.jsx';
import Logout from './Auth/Logout.jsx';


function App() {
   const [ isSignedIn, setIsSignedIn ] = useState(()=> {
    /* if you want, user will be logged in until they logout*/
    //return localStorage.getItem("access_token") || false;
    /* if you want, user will be logged when they close the browser*/
    return sessionStorage.getItem("access_token") || false;
  });
  return (
    
    <BrowserRouter>

        <Routes>
          
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/logout" element={<Logout />} />

          <Route element={<Protected isSignedIn={isSignedIn} />}>
            <Route index element={<Dashboard />} />

            <Route path="workers">
              <Route index element={<WorkerList />} />
              <Route path="create" element={<AddWorker />} />
              <Route path="edit/:id" element={<EditWorker />} />
              <Route path="view/:id" element={<ViewWorker />} />
            </Route>
          </Route>
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
      
      

    </BrowserRouter>
  );
}

export default App;