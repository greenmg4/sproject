import '../styles/Header.css';
import { Link, useNavigate } from 'react-router-dom';
import { apiCall } from '../service/apiService';
import React, { useEffect, useState, useRef } from "react";
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
    const [isAdmin, setIsAdmin] = useState(false);

    //페이지 실행 시 즉시 실행되는 함수
    useEffect(() => {
    axios.get("http://localhost:8080/cust/admincheck", {
      withCredentials: true,
    })
    .then(() => {
      // 등급이 'A' → 관리자
      setIsAdmin(true);
    })
    .catch((err) => {
      setIsAdmin(false);
    });
  }, []);

    // ** 우측메뉴 처리에 대해 수정사항
    // => 현재는 Link 로 넘기고 각 Page 에서 fetchData 를 처리하지만,
    //    화면 흐름상 메뉴 클릭시 fetchData 결과에 따라 화면이동 하는것이 좋을듯

    // ** 서버 컨트롤러 연결 확인 하기 
    const serverTest = () => {
        let url='/test/check-server';
        apiCall(url, 'GET', null, null)
        .then((response) => {
            alert(`** 서버 API 연결 성공 => ${response.checkData}, ${response.checkLogin}`);
            // apiCall 에서는 response.data 값을 return 함.
        }).catch((err) => {
            alert(`** 서버 API 연결 실패 => ${err}`);
        });
    } //serverTest
    // 🐬📯 🐋 🐳 🎶
    const navigate = useNavigate();
    // ** Server 요청 함수
    const serverDataRequest = (url) => {
        // token 적용 이전
        //apiCall(url, 'GET', null, null)

        // token 적용 이후
        //alert(`** serverDataRequest 요청전 token 확인 =${token}`);
        apiCall(url, 'GET', null, null)
        .then((response) => {
            alert(`** serverDataRequest 성공 url=${url}`);
            sessionStorage.setItem("serverData", JSON.stringify(response));
            navigate(url);
        }).catch((err) => {
            if (err===502) { alert(`** 처리도중 오류 발생, err=${err}`);
            }else if (err===403) {
                  alert(`** Server Reject : 접근권한이 없습니다. => ${err}`); 
            }else alert(`** serverDataRequest 시스템 오류, err=${err}`);
        }); //apiCall
    } //serverDataRequest

    //채팅상담 이동 함수
    const goToChat = () => {
        navigate("/chat/rooms");
    };

    const goToProductPage = () => {
        navigate("product")
    }

    const goToPL = () => {
        navigate("productupload")
    }

    const callstatistics = (url) => {
        navigate(url);
    }

    const goToLogin = () => {navigate("/Login")};

    const goProductList = (url, jsonData) => {
        //console.log(`** proList url=${url}, jsonData=${jsonData}`);
        //alert(`** proList 요청전 url=${url}, jsonData=${JSON.stringify(jsonData)}`);
        
        navigate(url, { state: jsonData });
    };


    const [searchType, setSearchType] = useState("A"); // Default search type
    const [searchInput, setSearchInput] = useState(""); // Input value

    const handleSearch = () => {
        let searchData = {};
        if (searchType === "A") {
            searchData = { category: "A", category_nm: "통합검색", prod_nm: searchInput, author_nm: "" };
        } else if (searchType === "author") {
            searchData = { category: "A", category_nm: "저자 검색", prod_nm: "", author_nm: searchInput };
        }
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
        { id: "tooltip-it", category: "10", category_nm: "IT", icon: mdiDesktopClassic, tooltip: "IT" },
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
                        <span onClick={onLogout} className="header-menu-item">로그아웃</span><span>|</span>
                        <span className='header-menu-item' >내정보</span><span>|</span>
                        </>
                    ) : (
                        <>
                        <span className='header-menu-item' >회원가입</span><span>|</span>
                        <span onClick={goToLogin} className="header-menu-item">로그인</span><span>|</span>
                        </>
                    )
                }

                {/* <span className='header-menu-item' onClick={goToLogin}>로그인</span>| */}
                <span className='header-menu-item' >회원혜택</span><span>|</span>

                {isAdmin && (
                <>
                    <span className='header-menu-item' onClick={goToChat} >채팅상담</span><span>|</span>
                    <span className='header-menu-item' onClick={goToProductPage} >상품목록(관리자전용)</span><span>|</span>
                    <span className='header-menu-item' onClick={goToPL}> 상품업로드</span><span>|</span>
                    <span className='header-menu-item' onClick={() => { callstatistics("/statistics/data") }}>통계</span>
                    
                </>
                )}

            </div>

            {/*------------- 조회 영역 ---------------*/}
            {/* <div className="headerTop"> */}
            <div>

                <table style={{ width: '100%'}}>
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
                </table>
            </div>


            {/*------------- 카테고리 메뉴 ---------------*/}
            <div className='header-category-container'>
                {categories.map((item) => (
                    <span key={item.id} className='header-category-box' data-tooltip-id={item.id}>
                        <span onClick={() => { goProductList("/product/productlist", { category: item.category, category_nm: item.category_nm, prod_nm: "", author_nm: "" }) }}>
                            <Icon className='header-category-item' path={item.icon} size={1.4} />
                            <Tooltip id={item.id} content={item.tooltip} delayShow={10} style={{ fontSize: "13px" }} />
                        </span>
                    </span>
                ))}
            </div>

        </div> //headerTop
    ); //return
} //Header

export default Header;
