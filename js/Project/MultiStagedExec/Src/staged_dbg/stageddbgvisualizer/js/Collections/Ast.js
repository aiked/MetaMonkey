define( 
[
	'backbone',

	'Models/Ast'
],

function( Backbone, AstModel ) {

	var Collection = Backbone.Collection.extend( {

		initialize: function() {
			this.model = AstModel;
		}

	} );

	return Collection;

}
);