import "../../styles/Statistics.css"; // CSS 파일 import
import React, { useState, useEffect, useRef } from "react";
import { Bar } from "react-chartjs-2";
import { getColorByValue, adjustColor } from "../../helpers/statistics.js";

import { apiCall } from '../../service/apiService';

import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);


const StatisticsYearM = () => {
    
    //const dataValuesYm = [12,12,12,12,12,12,12,22,12,112,12,12,12,12,12,14,12,12,12,62,12,121,2,12,12,12,12,12,12,12];
    //const [dataValuesYm, setDataValuesYm] = useState([]);
    const [dataValuesYm, setDataValuesYm] = useState([22,22,12,12,12,12,12,22,12,112,12,12,12,12,12,14,12,12,12,62,12,121,2,12,12,12,12,12,12,12]);
    
    // 날짜 상태 관리
    const [year, setYear] = useState("");
    const [month, setMonth] = useState("");
    const [day, setDay] = useState("");
    const [yearMonthDay, setYearMonthDay] = useState("");

    const monthRef = useRef(null);

    // YYYY
    //const currentYear = new Date().getFullYear(); // 현재 연도
    //const [selectedYear, setSelectedYear] = useState(currentYear); // 기본값 설정

    // YYYYMM
    const today = new Date();
    const formattedDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
    const [selectedYm, setSelectedYm] = useState(formattedDate);

    const [monthResult, setMonthResult] = useState({
        avgTotAmount: 0,
        maxMonth: "1",
        maxMohthAmount: 0,
        minMonth: "1",
        minMonthAmount: 0,
    });

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
        setSelectedYm(`${y}-${m}`); // YYYY-MM 형식 설정
        //setSelectedDate(`${y}-${m}-${d}`); // YYYY-MM-DD 형식 설정

        handleMonthChange("/statistics/monthsaleslist");
    }, []);

    const handleMonthChange = (url) => {
        setSelectedYm(monthRef.current.value); // 선택한 값으로 변경
        const requestData = { month: monthRef.current.value }; // JSON 객체 변환

        apiCall(url, 'POST', requestData, null)
        .then((response) => {
            //alert(`** serverDataRequest 성공 url=${url}`);
            //sessionStorage.setItem("serverMonthData", JSON.stringify(response));
            //const dataArray = response; // 응답 데이터를 배열로 저장
            //setDataValuesYm(dataArray.map(item => item.tot_amt)); // total_amt 값을 추출하여 dataValuesY 상태 업데이트

            //const data = JSON.stringify(response);
            
            if( response.length === 0) {
                const resultArray = Array(30).fill(0);  // 매출 정보가 없다면 기본적으로 30 개 배열 생성 후, 0 초기화
                setDataValuesYm(resultArray); // total_amt 값을 추출하여 dataValuesY 상태 업데이트
            } else {
                // 최대 month 값 찾기
                const maxDay = Math.max(...response.map(item => Number(item.dd)));
                // maxMonth 개 배열 생성 후 초기값 0 설정
                const resultArray = Array(maxDay).fill(0);
    
                response.forEach(item => {
                    resultArray[item.dd - 1] = item.tot_amt;
                });
                setDataValuesYm(resultArray); // total_amt 값을 추출하여 dataValuesY 상태 업데이트

                // 월별 결과데이터 설정.
                setMonthResult({
                    avgTotAmount: response[0].avg_tot_amount,
                    maxMonth: response[0].max_dd,
                    maxMonthAmount: response[0].max_month_amount, 
                    minMonth: response[0].min_dd,
                    minMonthAmount: response[0].min_month_amount,
                });
            }


        }).catch((err) => {
            if (err===502) { alert(`** 처리도중 오류 발생, err=${err}`);
            }else if (err===403) {
                  alert(`** Server Reject : 접근권한이 없습니다. => ${err}`); 
            }else alert(`** serverDataRequest 시스템 오류, err=${err}`);
        }); //apiCall
    };


    // 데이터 값에 따라 색상을 동적으로 설정
    const backgroundColorsYm = dataValuesYm.map(value => getColorByValue(value));
    
    // adjustColor 함수를 사용하여 borderColors 생성
    const borderColorsYm = backgroundColorsYm.map(color => adjustColor(color, 10));

    const labelsYm = Array.from({ length: dataValuesYm.length }, (_, i) => `${i + 1}일`);
    const dataYm = {
        labels: labelsYm,
        datasets: [
            {
                data: dataValuesYm,
                backgroundColor: backgroundColorsYm,
                borderColor: borderColorsYm,
                borderWidth: 1,
            },
        ],
    };
    const optionsYm = {
        responsive: true,
        plugins: {
            legend: { position: "top", display: false },
            title: { display: true, text: "일별 매출정보"
                    //, align: "start", // 왼쪽 정렬, center, end
                     , font: { size: 12, weight: "bold" } // 글자 크기, 두께
                    },            
        },
    };

    
    return (
        <div >
            <div>
                <div className="statistics-search">
                    <label className="search-title" >Month</label>
                    <input type="month" className="search-condition" value={selectedYm}  ref={monthRef} onChange={(event) => handleMonthChange("/statistics/monthsaleslist")}/>
                </div>
                <div >
                    <Bar data={dataYm} options={optionsYm} />
                </div>

                <div className="-chstatisticsild-initial">
                <table className="statistics-table">
                    <tr>
                        <th>월평균 매출</th>
                        <td>{`${monthResult.avgTotAmount}`} 원</td>
                    </tr>
                    <tr>
                        <th>최대 매출일</th>
                        <td>{`${monthResult.maxMonth}`}일</td>
                    </tr>
                    <tr>
                        <th>최대 매출액</th>
                        <td>{`${monthResult.maxMonthAmount}`} 원</td>   
                    </tr>
                    <tr>
                        <th>최소 매출일</th>
                        <td>{`${monthResult.minMonth}`}일</td>
                    </tr>
                    <tr>
                        <th>최소 매출액</th>
                        <td>{`${monthResult.minMonthAmount}`} 원</td>
                    </tr>
                    
                </table>
                
                </div>
            </div>
        </div>
    );
};

export default StatisticsYearM;
