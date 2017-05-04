var screen = true;

$("#buttonF").click(function() {
    if(screen == true)
    {
        $("#map").css({
            width: '100%',
            height: '100%'
        });
        $('#buttonF').text('LowScreen');
        screen = false;
    }
    else
    {
        $("#map").css({
            width: '800px',
            height: '600px'
        });
        $('#buttonF').text('FullScreen');
        screen = true;
    }
    google.maps.event.trigger(map, 'resize');
    map.setCenter(pos);
});
