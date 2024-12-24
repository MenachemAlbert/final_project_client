document.getElementById('endpoint-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const endpoint = document.getElementById('endpoint').value;
    const limit = document.getElementById('limit').value;

    const baseUrl = 'http://127.0.0.1:5000/api/terrorism';
    let apiUrl = `${baseUrl}${endpoint}`;
    if (limit === '5') {
        apiUrl += `?limit=${limit}`;
    }
    console.log('Requesting URL:', apiUrl);

    try {
        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error('שגיאה בטעינת המפה.');
        }

        const contentType = response.headers.get('Content-Type');
        if (contentType && contentType.includes('application/json')) {
            const data = await response.json();
            if (data.map) {
                displayMap(data);
            } else {
                console.error('לא נמצא מפתח "map" בתגובה');
            }
        }
        else {
            const blob = await response.blob();
            displayImage(blob);
        }
    } catch (error) {
        console.error('Error:', error);
        alert(`שגיאה: ${error.message}`);
    }
});


function displayMap(data) {
    if (data && data.map) {
        console.log('מפה התקבלה', data.map);
        const mapContainer = document.getElementById("map");
        mapContainer.innerHTML = ''
        mapContainer.innerHTML = data.map;
    } else {
        console.error('לא נמצא מפתח "map" בתגובה');
    }
}

function displayImage(blob) {
    const mapContainer = document.getElementById("map");
    mapContainer.innerHTML = ''
    const src = window.URL.createObjectURL(blob);
    const img = document.createElement("img");
    img.src = src;
    mapContainer.appendChild(img);
}