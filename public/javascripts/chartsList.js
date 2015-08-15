// var url = "/data";
// console.log("here");

function createModal() {
	$('.listContainer').addClass("show");
}

// function success(data) {
// 	var charts = [];
// 	for (var i = 0; i < data.charts.length; ++i) {

// 		charts.push(new ChartModel({
// 			id: data.charts[i].url,
// 			name: data.charts[i].name,
// 			description: data.charts[i].description,
// 			chart: data.charts[i].data

// 		}));
// 		console.log(charts[i]);


// 	}
// 	var chartCollection = new ChartCollection( /*charts*/ );
// 	console.log(chartCollection);
// 	$('.listContainer').append((new ChartListView({
// 		collection: chartCollection
// 	})).render().el);
// }

var ChartModel = Backbone.Model.extend({
	defaults: {
		id: "",
		name: "",
		description: "",
		chart: {}
	},
	urlRoot: "/charts"
});

var ChartCollection = Backbone.Collection.extend({
	model: ChartModel,
	url: '/data',

	initialize: function() {
		console.log("fetching?");
		this.fetch({
			success: this.fetchSuccess,
			error: this.fetchError,
			reset: true
		});
	},

	fetchSuccess: function(collection, response) {
		console.log('Collection fetch success', response);
		console.log('Collection models: ', collection.models);
		//this.trigger("reset");
	},

	fetchError: function(collection, response) {
		throw new Error("Books fetch error");
	}

});
var ChartView = Backbone.View.extend({
	initialize: function() {
		_.bindAll(this, 'render');
		this.model.bind('change', this.render);
	},
	render: function() {
		console.log(this.model.get('id'));
		this.$el.html("" + this.model.get('name') + this.model.get('description') + "<input type='button' value='delete' id='delete'/> <div id='edit' onclick='redirectToEditor(\"" + this.model.get('id') +"\")'><img width='25' heigth='25' src='/images/edit.svg'/></div>");
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

var ChartListView = Backbone.View.extend({
	itemsView: [],
	initialize: function() {
		//this.model.bind('add', this.render, this);
		_.bindAll(this, 'render');

		//    this.collection = new ChartCollection();
		this.collection.bind("reset", this.render);
		// //this.collection.fetch();
		this.collection.fetch({
			reset: true
		});
		this.render();
		// this.collection = new ChartCollection( /*charts*/ );
		// this.collection.fetch();
		// //console.log(chartCollection);
		// this.render();
		// this.updateItemsView();
		// _.bindAll(this, 'render');
		// this.collection.bind('reset', this.render)
	},
	updateItemsView: function() {
		var that = this;
		that.itemsView = [];
		console.log(this.collection);
		this.collection.each(function(chart) {
			console.log(chart);
			that.itemsView.push(new ChartView({
				model: chart
			}));
		});
		// for (var i = 0; i < this.model.length; ++i) {
		// 	this.itemsView.push(new ChartView({
		// 		model: this.model.models[i]
		// 	}));
		// };
	},
	render: function() {
		this.updateItemsView();

		var cont = $("<div>");
		for (var i = 0; i < this.collection.length; ++i) {
			cont.append(this.itemsView[i].render().el);
		}
		this.$el.html(cont);

		return this;
	}
});

// $('.listContainer').append((new ChartListView({
// 	collection: new ChartCollection()
// })).render().el);



var ChartPieCollection = Backbone.Collection.extend({
	model: ChartModel,
	url: '/data/pie',

	initialize: function() {
		console.log("fetching?");
		this.fetch({
			success: this.fetchSuccess,
			error: this.fetchError,
			reset: true
		});
	},

	fetchSuccess: function(collection, response) {
		console.log('Collection fetch success', response);
		console.log('Collection models: ', collection.models);
		//this.trigger("reset");
	},

	fetchError: function(collection, response) {
		throw new Error("Books fetch error");
	}

});


var ChartDonutCollection = Backbone.Collection.extend({
	model: ChartModel,
	url: '/data/donut',

	initialize: function() {
		console.log("fetching?");
		this.fetch({
			success: this.fetchSuccess,
			error: this.fetchError,
			reset: true
		});
	},

	fetchSuccess: function(collection, response) {
		console.log('Collection fetch success', response);
		console.log('Collection models: ', collection.models);
		//this.trigger("reset");
	},

	fetchError: function(collection, response) {
		throw new Error("Books fetch error");
	}

});



var ChartPieView = Backbone.View.extend({
	initialize: function() {
		_.bindAll(this, 'render');
		this.model.bind('change', this.render);
	},
	render: function() {
		console.log(this.model.get('id'));
			this.$el.html("<div  onclick='redirectToEditor(\"" + this.model.get('id') +"\")'>" + this.model.get('name') + this.model.get('description') + "</div>");
			return this;
		}
		// },
		// events: {
		// 	"click #delete": "deleteChart"
		// },
		// deleteChart: function() {
		// 	this.remove();
		// 	this.model.destroy();
		// 	// this.model.destroy({
		// 	// 	success: function(model, respose, options) {
		// 	// 		console.log("The model has deleted the server");
		// 	// 	},
		// 	// 	error: function(model, xhr, options) {
		// 	// 		console.log(xhr);
		// 	// 	}
		// 	// })
		// }
});

var ChartPieListView = Backbone.View.extend({
	itemsView: [],
	initialize: function() {
		//this.model.bind('add', this.render, this);
		_.bindAll(this, 'render');

		//    this.collection = new ChartCollection();
		this.collection.bind("reset", this.render);
		// //this.collection.fetch();
		this.collection.fetch({
			reset: true
		});
		this.render();
		// this.collection = new ChartCollection( /*charts*/ );
		// this.collection.fetch();
		// //console.log(chartCollection);
		// this.render();
		// this.updateItemsView();
		// _.bindAll(this, 'render');
		// this.collection.bind('reset', this.render)
	},
	updateItemsView: function() {
		var that = this;
		that.itemsView = [];
		console.log(this.collection);
		this.collection.each(function(chart) {
			console.log(chart);
			that.itemsView.push(new ChartPieView({
				model: chart
			}));
		});
		// for (var i = 0; i < this.model.length; ++i) {
		// 	this.itemsView.push(new ChartView({
		// 		model: this.model.models[i]
		// 	}));
		// };
	},
	render: function() {
		this.updateItemsView();

		var cont = $("<div>");
		for (var i = 0; i < this.collection.length; ++i) {
			cont.append(this.itemsView[i].render().el);
		}
		this.$el.html(cont);

		return this;
	}
});



/*
var chartPieCollection = new ChartPieCollection();
console.log(chartPieCollection);


*/



function loadContent(type) {
	var view;
	switch (type) {
		case "saved":
			view = new ChartListView({
					collection: new ChartCollection()
				});
			break;
		case "pie": view = new ChartPieListView({
					collection: new ChartPieCollection()
				});
			break;
		case "donut": view = new ChartPieListView({
				collection: new ChartDonutCollection()
			});
		break;
			
	}
	$('#contentContainer').html(view.render().el);
};
function redirectToEditor(url) {
	window.open("/editor/"+url,"_self")
}
 	// $.ajax({
	// 	dataType: "json",
	// 	url: url,
	// 	success: success,
	// 	error: function(request, error) {
	// 		alert(" Can't do because: " + error);
	// 	}
	// });