$(function() {
    var id = 'UpHa77DgM3Phh6aaRkYGywdt';
    var token = 'ozosimbLvwkqflRiDFKzRB6vseQVLBw0cdExDyYkwz0N3qjOi1Rd3HTe2HB7XlbiaBxm1iZ3eAiOEbK7';

    // Read all properties and adjust HTML
    function readProperties() {
        var url = 'https://api.evrythng.com/thngs/' + id + '/properties?access_token=' + token;
        $.getJSON(url, function(data) {
            for (var item of data) {
                updateProperty(item);
            }
        });
    }

    // Update HTML of a single item
    function updateProperty(item) {
        switch (item.key) {
        case 'temperature':
            $('#temperature').html(item.value + ' &deg;C');
            break;
        case 'humidity':
            $('#humidity').text(item.value + ' %');
            break;
        case 'led1':
        case 'led2':
        case 'led3':
            var elem;
            elem = $('#' + item.key).find(item.value ? '.on' : '.off');
            elem.attr('checked');
            elem.closest('label').addClass('active');
            elem = $('#' + item.key).find(item.value ? '.off' : '.on');
            elem.removeAttr('checked');
            elem.closest('label').removeClass('active');
            break;
        }
    }

    function setLedState(ledNo, state) {
        $.ajax({
            url: 'https://api.evrythng.com/thngs/' + id + '/actions/_setLedState?access_token=' + token,
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                type: '_setLedState',
                thng: id,
                customFields: { led: ledNo, state: state }})});
                console.log('Setting led ' + ledNo + ' to ' + state);
    }

    function subscribe() {
        var url = 'wss://ws.evrythng.com:443/thngs/' + id + '/properties?access_token=' + token;
        var socket = new WebSocket(url);
        socket.onmessage = function(msg) {
            var data = JSON.parse(msg.data);
            for (var item of data) {
                updateProperty(item);
            }
        };
        socket.onerror = function(err) {
            console.log(err);
        };
    }

    $('.led').change(function() {
        var ledNo = $(this).attr('id').slice(3);
        var state = $(this).find('.on').is(':checked');

        setLedState(ledNo, state);
    });

    readProperties();
    subscribe();
});