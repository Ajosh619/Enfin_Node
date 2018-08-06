$(document).ready(function () {
    
    $('#uploadForm').submit(function () {

        $("#status").empty().text("File is uploading...");
        
        $(this).ajaxSubmit({
            beforeSend: function(jqXHR) {
                var currentFile = $("input[name=image]").get(0).files[0];
                var ext =  currentFile.name.split('.').pop();
                var size = currentFile.size;
                var arr = ["jpeg","jpg","png"];
                if(arr.includes(ext) == false)
                {
                    jqXHR.abort();
                    $("#error").empty().text("only jpg,png extention is allowded");

                }
                else if(size>1e+6){
                    jqXHR.abort();
                    $("#status1").empty().text("file size is too big....!");
                }
                else{

                    $("#status").empty().text("file uploaded successfully");

                }
                },
                error: function (xhr) {
                    status('Error: ' + xhr.status);
                },

                success: function (response) {
                    //var newFile = response.image;//take the image name from the response
                    console.log('response.image');
                    //for change the image when the imageupload display the same time
                    $( "#greatphoto" ).attr( "src", baseUrl + "uploads/" + newFile );
                    // change also the value of hidden as well
                    $("#hidden").attr("value",newFile);

                    $("#status").empty().text("file uploaded successfully");
                }
            });

        return false;


    });
});  