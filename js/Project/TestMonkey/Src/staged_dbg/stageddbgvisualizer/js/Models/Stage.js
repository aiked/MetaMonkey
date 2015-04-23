define( 
[
	'backbone',
], 

function( Backbone  ) {

	var Model = Backbone.Model.extend( {
		defaults: {
			status: 	'',
			depth: 		-1,
			inlines: 	-1,
			srcCode: 	''
		}
	} );

	return Model;

}
);