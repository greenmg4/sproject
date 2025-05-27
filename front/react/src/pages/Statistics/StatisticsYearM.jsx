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
    const currentYear = new Date().getFullYear(); // 현재 연도
    const [selectedYear, setSelectedYear] = useState(currentYear); // 기본값 설정

    // YYYYMM
    const today = new Date();
    const formattedDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
    const [selectedYm, setSelectedYm] = useState(formattedDate);

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
            sessionStorage.setItem("serverMonthData", JSON.stringify(response));
            const dataArray = response; // 응답 데이터를 배열로 저장
            
            setDataValuesYm(dataArray.map(item => item.tot_amt)); // total_amt 값을 추출하여 dataValuesY 상태 업데이트
            
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
            </div>
        </div>
    );
};

export default StatisticsYearM;
