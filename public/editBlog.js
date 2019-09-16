var id = $('#objID').attr('value');

$.ajax({
    url: "/user/posts/blog/" + id,
    type: "GET",
    dataType: "json",
    success: function(data) {
        $('#form-title').val(data[0].heading);
        document.getElementById('editor-container').innerHTML = data[0].body;

        var quill = new Quill('#editor-container', {
            modules: {
              toolbar: [
                ['bold', 'italic', 'underline', 'strike', 'link'],        // toggled buttons
                ['blockquote', 'code-block'],
        
                [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
                [{ 'align': [] }],
                [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
        
                [{ 'header': [2, 3, 4, 5, 6] }],
        
                [{ 'color': [] }, { 'background': [] }, ]          // dropdown with defaults from theme
              ]
            },
            theme: 'snow'
        });
    }
});

$('button').on('click', function() {
    var heading = $('#form-title').val();
    var indx = ((document.getElementById("editor-container")).innerHTML).lastIndexOf("</p>");
    var about = (document.getElementById("editor-container").innerHTML).substring(65, (indx+4));
    

    var editPost = {
        heading: heading,
        about: about
    }

    $.ajax({
        url: "/user/posts/" + id,
        type: "PUT",
        dataType: 'json',
        data: editPost,
        success: function(message){
           alert('Blog is Updated :)')
        }
    });


})