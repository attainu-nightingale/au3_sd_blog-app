// AJAX request for Delete Button
$('.delete').on('click', function(){
    var id = $(this).attr('value');
    
$.ajax({
url: "/adminHomepage/deleteblog/"+id,
type: "PUT",
dataType: "json",
success: function(data){
    console.log("Deleted...");
}
})
location.reload();
})

// AJAX request for Approve Button

$('.approve').on('click', function(){
    var id = $(this).attr('value');
    
$.ajax({
url: "/adminHomepage/approveblog/"+id,
type: "PUT",
data: id,
dataType: "json",
success: function(data){
    
    console.log("Approved...");
}
})
location.reload();
})




