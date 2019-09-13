const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.getElementById('container');

signUpButton.addEventListener('click', () => {
	container.classList.add("right-panel-active");
});

signInButton.addEventListener('click', () => {
	container.classList.remove("right-panel-active");
});

$("btnSubmit").on("click",function(){
    var data = {
        name : $("#name").val(),
        email : $("#email").val(),
        password : $("#password").val(),
        
    }
    $.ajax({
        type : "POST",
        url : "/signup.html",
        data : "data",
        dataType : "json",
        success : function(data){
            console.log(data);
        }
    })
})


$("btnSubmit").on("click",function(){
    var data = {
        email : $("#email").val(),
        password : $("#password").val(),
        
    }
    $.ajax({
        type : "POST",
        url : "/Signin",
        data : "data",
        dataType : "json",
        success : function(data){
            console.log(data);
        }
    })
})