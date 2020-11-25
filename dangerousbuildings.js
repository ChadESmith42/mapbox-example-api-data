mapboxgl.accessToken =
    "pk.eyJ1IjoiY3NtaXRoNzU1MyIsImEiOiJjaWY4OXU3NXkxbzA4c2hsem00Y3pscmMyIn0.9GAiQ-7yW9AnQKcAooeytA";
// Build map object
const map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/satellite-streets-v9",
    center: [-94.585818, 39.103259],
    zoom: 8,
    bearing: 0
});

//Variable to hold GeoJSON object link from Live Data Feed;
const url = "https://data.kcmo.org/resource/rm2v-mbk5.geojson";

const parcelUrl = "https://data.kcmo.org/resource/9skc-zsy8.geojson";

//Variable to hold address. Address will be assigned in map layer and used to call
//REST service for parcel data.
//var lookup = "";
map.on("load", () => {
    setInterval(() => {
        map.getSource("home").setData(url);
    }, 2000);
    //Add a scale bar to the map; Uses imperial measurements; Max width 80px;
    const scale = new mapboxgl.ScaleControl({
        maxWidth: 80,
        unit: "imperial"
    });
    map.addControl(scale);
    //Add GeoJSON file ...
    map.addSource("home", {
        type: "geojson",
        data: url
    });
    //Add custom markers. Using image from web.
    map.loadImage("marker.png", (error, image) => {
        if (error) throw error;
        map.addImage("custom-marker", image);
        //Add GeoJSON data as a layer; Source points to GeoJSON file. Icon points to custom marker;
        map.addLayer({
            id: "home",
            type: "symbol",
            source: "home",
            layout: {
                "icon-image": "custom-marker"
            }
        });
        //Create variable that will be passed to Angular model for populating table of
        //location-based query. Variable will be integrated into HTTP GET request on
        //REST service.


        //Adds popup triggered by a click on the marker:
        map.on("click", "home", (e) => {
            const coordinates = e.features[0].geometry.coordinates.slice();
            const lookup = e.features[0].properties.address;
            console.log(lookup);
            while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
            }
            //Adds the class="popups" attribute to each HTML popup element for CSS styling. Additional classes
            //should be comma-separated values.
            new mapboxgl.Popup({
                    className: "popups, round, trigger"
                })
                .setLngLat(coordinates)
                //set the Content of the Popups using HTML and data from the live feed/GeoJSON
                .setHTML(
                    "<h3>" +
                    e.features[0].properties.address +
                    "<br/>Kansas City, MO " +
                    e.features[0].properties.zip_code +
                    "</h3><ul><li>Case Number: " +
                    e.features[0].properties.casenumber +
                    " </li><li>Date Case Started: " +
                    e.features[0].properties.case_opened +
                    "</li><li>Status of Case: " +
                    e.features[0].properties.statusofcase +
                    "</li></ul>"
                )
                .addTo(map);
        });
    });
});

$('#map').on('click', '.trigger', () => {
    lookup = e.features[0].properties.address;
});
