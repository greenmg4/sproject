import { useNavigate } from 'react-router-dom';
import { apiCall } from '../service/apiService';
import '../styles/Main.css';

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function MainDefault() {
    const navigate = useNavigate();
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

        const settings = {
            dots: true,  // 네비게이션 점 표시
            infinite: true,  // 무한 루프 설정
            speed: 1200,  // 애니메이션 속도
            slidesToShow: 2,  // 한 번에 보여줄 슬라이드 개수
            slidesToScroll: 1,  // 한 번에 스크롤될 개수
            autoplay: true,  // 자동 슬라이드
            autoplaySpeed: 5000, // 자동 슬라이드 속도 (5초)
        };

        const products = [
            { prod_no: 1, prod_nm: "불편한편의점", image: "/images/recommendation/00001.png" },
            { prod_no: 2, prod_nm: "최소한의한국사", image: "/images/recommendation/00002.png" },
            { prod_no: 3, prod_nm: "비스킷", image: "/images/recommendation/00003.png" },
            
            //{ prod_no: 1, category:"", category_nm :"", prod_nm:"", author_nm:""}
            //{ prod_no: 2, category:"", category_nm :"", prod_nm:"", author_nm:""}
            //{ prod_no: 3, category:"", category_nm :"", prod_nm:"", author_nm:""}
        ];

        const handleDoublClick = (product) => {
            
            //let jsonData = { prod_no: `${product.prod_no}`, category: "A", category_nm: "", prod_nm: `${product.prod_nm}`, author_nm: "" };
            let jsonData = { prod_no: `${product.prod_no}`, category: "", category_nm: "", prod_nm: "", author_nm: "" };
            //alert(JSON.stringify(jsonData, null, 2));

            navigate("/product/ProList", { state: jsonData });
        };

    return (
        <div className='body_container'>
            <hr></hr>
            {/* <h3>~~ Main 영역 ~~</h3> */}
            <div id="contents">

            { ( products.length === 0) ? 
                (
                <img alt="MainImage" src="images/homeImages/library01.png" width={800} height={400} /> 

                ) :
                (
                    <div style={  { width: "80%", margin: "0 auto", paddingTop: "20px" }}>
                        <Slider {...settings}>
                        {products.map((product) => (
                            <div key={product.prod_no} onDoubleClick={() => handleDoublClick(product)} style={{ cursor: "pointer" }} >
                            <img src={product.image} alt={product.name} style={{height: "500px", objectFit: "cover" }} />
                            <h3>{product.name}</h3>
                            </div>
                        ))}
                        </Slider>
                    </div>
                )
            }   
            </div>
        </div>
    );  
}

export default MainDefault;
