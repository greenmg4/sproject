
import { Routes, Route} from 'react-router-dom';
import MainDefault from '../pages/MainDefault';
import DbTestList from '../pages/DbTestList';
import Login from '../pages/Login';
import ProductList from '../pages/ProductList';
function Main({onLoginSubmit }) {
    return (
        <div>
        <Routes>
            <Route path='/' element={<MainDefault />} />
            <Route path="/test/memberlist" element={<DbTestList />} />
            <Route path="/login" 
                   element={<Login onLoginSubmit={onLoginSubmit}/>}/>
            <Route path="/product/proList" element={<ProductList />} />
        </Routes>
        </div>
    );
}

export default Main;
