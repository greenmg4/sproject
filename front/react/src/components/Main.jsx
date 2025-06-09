
import { Routes, Route} from 'react-router-dom';
import MainDefault from '../pages/MainDefault';
import DbTestList from '../pages/DbTestList';
import Login from '../pages/Login';
import ProductList from '../pages/ProductList';
import ProductDetail from '../pages/ProductDetail';
import Cart from '../pages/Cart';

import ChatRoomList from './ChatRoom/ChatRoomList';
import ChatRoom from './ChatRoom/ChatRoom';
import ProductPage from './Product/ProductPage';
import ProductUpload from './Product/ProductUpload';
import ProductUpdate from './Product/ProductUpdate';
import StatisticsTab from '../pages/Statistics/StatisticsTab';
import UserInfo from '../pages/UserInfo';
import UserEdit from '../pages/UserEdit';
import UserJoin from '../pages/UserJoin/UserJoin';
import UserJoinP from '../pages/UserJoin/UserJoinP';
import OrderPayment from '../pages/OrderPayment';
import UserChatRoomList from './ChatRoom/UserChatRoomList';


function Main({onLoginSubmit }) {
    return (
        <div>
        <Routes>
          {/* <Route path="/" element={<Main />} /> */}
          <Route path="/chat/rooms" element={<ChatRoomList />} /> 
          <Route path="/chat/:qna_no" element={<ChatRoom />} />
          <Route path="/userchatroomlist" element={<UserChatRoomList />} />
          <Route path="/product" element={<ProductPage />} />
          <Route path="/productupload" element={<ProductUpload />} />
            <Route path="/product/update/:prodNo" element={<ProductUpdate />} />
            <Route path='/' element={<MainDefault />} />
            <Route path="/test/memberlist" element={<DbTestList />} />
            <Route path="/userjoinp" element={<UserJoinP />} />
            <Route path="/login" 
                   element={<Login onLoginSubmit={onLoginSubmit}/>}/>            
            <Route path="/userjoin" element={<UserJoin />} />
            <Route path="/userinfo" element={<UserInfo />} />
            <Route path="/useredit" element={<UserEdit />} />
            <Route path="/product/proList" element={<ProductList />} />
            <Route path="/product/:prod_no" element={<ProductDetail />} />
            <Route path="/cart/addCart" element={<Cart />} />
            <Route path="/statistics/data" element={<StatisticsTab />} />
            <Route path="/order/payment" element={<OrderPayment />} />
        </Routes>
        </div>
    );
}

export default Main;
