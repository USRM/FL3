$("#loginForm").submit(function(e) {
  var mainE = e;
    var url = "/login/"+$('#username').val(); // the script where you handle the form input.
    alert(url);
    $.ajax({
           type: "GET",
           url: url,
           data: $("#loginForm").serialize(),
            async: false, // serializes the form's elements.
           success: function(data)
           {
              alert("Good");
           },
           error: function(a,b,c) {
             alert("Error"+a+b+c);
             mainE.preventDefault();
           }
         });
});