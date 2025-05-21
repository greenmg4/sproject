import {useLocation, useNavigate} from "react-router-dom";

// url에 Query 추가

function QueryAdd(key, value) {
    const navigate = useNavigate();
    const location = useLocation();

    const searchParams = new URLSearchParams(location.search);
    searchParams.set(key, value);

    navigate({ search: searchParams.toString() });
}

// url에 Query 제거
function QueryRemove (key) {
    const navigate = useNavigate();
    const location = useLocation();
    
    const searchParams = new URLSearchParams(location.search);
    searchParams.delete(key);

    navigate({ search: searchParams.toString() });
};

// 날짜시간 형식 포맷 - YYYY-MM-DD HH:mm:ss
function Dateformat() {
    const date = new Date();

    function Digit(n) {
        return n < 10 ? `0${n}` : `${n}`;
    }

    return '' + date.getFullYear() + '-' + Digit(date.getMonth()) + '-' + Digit(date.getDay()) + ' '
        + Digit(date.getHours()) + ':' + Digit(date.getMinutes()) + ':' + Digit(date.getSeconds());
}


export {QueryAdd, QueryRemove, Dateformat};