
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
import PasswordCheck from '../pages/UserJoin/PasswordCheck';
import UserJoin from '../pages/UserJoin/UserJoin';
import UserJoinP from '../pages/UserJoin/UserJoinP';
import UserAddress from '../pages/UserJoin/UserAddress';
import UserAddressF from '../pages/UserJoin/UserAddressF';
import UserAddressU from '../pages/UserJoin/UserAddressU';
import UserWithdraw from '../pages/UserJoin/UserWithdraw';
import OrderPayment from '../pages/OrderPayment';
import UserChatRoomList from './ChatRoom/UserChatRoomList';
import CustList from '../pages/Admin/AdminCustList';
import OrderList from '../pages/orderList';
import PasswordChange from '../pages/UserJoin/PasswordChange';
import AdminOrderRequest from '../pages/Admin/AdminOrderRequest';
import AdminChatRoomList from './ChatRoom/AdminChatRoomList';



function Main({onLoginSubmit, isLoggedIn, loginInfo, resetLoginInfo}) {
    return (
        <div>
        <Routes>
          {/* <Route path="/" element={<Main />} /> */}
          <Route path="/chat/rooms" element={<ChatRoomList />} /> 
          <Route path="/chat/:qna_no" element={<ChatRoom />} />
          <Route path="/userchatroomlist" element={<UserChatRoomList />} />
          <Route path="/product" element={<ProductPage />} />
          <Route path="/request" element={<AdminOrderRequest />} />
          <Route path="/productupload" element={<ProductUpload />} />
            <Route path="/product/update/:prodNo" element={<ProductUpdate />} />
            <Route path='/' element={<MainDefault />} />
            <Route path="/test/memberlist" element={<DbTestList />} />
            <Route path="/userjoinp" element={<UserJoinP />} />
            <Route path="/login" 
                   element={<Login onLoginSubmit={onLoginSubmit}/>}/>
            <Route path="/adminchatlist" element={<AdminChatRoomList/>} />                             
            <Route path="/userjoin" element={<UserJoin />} />
            <Route path="/userinfo" element={<UserInfo loginInfo={loginInfo} isLoggedIn={isLoggedIn} />} />
            <Route path="/useredit" element={<UserEdit loginInfo={loginInfo} isLoggedIn={isLoggedIn} />} />
            <Route path="/passwordcheck" element={<PasswordCheck loginInfo={loginInfo}/>} />
            <Route path="/password-change" element={<PasswordChange loginInfo={loginInfo} />} />
            <Route path="/useraddress" element={<UserAddress loginInfo={loginInfo} />}/>
             <Route path="/useraddressf" element={<UserAddressF loginInfo={loginInfo}/>} />
            <Route path="/useraddressu" element={<UserAddressU/>} />
            <Route path="/userwithdraw" element={<UserWithdraw resetLoginInfo={resetLoginInfo} />} />
            <Route path="/product/proList" element={<ProductList />} />
            <Route path="/product/:prod_no" element={<ProductDetail />} />
            <Route path="/custlist" element={<CustList />} />
            <Route path="/cart/addCart" element={<Cart />} />
            <Route path="/statistics/data" element={<StatisticsTab />} />
            <Route path="/order/payment" element={<OrderPayment />} />
            <Route path="/orderList" element={<OrderList/>} />
        </Routes>
        </div>
    );
}

export default Main;
