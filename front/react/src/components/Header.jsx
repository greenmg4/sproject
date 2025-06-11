import '../styles/Header.css';
import { Link, useNavigate } from 'react-router-dom';
import { apiCall } from '../service/apiService';
import { getUserInfo } from '../service/apiService';
import React, { useEffect, useState, useRef } from "react";

import Modal from 'react-modal';

import axios from "axios";

import { Icon } from "@mdi/react";
import { mdiHome
       , mdiMagnify
       , mdiAccountOutline	   
       , mdiBookMultiple, mdiBookOpenBlankVariantOutline, mdiDrawPen, mdiBabyFaceOutline
       , mdiNoodles, mdiHumanHandsup, mdiDramaMasks, mdiCrossOutline, mdiFilterOutline
       , mdiHubspot, mdiDesktopClassic  } from "@mdi/js";
import { Tooltip } from "react-tooltip";
// import { useSelector, useDispatch } from 'react-redux';


function Header({ cust_nm, token, isLoggedIn, onLogout }) {

    // 회원혜택 Modal Open 조건
    const [modalIsOpen, setModalIsOpen] = useState(false);
    // 회원혜택 Modal 닫기 함수
    const closeModal = () => setModalIsOpen(false);
    // 회원혜택 Modal 열기 함수
    const openModal = () => setModalIsOpen(true);
    // 회원혜택 정보
    const [MemberShipData, setMemberShipData] = useState([]); // 초기 상태를 빈 배열로 설정

    const [isAdmin, setIsAdmin] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoggedIn) return;
        axios.get("http://localhost:8080/cust/admincheck", {
            withCredentials: true
        })
        .then(() => setIsAdmin(true))
        .catch((err) => {
            if (err.response?.status === 403) {
            setIsAdmin(false);
            }
        });
    }, [isLoggedIn]);

    const serverTest = () => {
        let url = '/test/check-server';
        apiCall(url, 'GET', null, null)
        .then((response) => {
            alert(`** 서버 API 연결 성공 => ${response.checkData}, ${response.checkLogin}`);
        })
        .catch((err) => {
            alert(`** 서버 API 연결 실패 => ${err}`);
        });
    };

    const serverDataRequest = (url) => {
        apiCall(url, 'GET', null, null)
        .then((response) => {
            alert(`** serverDataRequest 성공 url=${url}`);
            sessionStorage.setItem("serverData", JSON.stringify(response));
            navigate(url);
        })
        .catch((err) => {
            if (err === 502) {
            alert(`** 처리도중 오류 발생, err=${err}`);
            } else if (err === 403) {
            alert(`** Server Reject : 접근권한이 없습니다. => ${err}`);
            } else {
            alert(`** serverDataRequest 시스템 오류, err=${err}`);
            }
        });
    };

    const goToChat = () => {
        navigate("/chat/rooms");
    };

    const goToUserChatList = () => {
        navigate("userchatroomlist");
    }

    const goToProductPage = () => {
        navigate("product");
    };

    const goToPL = () => {
        navigate("productupload")
    }

    const callstatistics = (url) => {
        navigate(url);
    }
    // 로그인
    const goToLogin = () => {navigate("/Login")};


    // 회원가입
    const goTouserJoin = () => {
        console.log("회원가입 버튼 클릭됨");
        navigate("/userjoinp")};



    // 내 정보 보기
    const goToUserInfo = () => {
    const cust_id = sessionStorage.getItem("loginID");
    if (!cust_id) {
        alert("로그인이 필요합니다.");
        return;
    }

    getUserInfo({ cust_id })
        .then((response) => {
            sessionStorage.setItem("userInfo", JSON.stringify(response));
            navigate("/userinfo");
        })
        .catch((error) => {
            console.error("사용자 정보 불러오기 실패:", error);
            alert("사용자 정보를 불러오지 못했습니다.");
        });
};
console.log(sessionStorage.getItem("loginID"))

    const goProductList = (url, jsonData) => {
        //console.log(`** proList url=${url}, jsonData=${jsonData}`);
        //alert(`** proList 요청전 url=${url}, jsonData=${JSON.stringify(jsonData)}`);
        
        navigate(url, { state: jsonData });
    };


    // 회원혜택
    const goMemberBenefit = (url) => {

        apiCall(url, 'GET', null, null)
        .then((response) => {
            if( response.length === 0) {
                setMemberShipData([]);
            } else {
    
                // API 응답 데이터를 productData 형식으로 변환
                const formattedData = response.map(item => ({
                    grade: item.grade,
                    disc_rate: item.disc_rate,
                    disc_max_amt: item.disc_max_amt.toLocaleString(),
                    std_amt: item.std_amt.toLocaleString(),
                }));
    
                setMemberShipData(formattedData);
            }
        })
        .catch((err) => {
            if (err === 502) {
            alert(`** 처리도중 오류 발생, err=${err}`);
            } else if (err === 403) {
            alert(`** Server Reject : 접근권한이 없습니다. => ${err}`);
            } else {
            alert(`** serverDataRequest 시스템 오류, err=${err}`);
            }
        });

        openModal();
    }



    const [searchType, setSearchType] = useState("A"); // Default search type
    const [searchInput, setSearchInput] = useState(""); // Input value

    const handleSearch = () => {
        let searchData = {};
        if (searchType === "A") {
            searchData = { prod_no: null, category: "A", category_nm: "통합검색", prod_nm: searchInput, author_nm: "" };
        } else if (searchType === "author") {
            searchData = { prod_no: null, category: "A", category_nm: "저자 검색", prod_nm: "", author_nm: searchInput };
        }
        alert   (`** 검색 요청전 url=/product/productlist, searchData=${JSON.stringify(searchData)}`);
        goProductList("/product/productlist", searchData);
    };

    const categories = [
        { id: "tooltip-all", category: "A", category_nm: "모든책", icon: mdiBookMultiple, tooltip: "모든책보기" },
        { id: "tooltip-novel", category: "01", category_nm: "소설", icon: mdiBookOpenBlankVariantOutline, tooltip: "소설" },
        { id: "tooltip-essay", category: "02", category_nm: "에세이", icon: mdiDrawPen, tooltip: "에세이" },
        { id: "tooltip-humanities", category: "03", category_nm: "인문", icon: mdiBabyFaceOutline, tooltip: "인문" },
        { id: "tooltip-food", category: "04", category_nm: "요리", icon: mdiNoodles, tooltip: "요리" },
        { id: "tooltip-health", category: "05", category_nm: "건강", icon: mdiHumanHandsup, tooltip: "건강" },
        { id: "tooltip-politics", category: "06", category_nm: "정치", icon: mdiDramaMasks, tooltip: "정치" },
        { id: "tooltip-religion", category: "07", category_nm: "종교", icon: mdiCrossOutline, tooltip: "종교" },
        { id: "tooltip-science", category: "08", category_nm: "과학", icon: mdiFilterOutline, tooltip: "과학" },
        { id: "tooltip-foreign", category: "09", category_nm: "외국어", icon: mdiHubspot, tooltip: "외국어" },
        { id: "tooltip-it", category: "10", category_nm: "IT", icon: mdiDesktopClassic, tooltip: "IT"},
    ];

    return (
        <div>

            {/*------------- 최상단 메뉴 ---------------*/}
            <div className="header-menu" >
                <Link to="/">
                    <Icon className='header-menu-item' path={mdiHome} size={1.4} data-tooltip-id="tooltip-home" />
                    <Tooltip id='tooltip-home' content="홈으로" delayShow={10} style={{ fontSize: "13px" }} />
                </Link>

                {/* 로그인/로그아웃 조건부 표시 */}
                {isLoggedIn ? (

                        <>
                        {/* <span style={{ color: 'green' }}>
                             <strong>{cust_nm}</strong> 님 환영합니다!</span>
                              &nbsp;&nbsp;&nbsp;&nbsp; */}
                        <span onClick={() => {setIsAdmin(false);onLogout()}} className="header-menu-item">로그아웃</span><span>|</span>
                        <span onClick={goToUserInfo} className='header-menu-item'>내정보</span><span>|</span>
                        </>
                    ) : (
                        <>
                        <span onClick={goTouserJoin} className='header-menu-item' >회원가입</span><span>|</span>
                        <span onClick={goToLogin} className="header-menu-item">로그인</span><span>|</span>
                        </>
                    )
                }

                {/* <span className='header-menu-item' onClick={goToLogin}>로그인</span>| */}
                <span onClick={() => navigate("cart/addCart")} className="header-menu-item">장바구니</span><span>|</span>
                <span onClick={() => goMemberBenefit("/membership/gradelist")} className='header-menu-item' >회원혜택</span><span>|</span>

                {isAdmin ? (
                <>
                    <span onClick={goToChat} className="header-menu-item">채팅상담(관리자전용)</span><span>|</span>
                    <span onClick={goToProductPage} className="header-menu-item">상품목록(관리자전용)</span><span>|</span>
                    <span onClick={goToPL} className="header-menu-item">상품업로드</span><span>|</span>
                    <span onClick={() => callstatistics("/statistics/data")} className="header-menu-item">통계</span><span>|</span>
                </>
                ) : (
                <>
                    <span onClick={goToUserChatList} className="header-menu-item">고객센터</span><span>|</span>
                </>
                )}


            </div> 

            {/*------------- 조회 영역 ---------------*/}
            {/* <div className="headerTop"> */}
            <div>          
                <table style={{ width: '100%'}}>
                    <tbody>
                    <tr>
                        <td style={{ width: '20%'}}>
                            {/* 로고 영역 */}
                            <span className='header-logo'>
                                <Link to="/">
                                    <img style={{ width: '80px', height:'60px', float:'left', paddingLeft:'10px'}} src="images/homeImages/main_logo.png" alt="로고" />
                                </Link>
                            </span>
                        </td>
                        <td style={{ width: '60%'}}>
                            <div className='header-search-container'>
                            <span className='header-search-box'>
                                <select 
                                    className='header-search-item' id="search-category" name="search-category"
                                    value={searchType}
                                    onChange={(e) => setSearchType(e.target.value)}
                                >
                                    <option value="A">통합 검색</option>
                                    <option value="author">저자 검색</option>
                                </select>

                                <input 
                                    style={{ width: "240px", height:"24px", border:"none", outline:"none" }} 
                                    type="text" 
                                    placeholder="검색어를 입력하세요" 
                                    value={searchInput}
                                    onChange={(e) => setSearchInput(e.target.value)}
                                />

                                <span 
                                    className='header-search-button'
                                    onClick={handleSearch}
                                >
                                    <Icon className='header-search-item' path={mdiMagnify} size={1.4}  />
                                </span>
                            </span>
                            </div>
                        </td>

                        <td style={{ width: '20%'}}> 
                            <div className='header-search-container'>
                            <span className='header-search-login-info'>
                                {/* 로그인/로그아웃 조건부 표시 */}
                                {isLoggedIn ? (
                                    <> <span style={{ color: 'green' }}><strong>{cust_nm}</strong> 님 환영합니다!</span> </>
                                ) : (
                                    <></>
                                )
                                }

                            </span>  {/* headerRight */}
                            </div>
                        </td>
                    </tr>
                    </tbody>
                </table>              
            </div>
			

            {/*------------- 카테고리 메뉴 ---------------*/}
            <div className='header-category-container'>
                {categories.map((item) => (
                    <span key={item.id} className='header-category-box' data-tooltip-id={item.id}>
                        <span onClick={() => { goProductList("/product/ProList", { prod_no:null , category: item.category, category_nm: item.category_nm, prod_nm: "", author_nm: "" }) }}>
                            <Icon className='header-category-item' path={item.icon} size={1.4} />
                            <Tooltip id={item.id} content={item.tooltip} delayShow={10} style={{ fontSize: "13px" }} />
                        </span>
                    </span>
                ))}
            </div>



            <Modal isOpen={modalIsOpen}
                onRequestClose={closeModal} // 모달 외부 클릭 시 닫힘
                style={{
                overlay: {
                    overflow: "hidden", // 오버레이 스크롤 방지
                    backgroundColor: "rgba(0, 0, 0, 0.7)", // 반투명 배경
                },      
                content: {
                    width: "800px", // 모달의 너비
                    height: "430px", // 모달의 높이
                    margin: "auto", // 화면 중앙 정렬
                    padding: "20px", // 내부 여백
                    borderRadius: "10px", // 둥근 모서리
                },
                }}
            >
                <div>
                    <h2 style={{textAlign: 'center', color: 'rgb(11, 119, 161)'}}> 멤버십 안내 </h2>
                    <hr style={{height:'5px', backgroundColor: 'rgb(220, 221, 213)', border: 'none' }}></hr>
                    <div >
                        <div style={{ fontSize:'16px',  color: 'rgb(97, 104, 163)', fontWeight: 'bold'}}>
                        도서 구매 금액에 따라, 등급이 부여가 됩니다.<br/>
                        각 등급 에 따른 혜택이 적용되어 구매시, 아래의 할인혜택을 적용받습니다.
                        </div>
                    </div>
                    
                    <br/>
                    <div style={{ height: "200px", textAlign: "center", padding: "10px", backgroundColor: 'rgb(236, 236, 230)', color: 'rgb(74, 59, 112)', fontWeight: 'bold' }}>
                        <table style={{ width: "775px", borderCollapse: "collapse", border:'1px solid #ccc' }}>
                            <thead>
                                <tr style={{ borderBottom:'1px solid rgb(188, 190, 171)', backgroundColor:'rgb(223, 233, 223)' }}>
                                    <th style={{ width: '20%', height:'50px'}}>등급</th>
                                    <th style={{ width: '20%', height:'50px'}}>할인율</th>
                                    <th style={{ width: '30%', height:'50px'}}>최대할인금액</th>
                                    <th style={{ width: '30%', height:'50px'}}>등급 업 구매금액</th>
                                </tr>
                            </thead>
                            <tbody>
                                {MemberShipData.map((item, index) => (
                                    <tr style={{ height: "35px"}} key={index}>
                                        <td>{item.grade}</td>
                                        <td>{item.disc_rate} %</td>
                                        <td>{item.disc_max_amt} 원</td>
                                        <td>{item.std_amt} 원</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <br />
                        <br />
                    </div>
                    
                    <br/>
                    <div style={{textAlign: 'center'}}>
                        <button style={{fontSize:'13px',  width:'90px', height:'30px', borderRadius: '5px', backgroundColor:'rgb(223, 233, 223)'}} onClick={closeModal}>닫기</button>
                    </div>
                </div>
            </Modal>

        </div> //headerTop
    ); //return
} //Header



export default Header;

