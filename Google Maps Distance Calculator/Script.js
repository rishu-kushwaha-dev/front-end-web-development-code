let map, directionsService, directionsRenderer;

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 28.6139, lng: 77.2090 },
        zoom: 10
    });
    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer({ map });
}

document.getElementById('calcBtn').addEventListener('click', () => {
    const origin = document.getElementById('origin').value;
    const destination = document.getElementById('destination').value;
    if (!origin || !destination) return;
    directionsService.route({
        origin, destination,
        travelMode: google.maps.TravelMode.DRIVING
    }, (result, status) => {
        const res = document.getElementById('results');
        if (status === 'OK') {
            const leg = result.routes[0].legs[0];
            res.innerHTML = `<strong>Distance:</strong> ${leg.distance.text}<br><strong>Duration:</strong> ${leg.duration.text}`;
            directionsRenderer.setDirections(result);
        } else {
            res.textContent = 'Error: ' + status;
        }
    });
});