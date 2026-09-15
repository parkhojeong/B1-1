# B1-1 — Hojeong Portfolio

순수 HTML, CSS, JavaScript로 만든 반응형 포트폴리오입니다.
VS Code Live Server로 `index.html`을 열어 확인할 수 있습니다.

## 파일별 역할

```text
css/
├─ base.css          공통 변수, 테마, 기본 스타일
├─ layout.css        헤더·본문 배치, 프로젝트 Grid, 반응형 레이아웃
└─ components.css    버튼, 메뉴, 카드, 폼, 애니메이션

js/
├─ api.js            데이터 요청
├─ projects.js       프로젝트 렌더링, 로딩·에러·재시도
├─ form.js           폼 검증, 에러·성공 메시지
├─ theme.js          다크 모드 전환과 설정 저장
└─ navigation.js     모바일 메뉴, 스크롤 상태와 애니메이션
```

CSS는 `base → layout → components` 순서로 연결합니다.
각 요소의 반응형 스타일은 해당 요소가 정의된 파일의 미디어 쿼리에서 관리합니다.
JS는 모두 `defer`로 연결하며, `projects.js`가 사용하는 `getRepositories()`는 먼저 연결한 `api.js`에서 정의합니다.
현재는 일반 스크립트이므로 파일을 나눠도 최상위 변수의 범위는 공유됩니다.
기존 `css/style.css`와 `js/index.js`의 코드는 위 파일들로 이동했습니다.

## 레이아웃과 테마

- `css/base.css`의 `:root`에서 공통 색상·글꼴·간격을 정의합니다.
- `[data-theme="dark"]`에서 배경·글자·카드·입력창·버튼 색상을 변경합니다.
- 기본은 모바일이며, 768px부터 가로 메뉴, 1024px부터 데스크톱 여백과 문의 폼의 2열 배치를 적용합니다.
- 헤더는 Flexbox, 프로젝트 목록은 `repeat(auto-fit, minmax(...))` Grid를 사용합니다.
- 모바일 메뉴는 버튼, 메뉴 링크, 바깥 영역 클릭 또는 Escape로 닫을 수 있습니다.
- 테마는 `localStorage`에 저장합니다.

## 스크롤과 폼

- 스크롤 위치가 60px를 초과하면 헤더 배경과 그림자를 변경합니다.
- 300px를 초과하면 맨 위로 이동 버튼을 표시합니다.
- 앵커 이동은 CSS `scroll-behavior: smooth`로 처리합니다.
- About, Skills, Contact는 Intersection Observer의 `threshold: 0.2`로 한 번 나타납니다.
- 동작 줄이기 설정(`prefers-reduced-motion`)에서는 부드러운 스크롤과 전환 효과를 끕니다.
- 폼은 제출 시 전체를 검사하고, 제출 시도 후에는 입력 시 에러를 갱신합니다. 실제 이메일은 전송하지 않습니다.

## 데이터와 배포 확인

현재 `js/api.js`는 `js/repos.json`을 불러오며 테스트용 무작위 에러가 있습니다.
실제 GitHub API 제출용으로 전환하려면 해당 파일의 주석 처리된 API 주소를 사용하고 테스트 에러를 제거하세요.
배포 URL과 제출용 스크린샷은 실제 배포 결과를 확인한 후 추가하세요.
