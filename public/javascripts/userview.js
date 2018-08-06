function operateFormatter(value, row, index) {
    if(row.status === 1){
    return [
        '<a class="btn btn-primary" href="'+baseUrl+'users/edit/'+ row._id + '">Edit</a>  ',
        '<a href="'+baseUrl+'users/delete/'+row._id+'" class="btn btn-danger delete" data-id="'+row._id +'">Delete</a>'
    ].join('');}
    else{
        return [
            '<a class="btn btn-primary" href="'+baseUrl+'users/edit/'+ row._id + '">edit</a>  '
        ].join('');
    }
}

function actdeact(value, row, index) {
    if(row.status === 1){
    return [
       '<p id="status_'+row._id+'" class="act">Active</p>'
    ].join('');}
    else{
        return [
            '<p id="status_'+row._id+'" class="inactive"> In Active</p>'
        ].join('');
    }
}
function role(value, row, index) {
    if(row.role === 1){
    return [
       '<p>Non Admin</p>'
    ].join('');}
    else{
        return [
            '<p>Admin</p>'
        ].join('');
    }
}
$(function(){
    $(document).on("click", ".delete", function (e) {//e is default event...ie..here button pressed event
        e.preventDefault();//prevent default values such as link path....
        var thisObj = this;
        var id = $(this).data("id");
        if (confirm("Are you sure?")) {
            $.ajax({
                url: baseUrl + 'users/ajax/delete',
                type: 'POST',
                data: { id: id },
                dataType: 'JSON',
                success: function (data) {
                    if(data.success === 1) {
                        $('#status_'+id)//parent <td> ...siblings..<td>..<td>...
                        .html("inactive")
                        .removeClass("act")//remove class
                        .addClass("inactive");
                        $(thisObj).hide();//add class
                    }
                },
                error: function () {
                }
            })
        }
    })
})
/*$(function(){
    function getusers(){
        $.ajax({
            url : baseUrl + 'users/ajax/get-users',
            type :'GET',
            dataType :'json',
            success : function(data){
                if(data.success === 1){
                    //console.log(data);
                    var html = "";
                    var edit = '';
                    data.result.forEach(function(va){
                        edit = '<a href="'+ baseUrl +'users/edit/'+ va._id +'" class="btn btn-primary">Edit</a>';
                            html += '<tr>'+ 
                                '<td>'+va.name+'</td>'+
                                '<td>'+va.email+'</td>'+
                                '<td> <a href="#" class="btn btn-danger" style="margin-right" data-id="'+va._id+'">Delete</a>'+ edit +'</td>'+
                            '</tr>';
                    })
                    $("#ajaxdata").html(html);                    
                }
            }
        })
    }
    //getusers();
}) */
