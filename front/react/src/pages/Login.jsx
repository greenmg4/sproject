import '../styles/Main.css';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Login = ({onLoginSubmit}) => {
    const [cust_Id, setUserId] = useState("");
    const [Password, setUserPassword] = useState("");
    
    return (
        <div className='body_container'>
            <hr />
            <h2 style={{color:'#708090'}}>로그인 </h2>
            <div>
                <form onSubmit={ (e) => {
                    e.preventDefault();
                    onLoginSubmit(cust_Id, Password)}} >
                    <input type="text" name="cust_id" placeholder="아이디" 
                           size={20} value={cust_Id} 
                           onChange={(e) => setUserId(e.target.value)}
                           required 
                           pattern="^[a-z0-9]{4,10}$"  
                    /><br/>
                    <input type="password" name="Password" placeholder="비밀번호"
                           size={20} value={Password} 
                           onChange={(e) => setUserPassword(e.target.value)} 
                           required
                           minlength="4"
                    /><br/><br/>
                    <input type="submit" className="loginBtn" value="로그인" style={{width:175}}/><br/><br/>
                </form>
                
                <span>
                    <span>아직 회원이 아니신가요?</span>&nbsp;
                    <Link to="/join" style={{color:'#7547a3'}}>&nbsp;&nbsp;
                        <strong>회원가입 ✔</strong>
                    </Link>
                </span>
            </div>
        </div>
    ); //return
}; //Login

export default Login;