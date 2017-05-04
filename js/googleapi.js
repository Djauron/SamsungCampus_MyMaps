// Note: This example requires that you consent to location sharing when
// prompted by your browser. If you see the error "The Geolocation service
// failed.", it means you probably did not give permission for the browser to
// locate you.
var checkArray = [];
var posEvent = [];
var waypts = [];
var tmode = 'DRIVING';
var map, infoWindow, pos, marker, startcomplete, endcomplete, waypointcomplete, directionsService, directionsDisplay, geocoder, service;
function initMap()
{
    complete();

    geocoder = new google.maps.Geocoder();
    directionsService = new google.maps.DirectionsService;
    directionsDisplay = new google.maps.DirectionsRenderer;
    $('#info-panel').hide();



    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: -34.397, lng: 150.644},
        zoom: 12
    });
    infoWindow = new google.maps.InfoWindow;

    directionsDisplay.setMap(map);
    directionsDisplay.setPanel(document.getElementById('info-panel'));
    service = new google.maps.places.PlacesService(map);
    // Try HTML5 geolocation.
    if (navigator.geolocation)
    {
        navigator.geolocation.getCurrentPosition(function(position) {
            pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            marker = new google.maps.Marker({
                position: pos,
                map:map,
                label: "Ici"
            });

            // infowindow = new google.maps.InfoWindow();
            // var service = new google.maps.places.PlacesService(map);
            // service.nearbySearch({
            //     location: pos,
            //     radius: 15000,
            //     type: ['museum']
            // }, callback);

            map.setCenter(pos);

        }, function() {
            handleLocationError(true, infoWindow, map.getCenter());
        });
    }
    else
    {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
    }

    map.addListener('click', function (event) {
        geocodeLatLng(event.latLng);
    });

}


function handleLocationError(browserHasGeolocation, infoWindow, pos)
{
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
        'Error: The Geolocation service failed.' :
        'Error: Your browser doesn\'t support geolocation.');
    infoWindow.open(map);
}


function complete()
{
    startcomplete = new google.maps.places.Autocomplete(
        (document.getElementById('start')),
        { types: ['geocode'] }
    );

    endcomplete = new google.maps.places.Autocomplete(
        (document.getElementById('end')),
        { types: ['geocode'] }
    );

    waypointcomplete = new google.maps.places.Autocomplete(
        (document.getElementById('waypoint')),
        { types: ['geocode'] }
    );
}

function calculateAndDisplayRoute(start, end)
{
    directionsService.route({
        origin: start,
        destination: end,
        waypoints: waypts,
        optimizeWaypoints: true,
        travelMode: tmode
    }, function(response, status) {
        if (status === 'OK') {
            var tmpPosEvent = response.routes[0].overview_path;
            tbPosEvent(tmpPosEvent);
            searchEvent();
            directionsDisplay.setDirections(response);
            var route = response.routes[0];
            var summaryPanel = document.getElementById('directions-panel');
            summaryPanel.innerHTML = '';
            // For each route, display summary information.
            for (var i = 0; i < route.legs.length; i++) {
                var routeSegment = i + 1;
                summaryPanel.innerHTML += '<b>Route Segment: ' + routeSegment +
                    '</b><br>';
                summaryPanel.innerHTML += route.legs[i].start_address + ' to ';
                summaryPanel.innerHTML += route.legs[i].end_address + '<br>';
                summaryPanel.innerHTML += route.legs[i].distance.text + '<br><br>';
            }
        } else {
            window.alert('Directions request failed due to ' + status);
        }
    });
}

function calculEvent()
{
    for (var i = 0; i < checkArray.length; i++) {
        if(i < 23)
        {
            waypts.push({
                location: checkArray[i],
                stopover: true
            });
        }
    }
}

function tbPosEvent(tmpPosEvent)
{
    for (var i = 0; i < tmpPosEvent.length; i++)
    {
       if(i % 3 == 0)
       {
           posEvent.push(tmpPosEvent[i]);
       }
    }
}

function searchEvent()
{
    for (var i = 0; i < posEvent.length; i++)
    {
        var request = {
            location: posEvent[i],
            radius: 2000,
            type: ['museum']
        };
        service.radarSearch(request, callback);
    }
}



function callback(results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
            addMarker(results[i]);
        }
    }
}

function addMarker(place) {
    var marker = new google.maps.Marker({
        map: map,
        position: place.geometry.location
    });
    checkArray.push(place.geometry.location.lat() + ' ' + place.geometry.location.lng());

}

function geocodeLatLng(latlng)
{
    geocoder.geocode({'location': latlng}, function(results, status) {
        if (status === 'OK') {
            if (results[1]) {
                    marker = new google.maps.Marker({
                    position: latlng,
                    map: map
                });
                document.getElementById('waypoint').value = results[1].formatted_address;
            }
        }
    });
}


