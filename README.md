# 폭약량 계산기

이 프로젝트는 주어진 폭약량에 대한 안전 거리와 압력별 영향 범위를 계산하고 시각화하는 웹 애플리케이션입니다.

## 기능

- 폭약량 입력에 따른 MSD(Minimum Safety Distance) 계산
- 압력별(1 PSI, 4 PSI 등) 영향 범위 계산
- 계산 결과의 지도 상 시각화
- 다크 모드 UI

## 설치 방법

1. 이 저장소를 클론합니다:
   ```
   git clone https://github.com/rlaehfid8881/pressure_gauge.git
   ```

2. 프로젝트 디렉토리로 이동합니다:
   ```
   cd pressure_gauge
   ```

3. index.html을 크롬으로 열면 실행됩니다.

## 온라인 데모

이 프로젝트의 온라인 데모는 다음 주소에서 확인할 수 있습니다:
[https://rlaehfid8881.github.io/pressure_gauge/](https://rlaehfid8881.github.io/pressure_gauge/)

## 사용 방법

1. index.html 파일을 더블 클릭하여 실행합니다.

2. 폭약량(g)을 입력하고 필요한 경우 주소를 입력합니다.

3. '계산하기' 버튼을 클릭하여 결과를 확인합니다.

## 기술 스택

- HTML5
- CSS3
- JavaScript (ES6+)
- Google Maps JavaScript API

## 기여

프로젝트에 기여하고 싶으시다면 pull request를 보내주세요. 대규모 변경사항의 경우, 먼저 issue를 열어 논의해 주시기 바랍니다.


## 개발 및 배포 방식

### 개발 프로세스

1. 개발 시작 전 항상 `main` 브랜치를 기반으로 새로운 브랜치를 생성합니다.
   ```
   git checkout main
   git pull
   git checkout -b feature/새기능이름
   ```

2. 새로 만든 브랜치에서 개발을 진행합니다.

3. 개발이 완료되면 GitHub에 Push하고 Pull Request(PR)를 생성합니다.

4. 코드 리뷰 후 승인되면 `main` 브랜치로 머지합니다.

### 배포 프로세스

1. `main` 브랜치의 변경사항을 `deploy` 브랜치로 머지합니다.
   - GitHub에서 `main` 브랜치에서 `deploy` 브랜치로 Pull Request(PR)를 생성합니다.
   - PR을 검토하고 승인한 후 머지합니다.

2. `deploy` 브랜치로 PR이 머지되면 GitHub Actions가 자동으로 실행됩니다.

3. GitHub Actions 워크플로우가 성공적으로 완료되면 실제 사이트에 배포됩니다.
