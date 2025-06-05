const [isIdChecked, setIsIdChecked] = useState(false);
const [idCheckMessage, setIdCheckMessage] = useState('');

const handleIdCheck = async () => {
  if (!form.cust_id) {
    setIdCheckMessage('아이디를 입력해주세요.');
    return;
  }
  try {
    const response = await axios.post('http://localhost:8080/api/user/check-id', { cust_id: form.cust_id });
    if (response.data.available) {
      setIsIdChecked(true);
      setIdCheckMessage('사용 가능한 아이디입니다.');
    } else {
      setIsIdChecked(false);
      setIdCheckMessage('이미 사용 중인 아이디입니다.');
    }
  } catch (error) {
    console.error('아이디 중복 확인 오류:', error);
    setIdCheckMessage('아이디 중복 확인 중 오류가 발생했습니다.');
  }
};
