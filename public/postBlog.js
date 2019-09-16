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
  
  var form = document.querySelector('form');
  form.onsubmit = function() {
    var about = document.querySelector('input[name=about]');
    var indx = ((document.getElementById("editor-container")).innerHTML).lastIndexOf("</p>");
   var str = (document.getElementById("editor-container").innerHTML).substring(65, (indx+4));
    about.value = str;  
  }