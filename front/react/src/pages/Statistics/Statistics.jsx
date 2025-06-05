import "../../styles/Statistics.css"; // CSS 파일 import
import React, { useState, useEffect } from "react";

import StaticsticsYear from "./StatisticsYear"
import StaticsticsYearM from "./StatisticsYearM"

import StaticsticsProd from "./StatisticsProd"

const Statistics = () => {

    return (
        <div>

            <div className="statistics-title">
                    매출 정보
            </div>
            <hr className="statistics-hr"></hr>
            
            <div className="statistics-container" >
                <div className="statistics-float-box">
                    <StaticsticsYear />
                </div>

                <div> 
                    <span  >
                       <hr className="statistics-hr-vertical"></hr>
                    </span>
                </div>

                <div className="statistics-float-box">
                    <StaticsticsYearM />
                </div>
            </div>

            <div className="statistics-float-clear"></div>

        </div>
    );
};

export default Statistics;