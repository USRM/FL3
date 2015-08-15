console.log(window.location.href);
var appearanceSettings = [{
	mainItem: "Appearance",
	subItems: null
}, {
	mainItem: "Background and plot area",
	subItems: ["Plot Area", "Margins", "Background and Border"]
}, {
	mainItem: "General Settings",
	subItems: null
}, {
	mainItem: "Miscellaneous",
	subItems: ["Other", "Columns", "Zooming", "Animation"]
}, {
	mainItem: "Number formatting",
	subItems: null
}, {
	mainItem: "Axis",
	subItems: null
}];
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

$.ajax({
		dataType: "json",
		url: "http://localhost:3000/charts/" + window.location.href.substr(window.location.href.lastIndexOf('/') + 1),
		success: success,
		error: function(request, error) {
			alert(" Can't do because: " + error);
		}
	});
function success(data) {
	chartData = data;
	console.log(chartData);
	var extendedMenuModel = new ExtendedMenuModel(chartData.data);
	var chart = new ChartView({
		el: $("#chart"),
		model: extendedMenuModel
	});
	
}
// var dataAppearanceMatching = {
// 	"axis": {
// 		header: "y",
// 		inputs: [{
// 			"label": "Show",
// 			"type": "checkbox",
// 			"id": "show",
// 			"checked": true
// 		}, {
// 			"label": "Max",
// 			"type": "text",
// 			"id": "max",
// 			"value": undefined
// 		}, {
// 			"mult": true,
// 			"subname": "label",
// 			"elements": [{
// 				"label": "Content",
// 				"type": "text",
// 				"id": "text",
// 				"value": "Y Label"
// 			}, {
// 				"label": "Position",
// 				"type": "text",
// 				"id": "position",
// 				"value": "outer-middle"
// 			}]
// 		}]
// 	},
// 	"appearance": {

// 	}
// };



function appearToJSON(root, appear, targetValues) {
	var json = {};
	json[root] = {};
	json[root][appear.header] = {};
	for (var i = 0; i < appear.inputs.length; ++i) {
		if (appear.inputs[i].mult) {
			json[root][appear.header][appear.inputs[i].subname] = {};
			for (var j = 0; j < appear.inputs[i].elements.length; ++j) {
				var id = '#' + appear.inputs[i].elements[j].id;
				console.log(id);
				json[root][appear.header][appear.inputs[i].subname][appear.inputs[i].elements[j].id] = targetValues.find(id).val();
			}
		} else {

			var id = '#' + appear.inputs[i].id;
			console.log(id);
			if (appear.inputs[i].type === "checkbox") {
				json[root][appear.header][appear.inputs[i].id] = targetValues.find(id).is(':checked');
			} else {
				json[root][appear.header][appear.inputs[i].id] = targetValues.find(id).val();
			}
		}
	}
	return json;
}
var ExtendedMenuModel = Backbone.Model.extend({});


// var SettingsView = Backbone.View.extend({
// 	appearance: {},
// 	currentItem: {},
// 	initialize: function(options) {
// 		this.appearance = options.appearance;
// 		this.render();
// 	},
// 	render: function() {
// 		var template = _.template($("#settingsTemplate").html());
// 		var resultHTML = template({
// 			appear: this.appearance
// 		});
// 		this.$el.html(resultHTML);
// 	},
// 	events: {
// 		"click .subitem": "changeExtendedMenu"
// 	},
// 	changeExtendedMenu: function(e) {
// 		var currentElement = $(e.target);

// 		var subMenu = currentElement.children("ul");
// 		if (subMenu) {
// 			subMenu.addClass("show");
// 			subMenu.removeClass("hidden");
// 		}
// 		var idText = currentElement.text().trim().toLowerCase();

// 		var extendMenu = new ExtendedMenuView({
// 			el: $("#extended"),
// 			appearance: dataAppearanceMatching[idText],
// 			model: extendedMenuModel,
// 			idText: idText
// 		});
// 	}
// });

// var ExtendedMenuView = Backbone.View.extend({
// 	appearance: {},
// 	idText: "",
// 	initialize: function(options) {
// 		this.appearance = options.appearance;
// 		this.render();
// 		this.idText = options.idText;
// 	},
// 	render: function() {
// 		var template = _.template($("#extendedMenuTemplate").html());
// 		var resultHTML = template({
// 			data: this.appearance
// 		});
// 		this.$el.html(resultHTML);
// 	},
// 	events: {
// 		"submit": "submit"
// 	},
// 	submit: function(e) {
// 		e.preventDefault();
// 		var currentData = _.clone(this.model.get(this.idText));
// 		var currentElement = $(e.currentTarget);
// 		//console.log($(currentElement).find("#position"));
// 		var futureData = appearToJSON(this.idText, dataAppearanceMatching[this.idText], currentElement).axis;
// 		console.log(currentData);
// 		console.log(futureData);
// 		this.model.set(this.idText, futureData);
// 		this.model.trigger("change");
// 	}

// });

var ChartView = Backbone.View.extend({
	initialize: function() {
		this.model.bind('change', this.render, this);
		this.render();
	},
	render: function() {
		console.log(this.model.toJSON());
		var chart = c3.generate(this.model.toJSON());
	}
});


// var DataView = Backbone.View.extend({
// 	initialize: function() {
// 		this.model.bind('change', this.render, this);
// 		this.render();
// 	},
// 	render: function() {
// 		var template = _.template($("#dataTemplate").html());
// 		var resultHTML = template({
// 			data: this.model.get("data")
// 		});
// 		this.$el.html(resultHTML);
// 	}
// });
var dataForServer;

function initApp() {

	// var settings = new SettingsView({
	// 	el: $("#settings"),
	// 	appearance: appearanceSettings
	// });
	// var data = new DataView({
	// 	el: $("#data"),
	// 	model: extendedMenuModel

	// });
	var chartName = "Name";
	var chartDescription = "My first chart. Save it. MongoDB.";
	var id = Math.floor(Math.random() * 1000000);

	dataForServer = {
		name: chartName,
		description: chartDescription,
		url: ID(),
		data: chartData
	};
	console.log(dataForServer);
};

initApp();

function populate() {
	var defal = {
		name: "pie",
		description: "sdas",
		url: ID(),
		data: {
			data: {
				columns: [
					['data1', 30],
					['data2', 120],
				],
				type: 'donut',
				onclick: function(d, i) {
					console.log("onclick", d, i);
				},
				onmouseover: function(d, i) {
					console.log("onmouseover", d, i);
				},
				onmouseout: function(d, i) {
					console.log("onmouseout", d, i);
				}
			},
			donut: {
				title: "Iris Petal Width"
			}
		}
	};

	var request = $.ajax({
		url: "/save",
		async: true,
		type: "POST",
		data: defal,
		contentType: "application/x-www-form-urlencoded", //This is what made the difference.
		dataType: "json",

	});
}

function ID() {
	return Math.random().toString(36).substr(2, 9);
};

function save() {
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
	$("#data").html("http://localhost:3000/" + dataForServer.url);
}

