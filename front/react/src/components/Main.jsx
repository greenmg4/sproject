
import { Routes, Route} from 'react-router-dom';
import MainDefault from '../pages/MainDefault';
import DbTestList from '../pages/DbTestList';
import Login from '../pages/Login';
import ProductList from '../pages/ProductList';
import ProductDetail from '../pages/ProductDetail';
import Cart from '../pages/Cart';

import ChatRoomList from './components/ChatRoom/ChatRoomList';
import ChatRoom from './components/ChatRoom/ChatRoom';
import ProductPage from "./components/Product/ProductPage";
import ProductUpload from "./components/Product/ProductUpload";
import ProductUpdate from "./components/Product/ProductUpdate";

function Main({onLoginSubmit }) {
    return (
        <div>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/chat/rooms" element={<ChatRoomList />} /> 
          <Route path="/chat/:roomId" element={<ChatRoom />} />
          <Route path="/product" element={<ProductPage />} />
          <Route path="/productupload" element={<ProductUpload />} />
            <Route path="/product/update/:prodNo" element={<ProductUpdate />} />
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
