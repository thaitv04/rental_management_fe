import './App.css';
import "bootstrap/dist/css/bootstrap.min.css"
import { Route, Router, Routes } from "react-router-dom"
import Home from './components/home';
import Create from './components/Create';
import Edit from './components/Edit';
import Detail from "./components/detail";
import HostList from "./components/host";
import Login from './components/Login';
import History from './components/History';
import Confirm from "./components/confirm";

function App() {
    return (
        <>
            <Routes>
                <Route path='/home' element={<Home />}></Route>
                <Route path='/create' element={<Create />}></Route>
                <Route path='/edit/:id' element={<Edit />}></Route>
                <Route path='/detail/:id' element={<Detail />}></Route>
                <Route path='/host' element={< HostList />}></Route>
                <Route path='/' element={< Login />}></Route>
                <Route path='/history/:id' element={<History />}></Route>
                <Route path='/order/:id' element={<Confirm />}></Route>

            </Routes>
        </>
    );
}
export default App;
