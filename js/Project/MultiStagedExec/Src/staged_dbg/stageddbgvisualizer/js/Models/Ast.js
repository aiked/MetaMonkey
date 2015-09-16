define( 
[
	'backbone'
], 

function( Backbone  ) {

	var Model = Backbone.Model.extend( {
		defaults: {
			root: {}
		}
	} );

	return Model;

}
);