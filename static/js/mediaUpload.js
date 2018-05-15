var uploadForm = $('form')




function uploadFiles(){
    var form = $('#uploadForm')
    var files = form.find('input[type="file"]')[0].files
    var testID = form.find('input[name="testID"]').val()
    var formData = new FormData(form[0])
    console.log(files)

    $.ajax({
        url: '/upload/',
        type: "POST",
        data: formData,
        cache: false,
        contentType: false,
        processData: false,
        success: function(data) {
                $('#uploadStatus').html(data)
                listFiles()
            },
        error: function(err){
            console.log(err)
            $('#uploadStatus').html("Uploading failed with the following error: " + err.statusText)
        }

    });



}


function listFiles(){

    $('#existingFiles').html('')

    $.get('/image/list', function(data) {

        if(!data.message){
            addImagesToView(data)
        }
        else{
            console.log(data.message)
        }


    });

    $.get('/video/list',  function(data) {
        if(!data.message){
            addImagesToView(data)
        }
        else{
            console.log(data.message)
        }

    });


}


$(document).ready(function(){
    console.log('Request about to be made')
    listFiles()

})


function addImagesToView(files){
    console.log(files)
    $('.img-thumb').off('click')
    var div = $('#existingFiles')
    files.forEach(function(d,i){
        var thumbTitle = $('<p></p>')
        thumbTitle.html(d)
        var thumbImg = $('<img width=200 >' )
        var url = '/public/image/thumbs/' + d
        thumbImg.attr('src', url)
        var thumb = $('<a href="/public/image/thumbs/' + d + '" class="img-thumb"></a>')
        thumb.append(thumbTitle, thumbImg)
        div.append(thumb)

    })


    $('.img-thumb').on('click', function(){
        showFullSize($(this))
    })

}


function addVideosToView(files){
    console.log(files)
    $('.img-thumb').off('click')
    var div = $('#existingFiles')
    files.forEach(function(d,i){
        var thumbTitle = $('<p></p>')
        thumbTitle.html(d)
        var thumbImg = $('<video width=200 controls >' )
        var url = '/public/video/thumbs/' + d
        thumbImg.attr('src', url)
        var thumb = $('<a href="' + url + '" class="img-thumb"></a>')
        thumb.append(thumbTitle, thumbImg)



        div.append(thumb)

    })


}







function showFullSize(div){
    console.log(div)
    div.find('img').addClass('fullscreen')

}
