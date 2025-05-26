
import { Routes, Route} from 'react-router-dom';
import MainDefault from '../pages/MainDefault';
import DbTestList from '../pages/DbTestList';
import Login from '../pages/Login';
import ProductList from '../pages/ProductList';
import ProductDetail from '../pages/ProductDetail';
import Cart from '../pages/Cart';
function Main({onLoginSubmit }) {
    return (
        <div>
        <Routes>
            <Route path='/' element={<MainDefault />} />
            <Route path="/test/memberlist" element={<DbTestList />} />
            <Route path="/login" 
                   element={<Login onLoginSubmit={onLoginSubmit}/>}/>
            <Route path="/product/proList" element={<ProductList />} />
            <Route path="/product/:prod_no" element={<ProductDetail />} />
            <Route path="/cart/addCart" element={<Cart />} />
        </Routes>
        </div>
    );
}

export default Main;
