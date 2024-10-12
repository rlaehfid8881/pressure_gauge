let map, geocoder;

document.addEventListener('DOMContentLoaded', () => {
    const explosiveAmountInput = document.getElementById('explosiveAmount');
    const addressInput = document.getElementById('address');
    const calculateBtn = document.getElementById('calculateBtn');
    const resultDiv = document.getElementById('result');
    const pressureTableDiv = document.getElementById('pressureTable');

    initMap();

    // 계산 함수
    function calculate() {
        const explosiveAmount = parseFloat(explosiveAmountInput.value);
        const address = addressInput.value;

        if (isNaN(explosiveAmount) || explosiveAmount < 0) {
            resultDiv.textContent = '올바른 폭약량을 입력해주세요.';
            pressureTableDiv.innerHTML = '';
            return;
        }

        const msd = calculateMSD(explosiveAmount);
        resultDiv.textContent = `MSD: ${msd}m (폭약량: ${explosiveAmount}g)`;

        const distance4PSI = calculateDistance(explosiveAmount, 4);
        const distance1PSI = calculateDistance(explosiveAmount, 1);

        if (address) {
            geocodeAddress(address, msd, distance4PSI, distance1PSI);
        } else {
            getCurrentLocation(msd, distance4PSI, distance1PSI);
        }

        const distanceTable = createDistanceTable(explosiveAmount);
        pressureTableDiv.innerHTML = distanceTable;
    }

    // 계산 버튼 클릭 이벤트
    calculateBtn.addEventListener('click', calculate);

    // 폭약량 입력 필드에서 엔터 키 입력 이벤트
    explosiveAmountInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault(); // 폼 제출 방지
            calculate();
        }
    });

    // 주소 입력 필드에서 엔터 키 입력 이벤트
    addressInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault(); // 폼 제출 방지
            calculate();
        }
    });

    function calculateMSD(explosiveAmount) {
        const explosiveAmountKg = explosiveAmount / 1000;
        return Math.round(Math.pow(explosiveAmountKg, 1/3) * 20);
    }

    function calculateDistance(explosiveAmount, pressure) {
        const explosiveAmountKg = explosiveAmount / 1000;
        const pressureKPa = pressure * 6.89476;
        const scaledDistance = Math.pow(415 / pressureKPa, 1 / 1.32);
        return Math.round(scaledDistance * Math.pow(explosiveAmountKg, 1/3) * 100) / 100;
    }

    function createDistanceTable(explosiveAmount) {
        let table = '<h2>압력값별 거리</h2>';
        table += '<table><tr><th>압력 (PSI)</th><th>거리 (m)</th><th>비고</th></tr>';

        const pressures = [0.5, 1, 2, 3, 4, 5, 10, 20, 50, 100];
        for (let pressure of pressures) {
            const distance = calculateDistance(explosiveAmount, pressure);
            let note = '';
            if (pressure === 4) {
                note = '인체에 유해한 압력';
            }
            table += `<tr><td>${pressure}</td><td>${distance}</td><td>${note}</td></tr>`;
        }

        table += '</table>';
        return table;
    }
});

function initMap() {
    geocoder = new google.maps.Geocoder();
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 37.5665, lng: 126.9780 }, // 서울 중심 좌표
        zoom: 10,
        streetViewControl: false, // 로드뷰 컨트롤 제거
        styles: [
            {elementType: 'geometry', stylers: [{color: '#242f3e'}]},
            {elementType: 'labels.text.stroke', stylers: [{color: '#242f3e'}]},
            {elementType: 'labels.text.fill', stylers: [{color: '#746855'}]},
            {
                featureType: 'administrative.locality',
                elementType: 'labels.text.fill',
                stylers: [{color: '#d59563'}]
            },
            {
                featureType: 'poi',
                elementType: 'labels.text.fill',
                stylers: [{color: '#d59563'}]
            },
            {
                featureType: 'poi.park',
                elementType: 'geometry',
                stylers: [{color: '#263c3f'}]
            },
            {
                featureType: 'poi.park',
                elementType: 'labels.text.fill',
                stylers: [{color: '#6b9a76'}]
            },
            {
                featureType: 'road',
                elementType: 'geometry',
                stylers: [{color: '#38414e'}]
            },
            {
                featureType: 'road',
                elementType: 'geometry.stroke',
                stylers: [{color: '#212a37'}]
            },
            {
                featureType: 'road',
                elementType: 'labels.text.fill',
                stylers: [{color: '#9ca5b3'}]
            },
            {
                featureType: 'road.highway',
                elementType: 'geometry',
                stylers: [{color: '#746855'}]
            },
            {
                featureType: 'road.highway',
                elementType: 'geometry.stroke',
                stylers: [{color: '#1f2835'}]
            },
            {
                featureType: 'road.highway',
                elementType: 'labels.text.fill',
                stylers: [{color: '#f3d19c'}]
            },
            {
                featureType: 'transit',
                elementType: 'geometry',
                stylers: [{color: '#2f3948'}]
            },
            {
                featureType: 'transit.station',
                elementType: 'labels.text.fill',
                stylers: [{color: '#d59563'}]
            },
            {
                featureType: 'water',
                elementType: 'geometry',
                stylers: [{color: '#17263c'}]
            },
            {
                featureType: 'water',
                elementType: 'labels.text.fill',
                stylers: [{color: '#515c6d'}]
            },
            {
                featureType: 'water',
                elementType: 'labels.text.stroke',
                stylers: [{color: '#17263c'}]
            }
        ]
    });
}

