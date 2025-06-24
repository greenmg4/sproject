import React, { useState, useEffect, useRef } from "react";
import { generateRGBArray } from "../../helpers/statistics.js";

import { apiCall } from '../../service/apiService.js';

import { Chart, DoughnutController, ArcElement, Tooltip, Legend } from 'chart.js';
Chart.register(DoughnutController, ArcElement, Tooltip, Legend);

  
function StatisticsProd() {
    const chartRef = useRef(null);

    const [searchType, setSearchType] = useState("Y"); // 기본값
    const [inputType, setInputType] = useState("");

    const today = new Date();
    const [selectedDate, setSelectedDate] = useState(today.getFullYear().toString());

    const [arrColorList, setArrColorList] = useState([]);

    const dateRef = useRef(null);

    //const [dataValuesSales, setDataValuesSales] = useState([300, 150, 100, 80, 10]);

    // 물품명과 데이터 배열
    // const [productData, setProductData] = useState([[
    //     { name: "상품 A", count: 300 },
    //     { name: "상품 B", count: 150 },
    //     { name: "상품 C", count: 100 },
    //     { name: "상품 D", count: 80 },
    //     { name: "상품 E", count: 10 }
    // ]]);
    const [productChartData, setProductChartData] = useState([]); // 초기 상태를 빈 배열로 설정
    const [productData, setProductData] = useState([]); // 초기 상태를 빈 배열로 설정

    //const itemsPerPage = 3; // 한 페이지에 표시할 최대 개수
    const [itemsPerPage, setItemsPerPage] = useState(15); // 기본값 설정
    const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
    const [totalPages, setTotalPages] = useState(1); // 총 페이지 수

    // 선택된 값에 따라 input 타입 변경 및 날짜 업데이트
    const changeSearchCategory = (value) => {
        setSearchType(value);

        if (value === "Y") {
            setInputType("number");
            updateTodayDate("Y");
        } else if (value === "M") {
            setInputType("month");
            updateTodayDate("M");
        } else if (value === "D") {
            setInputType("date");
            updateTodayDate("D");
        } else {
            setInputType("");
            setSelectedDate("");
        }

    };

    // 현재 날짜를 가져와 형식에 맞게 설정하는 함수
    const updateTodayDate = (type) => {
        const today = new Date();
        if (type === "Y") {
            setSelectedDate(today.getFullYear()); // 연도만 설정
        } else if (type === "M") {
            setSelectedDate(`${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`); // 연도-월 설정
        } else if (type === "D") {
            setSelectedDate(
            `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`
            ); // 연도-월-일 설정
        }
    };

    useEffect(() => {
        handleDateChange("/statistics/salesbyproductlist")
    }, []);

    
    useEffect(() => {
        
        const arrlist = generateRGBArray(productChartData.length); // 색상 배열 생성
    
        const ctx = chartRef.current.getContext('2d');
    
        // 기존 차트가 존재하면 먼저 제거
        if (chartRef.current.chartInstance) {
            chartRef.current.chartInstance.destroy();
        }
    
        // 새로운 차트 생성
        chartRef.current.chartInstance = new Chart(ctx, {
            type: 'doughnut',
            data: {
                //labels: productChartData.map(item => item.name), // 상품명 설정
                datasets: [{
                    label: '판매 데이터',
                    data: productChartData.map(item => item.count), // 판매 개수 설정
                    backgroundColor: arrlist,
                    hoverOffset: 4
                }]
            },
            options: {
                responsive: false,
                maintainAspectRatio: false,
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function (tooltipItem) {
                                const item = productChartData[tooltipItem.dataIndex];
                                return `${item.name}: ${item.count} 권 판매`;
                            }
                        }
                    }
                }
            }
        });
    }, [productChartData]); // productChartData가 변경될 때마다 차트 업데이트
    
    
    
    const handleDateChangeBack = (url) => {
        const newDate = dateRef.current.value;
        setSelectedDate(dateRef.current.value);

        //alert(`** 선택한 연도: ${event.target.value}`);
        const requestData = { searchDate: newDate }; // JSON 객체 변환
   
        apiCall(url, 'POST', requestData, null)
        .then((response) => {
            //alert(`** 서버 응답: ${JSON.stringify(response)}`);
            if( response.length === 0) {
                
                //alert(`** 해당하는 매출 정보가 없습니다.`);
                
                const formattedChartData = [{
                    name: "NODATA",
                    count: 0
                }];

                setProductChartData(formattedChartData); // 상태 초기화
                setProductData([]);
            } else {

                // API 응답 데이터를 productData 형식으로 변환
                const formattedChartData = response.map(item => ({
                    name: item.PROD_NM,
                    count: item.SUM_CNT.toLocaleString()
                }));
                setProductChartData(formattedChartData); // 상태 업데이트

                const formattedData = response.map(item => ({
                    prodNm: item.PROD_NM,
                    prodPrice: item.PROD_PRICE.toLocaleString(),
                    prodSumCnt: item.SUM_CNT.toLocaleString(),
                    prodSumBuyPrice: item.SUM_BUY_PRICE.toLocaleString(),
                    count: item.SUM_CNT.toLocaleString(),
                    prodCnt: item.PROD_CNT.toLocaleString(),
                    rownum: item.ROWNUM,
                }));

                setProductData(formattedData);

            }

        }).catch((err) => {
            if (err===502) { alert(`** 처리도중 오류 발생, err=${err}`);
            }else if (err===403) {
                  alert(`** Server Reject : 접근권한이 없습니다. => ${err}`); 
            }else alert(`** serverDataRequest 시스템 오류, err=${err}`);
        }); //apiCall
    };
    
    const handleDateChange = (url, page = 1, resetPage = false) => {
        const newDate = dateRef.current.value;
        setSelectedDate(newDate);
        if (resetPage) setCurrentPage(1);
        else setCurrentPage(page);
        
        const requestData = { 
            searchDate: newDate, 
            limit: itemsPerPage, 
            offset: (page - 1) * itemsPerPage 
        };
        
        // alert(`newDate: ${newDate}, limit:${itemsPerPage}, offset:${(page - 1) * itemsPerPage}`)

        apiCall(url, 'POST', requestData, null)
            .then((response) => {
                if (response.length === 0) {
                    alert("** 해당하는 매출 정보가 없습니다.");
                    setProductChartData([{ name: "NODATA", count: 0 }]);
                    setProductData([]);
                } else {
                    //setTotalPages(Math.ceil(response.length / itemsPerPage)); // 전체 페이지 수 설정
                    setTotalPages(Math.ceil(response[0].tot_count / itemsPerPage)); // 전체 페이지 수 설정
    
                    const formattedChartData = response.map(item => ({
                        name: item.PROD_NM,
                        count: item.SUM_CNT.toLocaleString(),
                    }));
    
                    setProductChartData(formattedChartData);
    
                    const formattedData = response.map(item => ({
                        prodNm: item.PROD_NM,
                        prodPrice: item.PROD_PRICE.toLocaleString(),
                        prodSumCnt: item.SUM_CNT.toLocaleString(),
                        prodSumBuyPrice: item.SUM_BUY_PRICE.toLocaleString(),
                        count: item.SUM_CNT.toLocaleString(),
                        prodCnt: item.PROD_CNT.toLocaleString(),
                        rownum: item.ROWNUM,
                    }));
    
                    setProductData(formattedData);
                }
            }).catch((err) => {
                if (err===502) { alert(`** 처리도중 오류 발생, err=${err}`);
                }else if (err===403) {
                    alert(`** Server Reject : 접근권한이 없습니다. => ${err}`); 
                }else alert(`** serverDataRequest 시스템 오류, err=${err}`);
            });
    };

    // 페이지 변경 이벤트
    const changePage = (newPage) => {
        if (newPage < 1 || newPage > totalPages) return; // 페이지 범위 체크
        setCurrentPage(newPage);
        handleDateChange("/statistics/salesbyproductlist", newPage);
    };

    
    return (
        <div className="statistics-background"  style={{ height: "590px", overflow: "hidden" }} >
            <div className="statistics-title">
                    상품판매 정보
            </div>
            <hr className="statistics-hr"></hr>
            <div className="statistics-container">
                <div style={{ display: "flex", flexDirection: "column", gap: "10px", alignItems: "flex-start" }}>
                    
                    <div >
                        <select className="search-condition" value={searchType} onChange={(e) => changeSearchCategory(e.target.value)}>
                            <option value="Y">년</option>
                            <option value="M">월</option>
                            <option value="D">일</option>
                        </select>

                        <input  className="search-condition"
                            type={inputType} 
                            value={selectedDate} 
                            ref={dateRef} 
                            onChange={(e) => setSelectedDate(e.target.value)}
                        />
                        
                        <button className="search-condition" onClick={() => handleDateChange("/statistics/salesbyproductlist", 1, true)}                        >
                            조회
                        </button>

                    </div>
                    <br/>

                    <div >
                        <div style={{fontSize: "14px", fontWeight: "bold", textAlign: "center", color: "rgb(23, 148, 54)"}}>
                            ⬇ 12시 방향부터 시계방향(판매순위)
                        </div>
                        <canvas ref={chartRef} width="320" height="320"/>
                    </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "10px", alignItems: "flex-start" }}>

                    <div style={{ marginBottom: "10px", textAlign: "center" }}>
                        <label>페이지당 항목 수:</label>
                        <select className="search-condition" value={itemsPerPage} onChange={(e) => setItemsPerPage(Number(e.target.value))}>
                            <option value={15}>15개</option>
                            <option value={10}>10개</option>
                            <option value={5}>5개</option>
                            <option value={3}>3개</option>
                        </select>
                    </div>

                    <div style={{ height: "400px", alignSelf: "stretch", textAlign: "center", padding: "10px", backgroundColor: "#f5f5f5" }}>
                        <table className="statistics-table-border" style={{ width: "1000px", borderCollapse: "collapse" }}>
                            <thead>
                                <tr>
                                <th style={{ width: '8%', height:'50px' }}>판매순위</th>
                                <th style={{ width: '36%', height:'50px' }}>상품명</th>
                                <th style={{ width: '12%', height:'50px' }}>상품가격</th>
                                <th style={{ width: '12%', height:'50px' }}>판매개수</th>
                                <th style={{ width: '20%', height:'50px' }}>총판매금액</th>
                                <th style={{ width: '12%', height:'50px' }}>재고수량</th>
                                </tr>
                            </thead>
                            <tbody>
                                {productData.map((item, index) => (
                                    <tr key={index}>
                                    <td>{(currentPage - 1) * itemsPerPage + index + 1}</td> {/* 순번 계산 */}
                                    <td>{item.prodNm}</td>
                                    <td>{item.prodPrice}</td>
                                    <td>{item.prodSumCnt}</td>
                                    <td>{item.prodSumBuyPrice}</td>
                                    <td>{item.prodCnt}</td>
                                    </tr>
                                ))}
                            </tbody>

                        </table>
                        <br />
                        <br />
                    </div>

                    {/* <div style={{ width: "1000px", alignSelf: "stretch", textAlign: "center", padding: "10px", backgroundColor: "#f5f5f5" }}>
                        page
                    </div> */}

                    <div style={{ width: "1000px", alignSelf: "stretch", textAlign: "center", padding: "10px" }}>
                        {/* 페이지네이션 버튼 추가 */}
                        <button disabled={currentPage === 1} onClick={() => changePage(currentPage - 1)}>이전</button>
                        <span> 페이지 {currentPage} / {totalPages} </span>
                        <button disabled={currentPage === totalPages} onClick={() => changePage(currentPage + 1)}>다음</button>
                    </div>

                </div>

            </div>
        </div>
    );
}

export default StatisticsProd;
