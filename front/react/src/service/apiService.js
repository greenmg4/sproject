import { API_BASE_URL } from "./app-config";
// => 필요시 사용 
import axios from "axios";

// 1. axios 요청 함수 
// => 요청시 필요한 정보를 매개변수로 전달받음
// => ACCESS_TOKEN 도 매개변수로 전달함
export async function apiCall(url, method, requestData, token) {

  // 1.1) headers & token
  // => indexOf('join')
  //  - JavasScript 의 문자열 확인함수
  //  - 존재하면 찾는문자열이 첫번째 나타나는 위치(index) 를 return,
  //    없으면 -1 을 return
  let headers = ''; 
  if (url.indexOf('join') >= 0 && !token) {
    headers = { 'Content-Type': 'multipart/form-data' };  
} else if (token) {
    headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
    };  
} else {
    headers = { 'Content-Type': 'application/json' };  
}
  // 1.2) axios 전송 options
  let options = {
      url: API_BASE_URL + url, 
      method: method, 
      headers: headers,
      withCredentials: true,  
  };  
  
  // 1.3) 전송 Data(requestData) 있는 경우 data 속성 추가
  if (requestData) {
    options.data = requestData;
  }

  console.log(`** apiCall options.method=${options.method}`);
  console.log(`** apiCall options.url=${options.url}`);
  console.log(`** apiCall options.data=${options.headers}`);

  // 1.3) Axios 요청
  return await axios(options)
          .then(response => {
              return response.data;
          }).catch(err => {
  if (err.response) {
    return Promise.reject(err); // 에러 객체 그대로 넘김
  } else {
    const customError = new Error("No response from server");
    customError.status = 502;
    return Promise.reject(customError); // 숫자 대신 에러 객체 넘김
  }
}); //catch
} //apiCall

// 2. sessionStorage Data Reading 함수 
export function getStorageData() {
  const serverData = sessionStorage.getItem("serverData");
        if ( serverData !== null ) return (JSON.parse(serverData))    
        else return null;
}  


export async function addCart(product) {
  return await apiCall('/cart/addCart', 'POST', product, null);
}

export async function CartDetail(cust_id) {
  return await apiCall('/cart/CartDetail', 'POST', {cust_id}, null);
}