function geocodeAddress(address, msdRadius, radius4PSI, radius1PSI) {
    geocoder.geocode({ address: address }, (results, status) => {
        if (status === 'OK') {
            updateMap(results[0].geometry.location, msdRadius, radius4PSI, radius1PSI);
        } else {
            alert('주소를 찾을 수 없습니다: ' + status);
        }
    });
}

function getCurrentLocation(msdRadius, radius4PSI, radius1PSI) {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                updateMap(pos, msdRadius, radius4PSI, radius1PSI);
            },
            () => {
                handleLocationError(true);
            }
        );
    } else {
        handleLocationError(false);
    }
}

function updateMap(location, msdRadius, radius4PSI, radius1PSI) {
    map.setCenter(location);
    
    // 가장 큰 반경 계산
    const maxRadius = Math.max(msdRadius, radius4PSI, radius1PSI);
    
    // 적절한 줌 레벨 계산
    const zoom = getBestZoom(map, location, maxRadius);
    
    // 줌 레벨 설정
    map.setZoom(zoom);

    // 기존 오버레이 제거
    if (map.overlays) {
        map.overlays.forEach(overlay => overlay.setMap(null));
    }
    map.overlays = [];

    // 마커 추가
    const marker = new google.maps.Marker({
        map: map,
        position: location
    });
    map.overlays.push(marker);

    // MSD 원
    addCircle(map, location, msdRadius, '#FF0000');

    // 4 PSI 원
    addCircle(map, location, radius4PSI, '#FFA500');

    // 1 PSI 원
    addCircle(map, location, radius1PSI, '#FFFF00');

    // 범례 추가
    addLegend(map, [
        { color: '#FF0000', label: 'MSD', radius: msdRadius },
        { color: '#FFA500', label: '4 PSI', radius: radius4PSI },
        { color: '#FFFF00', label: '1 PSI', radius: radius1PSI }
    ]);
}

function handleLocationError(browserHasGeolocation) {
    alert(browserHasGeolocation ?
        '위치 정보 서비스에 실패했습니다.' :
        '이 브라우저는 위치 정보를 지원하지 않습니다.');
}

function getBestZoom(map, location, radius) {
    const WORLD_DIM = { height: 256, width: 256 };
    const ZOOM_MAX = 21;

    function latRad(lat) {
        const sin = Math.sin(lat * Math.PI / 180);
        const radX2 = Math.log((1 + sin) / (1 - sin)) / 2;
        return Math.max(Math.min(radX2, Math.PI), -Math.PI) / 2;
    }

    function zoom(mapPx, worldPx, fraction) {
        return Math.floor(Math.log2(mapPx / worldPx / fraction));
    }

    const ne = google.maps.geometry.spherical.computeOffset(location, radius * Math.sqrt(2), 45);
    const sw = google.maps.geometry.spherical.computeOffset(location, radius * Math.sqrt(2), 225);

    const latFraction = (latRad(ne.lat()) - latRad(sw.lat())) / Math.PI;

    const lngDiff = ne.lng() - sw.lng();
    const lngFraction = ((lngDiff < 0) ? (lngDiff + 360) : lngDiff) / 360;

    const latZoom = zoom(map.getDiv().offsetHeight, WORLD_DIM.height, latFraction);
    const lngZoom = zoom(map.getDiv().offsetWidth, WORLD_DIM.width, lngFraction);

    return Math.min(latZoom, lngZoom, ZOOM_MAX);
}

function addCircle(map, center, radius, color) {
    const circle = new google.maps.Circle({
        map: map,
        center: center,
        radius: radius,
        fillColor: color,
        fillOpacity: 0.1,
        strokeColor: color,
        strokeOpacity: 0.8,
        strokeWeight: 2
    });
    map.overlays.push(circle);
}

function addLegend(map, items) {
    const legend = document.createElement('div');
    legend.style.backgroundColor = '#1e1e1e';
    legend.style.color = '#ffffff';
    legend.style.padding = '8px';
    legend.style.margin = '8px';
    legend.style.border = '1px solid #3c3c3c';
    legend.style.fontFamily = 'Arial, sans-serif';
    legend.style.fontSize = '10px';
    legend.style.lineHeight = '1.2';
    legend.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
    legend.style.borderRadius = '3px';

    items.forEach(item => {
        const row = document.createElement('div');
        row.style.marginBottom = '4px';

        const colorBox = document.createElement('span');
        colorBox.style.display = 'inline-block';
        colorBox.style.width = '16px';
        colorBox.style.height = '16px';
        colorBox.style.backgroundColor = item.color;
        colorBox.style.marginRight = '4px';
        colorBox.style.verticalAlign = 'middle';

        const label = document.createElement('span');
        label.textContent = `${item.label} (${item.radius.toFixed(2)}m)`;
        label.style.verticalAlign = 'middle';

        row.appendChild(colorBox);
        row.appendChild(label);
        legend.appendChild(row);
    });

    map.controls[google.maps.ControlPosition.RIGHT_TOP].push(legend);
}
