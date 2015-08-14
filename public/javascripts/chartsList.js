var url = "/data";
console.log("here");

function success(data) {
	var charts = [];
	for (var i = 0; i < data.charts.length; ++i) {

		charts.push(new ChartModel({
			id: data.charts[i].url,
			name: data.charts[i].name,
			description: data.charts[i].description,
			chart: data.charts[i].data

		}));
		console.log(charts[i]);
		$('#container').append((new ChartView({
			model: charts[i]
		})).render().el);
	}
}
var ChartModel = Backbone.Model.extend({
	defaults: {
		id: "",
		name: "",
		description: "",
		chart: {}
	},
	urlRoot: "/charts"
});
var ChartView = Backbone.View.extend({
	render: function() {
		this.$el.html("" + this.model.get('name') + this.model.get('description') + "<input type='button' value='delete' id='delete'/> <div id='edit'><a href='/editor'><img  width='50' heigth='50' src='/public/images/edit.svg'/></a></div>");
		return this;
	},
	events: {
		"click #delete": "deleteChart"
	},
	deleteChart: function() {
		this.remove();
        this.model.destroy();
		// this.model.destroy({
		// 	success: function(model, respose, options) {
		// 		console.log("The model has deleted the server");
		// 	},
		// 	error: function(model, xhr, options) {
		// 		console.log(xhr);
		// 	}
		// })
	}
});

$.ajax({
	dataType: "json",
	url: url,
	success: success,
	error: function(request, error) {
		console.log(arguments);
		alert(" Can't do because: " + error);
	}
});