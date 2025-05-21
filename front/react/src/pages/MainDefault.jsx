
import '../styles/Main.css';

function MainDefault() {
    return (
        <div className='body_container'>
            <hr></hr>
            {/* <h3>~~ Main 영역 ~~</h3> */}
            <div id="contents">
                {/* => img 폴더가 public 하위에 존재하는경우 
                    -> 리액트 프로젝트의  public 폴더는 root 디렉토리 이기 때문에 간편하게 지정 가능 
                    <img src={require('../assets/home_img/greenApple.jpg')} alt="MainImage" />
                */}
                <img alt="MainImage" src="images/library01.png" width={800} height={400} /> 
            </div>
        </div>
    );  
}

export default MainDefault;
