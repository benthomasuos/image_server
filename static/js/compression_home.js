


$(document).ready(function(){
    getAllTests()

})




$('.formToggle').on('click', function(){
    var divName = $(this).attr('data-toggle')
    $('form').slideUp()
    if(!$('#' + divName ).is(':visible') ){ // If the form is hidden, show it again
            $('#' + divName ).slideDown() // Show the relevant form
    }
    else{

        $('#' + divName ).slideUp()
    }
})





function resetForm(){


}


function getAllTests(){

    $.get('/monotonic/compression/list', function(data){
          //console.log(data)
          if(data.length > 0){
              fillPowderTable(data)
              message("Found " + data.length + " powders in the database" )
          }
      })
}


function fillTestTable(tests){
    // All powders returned from getAllPowders() are parsed in the #powderTable table with EDIT, COPY and DELETE labels added
    var table = $('#powderTable')
    table.html("")
    $('#numPowders').html(powders.length + " powders found")

    var headers = ['name', 'type', 'base_metal', 'alloy', 'morphology', 'supplier', 'psd_min', 'psd_max']
    table.append("<thead></thead><tbody></tbody>")
    var head = table.find('thead')
    var body = table.find('tbody')

    headers.forEach(function(column, i){
        head.append("<td>" + column + "</td>")
    })
    head.append("<td>Edit</td>")
    head.append("<td>Copy</td>")
    head.append("<td>Delete</td>")

    powders.forEach(function(powder, i){
        var row = $("<tr></tr>")

        console.log(powder.doc, i)
        headers.forEach(function(column, j){
            row.append('<td>' + powder.doc[column] + '</td>')

        })
        row.append("<td class='text-center'><a href='/powders/edit/"+ powder.doc._id  +"'><i class='fa fa-edit fa-2x'></i></a></td>")
        row.append("<td class='text-center'><div onclick=copyPowder('" + powder.doc._id + "')><i class='fa fa-copy fa-2x'></i></div></td>")
        row.append("<td class='text-center'><div onclick=deletePowder('" + powder.doc._id  +"','" + powder.doc._rev +"')><i class='fa fa-trash fa-2x'></i></div></td>")
        body.append(row)
    })

}


function deletePowder(id, rev){
    console.log("Deleting powder " + id, rev)
    $.post('/powders/delete', {id : id, rev: rev} , function(data){
        message("Powder deleted")
          //console.log(data)
          getAllPowders()
      })

}

function copyPowder(id){
    console.log("Copying powder " + id)

    $.post('/powders/copy', {id : id} , function(data){
          //console.log(data)
          message("Powder copied")
          getAllPowders()
      })

}
