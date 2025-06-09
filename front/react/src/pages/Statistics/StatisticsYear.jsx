import "../../styles/Statistics.css"; // CSS 파일 import
import React, { useState, useEffect, useRef } from "react";
import { Bar } from "react-chartjs-2";
import { getColorByValue, adjustColor } from "../../helpers/statistics.js";

import { apiCall } from '../../service/apiService.js';

import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);


const StatisticsYear = () => {

    const serverDataRequest = (url) => {
        // token 적용 이전
        //apiCall(url, 'GET', null, null)

        // token 적용 이후
        //alert(`** serverDataRequest 요청전 token 확인 =${token}`);
        apiCall(url, 'POST', null, null)
        .then((response) => {
            alert(`** serverDataRequest 성공 url=${url}`);
            sessionStorage.setItem("serverData", JSON.stringify(response));
        }).catch((err) => {
            if (err===502) { alert(`** 처리도중 오류 발생, err=${err}`);
            }else if (err===403) {
                  alert(`** Server Reject : 접근권한이 없습니다. => ${err}`); 
            }else alert(`** serverDataRequest 시스템 오류, err=${err}`);
        }); //apiCall
    } //serverDataRequest


    const [dataValuesY, setDataValuesY] = useState([100020, 200300, 30000, 40000, 50000, 60000]);
    
    // 날짜 상태 관리
    const [year, setYear] = useState("");
    const [month, setMonth] = useState("");
    const [day, setDay] = useState("");
    const [yearMonthDay, setYearMonthDay] = useState("");

    const yearRef = useRef(null);


    // YYYY
    const currentYear = new Date().getFullYear(); // 현재 연도
    const [selectedYear, setSelectedYear] = useState(currentYear); // 기본값 설정

    const [yearResult, setYearResult] = useState({
        sumYearAmount : 0,
        avgTotAmount: 0,
        maxMonth: "0",
        maxMonthAmount: 0,
        minMonth: "0",
        minMonthAmount: 0,
    });

    // YYYYMM
    //const today = new Date();
    //const formattedDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
    //const [selectedYm, setSelectedYm] = useState(formattedDate);

    // YYYYMMDD
    //const [selectedDate, setSelectedDate] = useState(new Date());

    useEffect(() => {
        const today = new Date(); // 현재 날짜 가져오기
        const y = today.getFullYear(); // 연도
        const m = String(today.getMonth() + 1).padStart(2, "0"); // 월 (두 자리 유지)
        const d = String(today.getDate()).padStart(2, "0"); // 일 (두 자리 유지)

        setYear(y);
        setMonth(m);
        setDay(d);
        //setSelectedYm(`${y}-${m}`); // YYYY-MM 형식 설정
        //setSelectedDate(`${y}-${m}-${d}`); // YYYY-MM-DD 형식 설정

        handleYearChange("/statistics/yearsaleslist");
    }, []);



    const handleYearChange = (url) => {
        //setSelectedYear(Number(event.target.value)); // 선택한 값으로 변경
        setSelectedYear(Number(yearRef.current.value)); // 선택한 값으로 변경

        //alert(`** 선택한 연도: ${event.target.value}`);
        const requestData = { year: yearRef.current.value }; // JSON 객체 변환
        apiCall(url, 'POST', requestData, null)
        .then((response) => {
            //alert(`** serverDataRequest 성공 url=${url}`);
            //sessionStorage.setItem("serverYearData", JSON.stringify(response));
            //const dataArray = response; // 응답 데이터를 배열로 저장
            //setDataValuesY(dataArray.map(item => item.tot_amt)); // total_amt 값을 추출하여 dataValuesY 상태 업데이트

            if( response.length === 0) {
                const resultArray = Array(12).fill(0);  // 매출 정보가 없다면 기본적으로 12 개 배열 생성 후, 0 초기화
                setDataValuesY(resultArray); // total_amt 값을 추출하여 dataValuesY 상태 업데이트

                // 결과데이터 설정.
                setYearResult({
                    sumYearAmount: 0,
                    avgTotAmount: 0,
                    maxMonth: "0",
                    maxMonthAmount: 0, 
                    minMonth: "0",
                    minMonthAmount: 0,
                });

            } else {
                // 최대 month 값 찾기
                const maxMonth = Math.max(...response.map(item => Number(item.mm)));
                // maxMonth 개 배열 생성 후 초기값 0 설정
                const resultArray = Array(maxMonth).fill(0);
    
                response.forEach(item => {
                    resultArray[item.mm - 1] = item.tot_amt;
                });
                setDataValuesY(resultArray); // total_amt 값을 추출하여 dataValuesY 상태 업데이트

                // 결과데이터 설정.
                setYearResult({
                    sumYearAmount: response[0].sum_year_amount.toLocaleString(),
                    avgTotAmount: response[0].avg_tot_amount.toLocaleString(),
                    maxMonth: response[0].max_month,
                    maxMonthAmount: response[0].max_month_amount.toLocaleString(), 
                    minMonth: response[0].min_month,
                    minMonthAmount: response[0].min_month_amount.toLocaleString(),
                });

                //alert(`yearResult 설정 완료, avgTotAmount=${response[0].avg_tot_amount}, maxMonth=${response[0].max_month}, maxMonthAmount=${response[0].max_month_amount}, minMonth=${response[0].min_month}, minMonthAmount=${response[0].min_month_amount}`);
            }

        }).catch((err) => {
            if (err===502) { alert(`** 처리도중 오류 발생, err=${err}`);
            }else if (err===403) {
                  alert(`** Server Reject : 접근권한이 없습니다. => ${err}`); 
            }else alert(`** serverDataRequest 시스템 오류, err=${err}`);
        }); //apiCall
    };

    
    // 데이터 값에 따라 색상을 동적으로 설정
    const backgroundColorsY = dataValuesY.map(value => getColorByValue(value));
    
    
    // adjustColor 함수를 사용하여 borderColors 생성
    const borderColorsY = backgroundColorsY.map(color => adjustColor(color, 10));

    const labelsY = Array.from({ length: dataValuesY.length }, (_, i) => `${i + 1}월`);
    const dataY = {
        labels: labelsY,
        datasets: [
            {
                data: dataValuesY,
                backgroundColor: backgroundColorsY,
                borderColor: borderColorsY,
                borderWidth: 1,
            },
        ],
    };

    const optionsY = {
        responsive: true,
        plugins: {
            legend: { position: "top", display: false },
            title: { display: true, text: "월별 매출정보"
                    //, align: "start", // 왼쪽 정렬, center, end
                     , font: { size: 12, weight: "bold" } // 글자 크기, 두께
                    },            
        },
    };

    // 이전 10년과 포함하여 총 11개 연도 생성
    const years = Array.from({ length: 11 }, (_, i) => currentYear - 10 + i);
    
    
    return (
        <div>
            <div>
                <div className="statistics-search">
                <label className="search-title">Year</label>
                {/* <select  className="search-condition" value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}> */}
                <select  className="search-condition" ref={yearRef} value={selectedYear} onChange={(event) => handleYearChange("/statistics/yearsaleslist")}>
                    {years.map((year) => (
                        <option key={year} value={year}>
                            {year}
                        </option>
                    ))}
                </select>
                </div>
            </div>
            
            <div style={{height: '450px'}}>
                <Bar data={dataY} options={optionsY} />
            </div>
            <div className="statistics-table-container">
                <table className="statistics-table">
                    <thead>
                        <tr>
                            <th style={{ width: '30%'}}></th>
                            <th style={{ width: '45%'}}></th>
                            <th style={{ width: '15%'}}></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <th>년 총매출액</th>
                            <td style={{ textAlign: 'right', borderBottom: '2px solid rgb(171, 202, 174)'}}>{`${yearResult.sumYearAmount}`}</td>
                            <td>원</td>
                        </tr>
                        <tr>
                            <th>년평균 매출</th>
                            <td style={{ textAlign: 'right', borderBottom: '2px solid rgb(171, 202, 174)' }}>{`${yearResult.avgTotAmount}`}</td>
                            <td>원</td>
                        </tr>
                        <tr>
                            <th style={{ color: 'rgb(172, 59, 59)' }}>최고 매출월</th>
                            <td style={{ textAlign: 'right', borderBottom: '2px solid rgb(171, 202, 174)' }}>{`${yearResult.maxMonth}`}</td>
                            <td>월</td>
                        </tr>
                        <tr>
                            <th style={{ color: 'rgb(172, 59, 59)' }}>최고 월매출</th>
                            <td style={{ textAlign: 'right', borderBottom: '2px solid rgb(171, 202, 174)' }}>{`${yearResult.maxMonthAmount}`}</td>   
                            <td >원</td>
                        </tr>
                        <tr>
                            <th style={{ color: 'rgb(7, 70, 5)' }}>최소 매출월</th>
                            <td style={{ textAlign: 'right', borderBottom: '2px solid rgb(171, 202, 174)' }}>{`${yearResult.minMonth}`}</td>
                            <td>월</td>
                        </tr>
                        <tr>
                            <th style={{ color: 'rgb(7, 70, 5)' }}>최소 월매출</th>
                            <td style={{ textAlign: 'right', borderBottom: '2px solid rgb(171, 202, 174)' }}>{`${yearResult.minMonthAmount}`}</td>
                            <td>원</td>
                        </tr>
                    </tbody>
                </table>
                
            </div>
            
        </div>
    );
};

export default StatisticsYear;