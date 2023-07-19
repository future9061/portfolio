사진은 완성 후..
<br>

# portfolio

<br>

## 🖥️ 프로젝트 소개

react로 저의 portfolio를 만들어봤습니다.
<br>

## 🕰️ 개발 기간

- 23.06.26일 - 미정
  <br>

## ⚙️ 개발 환경

- `vs code 1.77`
- **Framework** : react(18.2.0)
- **library** : react-router-dom(6.14.0)
  <br>

## 📌 주요 기능

#### blue mode, splash screen, 페이지 이동

-

<br>

## 🧾code review

- ### splash Screen

  1.Loding component 생성 및 컴포넌트 상태 관리 isLoading useState 생성 2. isLoading는 sesstionStorage의 date로 상태 업데이트. **splash screen은 웹을 열 때 한번만 보여야 함으로 브라우저를 열 때마다 reset되는 sessionStorage가 적합하다.**
  3.App.js에 조건문으로 <Loading /> 넣기  
  4.setTimeOut으로 2000ms 뒤에 isLoading이 false로 바뀜

  ```javascript
  function App() {
    const sessionVal = window.sessionStorage.getItem("isLoading"); //초기값은 true

    const [isLoading, setIsLoading] = useState(
      sessionVal ? JSON.parse(sessionVal) : true
    );

    //App component가 mount 되면 시행
    useEffect(() => {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 2500);

      return () => clearTimeout(timer);
    }, []);

    //isLoading의 값이 바뀌면 sesstionStorage에 저장
    useEffect(() => {
      window.sessionStorage.setItem("isLoading", JSON.stringify(isLoading));
    }, [isLoading]);

    return (
      <>
        {isLoading ? (
          <Loading />
        ) : (
          <ThemeProvider>
            <Main />
          </ThemeProvider>
        )}
      </>
    );
  }

  export default App;
  ```

- ### Dark mode

1. 모든 component에 적용 되어야 하기 때문에 context 사용
2. dark 상태를 담아 둘 useState 생성
3. 새로 고침 시 다크 모드가 풀림(초기값이 basic이기 때문) 때문에 localStorage에 저장

```javascript
//1. context 생성

export const ThemeContext = React.createContext();

const ThemeProvider = ({ children }) => {
  const LocalTheme = window.localStorage.getItem("theme") || "basic"; //local에 data가 없으면 basic이 들어감
  const [themeMode, setThemeMode] = useState(LocalTheme); //theme 모드의 값을localStorage에서 가져와서 할당

  const chooseTheme = useCallback(() => {
    if (themeMode === "basic") {
      window.localStorage.setItem("theme", "basic");
    } else {
      window.localStorage.setItem("theme", "dark");
    }
  }, [themeMode]); //themeMode를 의존성 배열로 넣었다.

  return (
    <ThemeContext.Provider
      value={{ themeMode, setThemeMode, chooseTheme, atCircle, setAtcircle }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
```

<br />

```javascript
//povider로 가장 최상단인 app.js를 감싸 모든 component가 구독 가능하게 함
import ThemeProvider from "./store/Context";

function App() {
  return (
    <ThemeProvider>
      <Header />
      <outlet />
    </ThemeProvider>
  );
}

export default App;
```

<br />

```javascript
//context 사용할 setting component에서 useContext 생성
 const { themeMode, setThemeMode, chooseTheme } = useContext(ThemeContext);

  let dark = themeMode === "dark" ? classes.dark : "";

 useEffect(() => {
    chooseTheme();
  }, [themeMode, chooseTheme]);

  <button onClick={(e) => {
                e.stopPropagation(); //이벤트 버블링 현상
                setThemeMode("basic");
              }>Basic</button>

 <button onClick={(e) => {
                e.stopPropagation();
                setThemeMode("dark");
              }>dark</button>

//버튼 클릭 시 themeMode가 바뀌면서 Dark class가 생김.

 <div className={`${classes.setting_wrap} ${dark}`}>
```

- ### ⭐⭐⭐⭐⭐Back Btn
  기존에는 navigate(-1)로 어렵지 않던 기능이지만 **이전 페이지로 이동하면서 이전 페이지의 버튼이 활성화 되지 않는 문제** 를 발견. 버튼의 상태관리 데이터와 Back버튼이 무관하기 때문..  
  이전 경로를 가져와 조건문을 걸어야 해서 useLocation과 useNavigate Hook으로 코드를 수정했다

> 1.  navigate로 페이지 이동 시 두 번째 인자로 location의 state 객체의 from을 지정(그래야 이전 경로 사용 가능) <br />
> 2.  Back btn component에서 이전 경로를 sessionStorage에 배열로 저장 <br />  
>     3.버튼을 클릭하면 sessionStorage에서 get 해온 후 마지막 배열로 navigate 한 후 마지막 배열 삭제 및 새로운 배열을 다시 sessionStorage에 넣어줌 <br /> 4.이전 경로와 버튼 State가 바르면 버튼 상태 업데이트 하는 조건문 추가하여 이전 페이지로 이동하면 해당 버튼이 활성화 됨

```javascript
//context.js
const movePage = useCallback(() => {
  navigate(`/${atCircle}`, { state: { from: location.pathname } });
}, [atCircle, location.pathname, navigate]);

//back.jsx - sesstionStorage에 이전 경로 배열로 넣기
useEffect(() => {
  if (location.state && location.state.from) {
    //원래 조건문에 from만 넣으려 했으나 state가 있어야 from을 쓸 수 있었음
    const preUrls = JSON.parse(
      window.sessionStorage.getItem("preUrls") || "[]"
    );
    //초기값은 빈 배열

    const updatedUrls = [...preUrls, location.state.from];
    //preUrls 배열에 pathname이 바뀔때마다 계속해서 이전 경로 추가

    window.sessionStorage.setItem("preUrls", JSON.stringify(updatedUrls));
    //pathname이 바뀔때마다 update된 배열을 sessionStorage에 넣음
  }
}, [location.pathname]);

//back.jsx - click 시 sesstionStorage에서 마지막 데이터를 꺼내와 이동, pop으로 삭제,버튼 활성화
const handleClick = () => {
  const moveUrl = JSON.parse(window.sessionStorage.getItem("preUrls") || "[]");

  //마지막 배열만 꺼내기, 조건은 이전 경로가 0개 초과라는 전제
  if (moveUrl.length > 0) {
    const lastUrl = moveUrl[moveUrl.length - 1];
    navigate(lastUrl);

    //버튼 활성화
    const btnOn = lastUrl.replace("/", "");

    if (btnOn !== atCircle) {
      setMenuTxt(btnOn);
    }

    //마지막 경로 삭제
    moveUrl.pop();

    //배열 변경됐으니 문자열로 변환해서 다시 session에 저장
    window.sessionStorage.setItem("preUrls", JSON.stringify(moveUrl));
  }
};
```

<br>

## 느낀점 📢

portfolio를 만들기 시작하며 사용하기 편하고, 한 눈에 잘 들어오는 UI를 고민해보았습니다.
SPA를 만들기에 최적화 된 react framework를 사용하기 때문에 한 페이지 내에서 모든 content를 보여주기 적합하다고 생각해서
discord를 고르게 됐습니다.

기능적인 면에서 기본적이지만 주요 기능인 route와 component를 많이 사용하려 노력했습니다.
각 메뉴마다 Link로 페이지를 넘어가며, 반복되는 li들은 component로 만들어 props로 data를 전달받는 작업도 해보았습니다.  
react-router-dom, react-icons 등 다양한 react library를 써보며 덕분에 react와 조금 친해진 느낌이 들었습니다.😀😀
