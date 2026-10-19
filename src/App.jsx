import { BrowserRouter, Routes, Route } from "react-router";
import { useState } from "react";
import WorkerList from './components/pages/Worker/WorkerList.jsx'
import AddWorker from './components/pages/Worker/AddWorker.jsx'
import ViewWorker from './components/pages/Worker/ViewWorker.jsx'
import EditWorker from "./components/pages/Worker/EditWorker.jsx";
import SalaryList from './components/pages/Salary/salarylist.jsx'
import Salaryadd from './components/pages/Salary/salaryadd.jsx'
import Salaryview from './components/pages/Salary/salaryview.jsx'
import Salarysheet from "./components/pages/Salary/salarysheet.jsx";
import Adddesignation from './components/pages/designation/Adddesignation.jsx'
import Viewdesignation from './components/pages/designation/Viewdesigantion.jsx'
import Listdesignation from './components/pages/designation/Listdesignation.jsx'
import EditDesignation from "./components/pages/designation/Editdesigantion.jsx";
import Addattendance from './components/pages/attendance/Addattendance.jsx'
import Viewattendance from './components/pages/attendance/Viewattendance.jsx'
import Listattendance from './components/pages/attendance/Listattendance.jsx'
import Editattendance from "./components/pages/attendance/Editattendance.jsx";
import Dashboard from './components/pages/Dashboard.jsx'
import BasicTables from './components/pages/Basic Tables/basic tables.jsx'


import Login from "./components/Login.jsx";
import Register from "./components/Register.jsx";
import Protected from './Auth/Protected.jsx';
import Logout from './Auth/Logout.jsx';


function App() {
   const [ isSignedIn, setIsSignedIn ] = useState(()=> {
    /* if you want, user will be logged in until they logout*/
    return localStorage.getItem("access_token") || false;
    /* if you want, user will be logged when they close the browser*/
    //return sessionStorage.getItem("access_token") || false;
  });
  return (
    
    <BrowserRouter>

        <Routes>
          
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/logout" element={<Logout />} />

          <Route element={<Protected isSignedIn={isSignedIn} />}>
            <Route path="/" element={<Dashboard />} />

            <Route path="workers">
              <Route index element={<WorkerList />} />
              <Route path="create" element={<AddWorker />} />
              <Route path="view/:id" element={<ViewWorker />} />
              <Route path="edit/:id" element={<EditWorker />} />
               
            </Route>
          </Route>
        </Routes>
        <Routes>
          <Route path="salary" element={<SalaryList />} />
          <Route path="salary/create" element={<Salaryadd />} />
          <Route path="salary/view/:id" element={<Salaryview />} />
          <Route path="salary/sheet" element={<Salarysheet />} />
        </Routes>

        <Routes>
          <Route path="designation" element={<Listdesignation />} />
          <Route path="designation/List" element={<Listdesignation />} />
          <Route path="designation/Add" element={<Adddesignation />} />
          <Route path="designation/View/:id" element={<Viewdesignation />} />
          <Route path="designation/Edit/:id" element={<EditDesignation />} />
        </Routes>

         <Routes>
          <Route path="attendance" element={<Listattendance />} />
          <Route path="attendance/List" element={<Listattendance />} />
          <Route path="attendance/Add" element={<Addattendance />} />
          <Route path="attendance/View/:id" element={<Viewattendance />} />
           <Route path="attendance/Edit/:id" element={<Editattendance />} />
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