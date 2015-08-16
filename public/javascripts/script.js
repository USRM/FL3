var chartData = {
	bindto: '#chart',
	axis: {
		y: {
			label: {
				text: 'Y Label',
				position: 'outer-middle'
			},
			show: true,
			max: undefined
		}
	},
	data: {
		json: [{
			name: 'www.site1.com',
			upload: 200,
			download: 200,
			total: 400
		}, {
			name: 'www.site2.com',
			upload: 100,
			download: 300,
			total: 400
		}, {
			name: 'www.site3.com',
			upload: 300,
			download: 200,
			total: 500
		}, {
			name: 'www.site4.com',
			upload: 400,
			download: 100,
			total: 500
		}, ],
		keys: {
			y: 'name',
			value: ['upload', 'download'],
		}
	}
};

var ExtendedMenuModel = Backbone.Model.extend({});
var ChartView = Backbone.View.extend({
	initialize: function() {
		this.model.bind('change', this.render, this);
		this.render();
	},
	render: function() {
		console.log(this.model.toJSON());
		c3.generate(this.model.toJSON());
	},
	getModel: function() {
		return this.model.toJSON();
	}
});


$.ajax({
	dataType: "json",
	url: "http://localhost:3000/charts/" + window.location.href.substr(window.location.href.lastIndexOf('/') + 1),
	success: success,
	error: function(request, error) {
		alert(" Can't do because: " + error);
	}
});
var chart;

function success(data) {
	chartData = data;
	console.log("Success:" + chartData);

	chart = new ChartView({
		el: $("#chart"),
		model: new ExtendedMenuModel(chartData.data)
	});

}



var dataForServer;

// function populate() {
// 	var defal = {
// 		name: "pie",
// 		description: "sdas",
// 		url: ID(),
// 		data: {
// 			data: {
// 				columns: [
// 					['data1', 30],
// 					['data2', 120],
// 				],
// 				type: 'donut',
// 				onclick: function(d, i) {
// 					console.log("onclick", d, i);
// 				},
// 				onmouseover: function(d, i) {
// 					console.log("onmouseover", d, i);
// 				},
// 				onmouseout: function(d, i) {
// 					console.log("onmouseout", d, i);
// 				}
// 			},
// 			donut: {
// 				title: "Iris Petal Width"
// 			}
// 		}
// 	};

// 	var request = $.ajax({
// 		url: "/save",
// 		async: true,
// 		type: "POST",
// 		data: defal,
// 		contentType: "application/x-www-form-urlencoded", //This is what made the difference.
// 		dataType: "json",

// 	});
// }

function ID() {
	return Math.random().toString(36).substr(2, 9);
};
var saved = false;
var dataForServer;
function save() {
	var chartName = "Name";
	var chartDescription = "My first chart. Save it. MongoDB.";
	var id = Math.floor(Math.random() * 1000000);
	console.log(chart.getModel());
	dataForServer = {
		name: chartName,
		description: chartDescription,
		url: ID(),
		data: chart.getModel()
	};
	saved = true;
	console.log("for server");
	console.log(dataForServer);
	var request = $.ajax({
		url: "/save",
		async: true,
		type: "POST",
		data: dataForServer,
		contentType: "application/x-www-form-urlencoded", //This is what made the difference.
		dataType: "json",

	});
	request.success(function(result) {
		console.log(result);
	});
	request.fail(function(jqXHR, textStatus) {
		alert("Request failed: " + textStatus);
	});
}

function share() {
	if (saved) {
		console.log(chart.getModel());
		$("#data").html("http://localhost:3000/" + dataForServer.url);
	} else {
		alert("Please save");
	}
}