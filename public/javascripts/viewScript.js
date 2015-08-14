$.ajax({
	dataType: "json",
	url: "data",
	success: success,
	error: function(request, error) {
		console.log(arguments);
		alert(" Can't do because: " + error);
	}
});
var chart = c3.generate(this.model.toJSON());