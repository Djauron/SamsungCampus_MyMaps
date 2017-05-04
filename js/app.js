$('#go').click(function(){
    var start = document.getElementById('start').value;
    var end = document.getElementById('end').value;
    $('#info-panel').show();

    if(start == "Position actuel") start = pos;
    waypts = [];
    calculateAndDisplayRoute(start, end);
    setTimeout(function(){
        calculEvent();
        calculateAndDisplayRoute(start, end);
    }, 1500)
});

$('#add').click(function() {
    var wayArray = document.getElementById('waypoint');
    if(wayArray.value != '')
    {
        checkArray.push(wayArray.value);
        document.getElementById('liste').innerHTML += wayArray.value;
        document.getElementById('liste').innerHTML += '<br>';
        $('#waypoint').val('');
    }
});

$('#checkoption').change(function() {
   tmode = $( "#checkoption option:selected" ).val();
});