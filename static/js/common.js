function message(msg){
    var status = $('#status')

    if( !status.is(':visible')){
        status.html(msg)
        status.slideDown(200)
                        .delay(3000)
                        .slideUp(200)
    }
    else{
        status.html( status.html() + '<br>' + msg )
                .delay(2000)
                .slideUp(200)

    }





}


function loading(elem){
    var loader = $('<div class="loader"></div>')
    elem.append(loader)
    loader.fadeIn(500)
    return loader
}


function saveCredentials(credentials){
    window.localStorage.setItem('metals_lab', JSON.stringify(credentials))
}

function retrieveCredentials(){
    JSON.parse( window.localStorage.getItem('metals_lab'))
    return credentials
}




function setLocations(){
    var location_select = $('#location')
    location_select.html('')
    location_select.append('<option value="" selected disabled>Select a location ...</option>')
    $.get('/json/locations.json', function(locations){
        for (var key in locations) {
            if (locations.hasOwnProperty(key)) {
                $('#location').append('<optgroup label="' + key + '"></optgroup>')
                locations[key].forEach(function(d, i){
                    $('#location').append('<option value="' + d + '">' + d + '</option>')

                })
            }
        }
    })
}



$('.dropdown-submenu a.test').on("click", function(e){
    $(this).next('ul').toggle();
    e.stopPropagation();
    e.preventDefault();
  });
