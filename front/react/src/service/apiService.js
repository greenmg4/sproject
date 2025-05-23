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
  if (url.indexOf('join') >= 0  && token == null) {
      headers = { 'Content-Type': 'multipart/form-data' };  
  }else if (token !== null) {
      headers = { 'Content-Type': 'application/json',
                  'Authorization': 'Bearer '+token  };  
  }else {
      headers = { 'Content-Type': 'application/json' };  
  }

  // 1.2) axios 전송 options
  let options = {
      url: API_BASE_URL + url, 
      method: method, 
      headers: headers,
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
            console.error(`** apiCall Error status=${err.response.status}, message=${err.message}`); 
              return Promise.reject(err.response.status);
        }); //catch
} //apiCall

// 2. sessionStorage Data Reading 함수 
export function getStorageData() {
  const serverData = sessionStorage.getItem("serverData");
        if ( serverData !== null ) return (JSON.parse(serverData))    
        else return null;
}  


export async function addCart(product) {
  return await apiCall('/cart', 'POST', product, null);
}

