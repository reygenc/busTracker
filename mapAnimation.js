// This is the public access token, you can switch this to your own personal token.
mapboxgl.accessToken = 'pk.eyJ1IjoicmV5Z2VuYyIsImEiOiJjbGdrNmE2b3IweWF3M3FzdngxZHQyZnN1In0.oy7bibveJrCsa4V13EmN1g';

var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v11',
  center: [-71.104081, 42.365554],
  zoom: 14
});

const el = document.createElement('div');
    el.className = 'redMarker';

var marker = new mapboxgl.Marker(el)
    .setLngLat([0, 0])
    .addTo(map);

var BusActive = false;
async function run(){
  const locations = await getBusLocations();
  const BusInfo = await getBusInfo();
  var Lng = locations[0].attributes.longitude;
  var Lat = locations[0].attributes.latitude;
  if(BusActive === false)
  {
    //Center on bus (Shoud be around MIT area normally)
    map.flyTo({
      center: [Lng, Lat]
    });
  }
  marker.setLngLat([Lng, Lat])
  .setPopup(
    new mapboxgl.Popup({ offset: 25 }) // add popups
      .setHTML(
        `<h3>HeadSign: ${BusInfo[0].attributes.headsign}</h3><p>${locations[0].attributes.occupancy_status}</p>`
      )
  );
	// timer
	setTimeout(run, 5000);
}

// Request bus data from MBTA
async function getBusLocations(){
	const url = 'https://api-v3.mbta.com/vehicles?filter[route]=1&include=trip';
	const response = await fetch(url);
	const json     = await response.json();
	return json.data;
}

async function getBusInfo(){
	const url = 'https://api-v3.mbta.com/vehicles?filter[route]=1&include=trip';
	const response = await fetch(url);
	const json     = await response.json();
	return json.included;
}
