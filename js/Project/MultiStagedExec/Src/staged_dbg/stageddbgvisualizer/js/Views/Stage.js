define( 
[
	'underscore',
	'backbone',

	'Views/Ast',

	'text!Templates/Stage.html'
],

function( _, Backbone, AstView, StageTemplate ) {

	var View = Backbone.View.extend( {

		className: 'stg-dbg-page row card-box',

		initialize: function( args ) {
			this.model = args.model;
			this.astCollection = args.astCollection;
			this.stageTemplate = _.template( StageTemplate );

			this.astTabMenuView = new AstView( {
				astCollection: this.astCollection
			} );

			this.listenTo( this.model, 'change', this.changeValue );
			this.listenTo( this.astTabMenuView, 'rerender', this.renderAstTabMenu );
		},

		render: function() {
			var html = this.stageTemplate( {
				model: this.model
			} );

			this.$el.html( html );
			this.renderAstTabMenu();

			return this;
		},

		renderAstTabMenu: function() {
			this.astTabMenuHtml = this.astTabMenuHtml || this.astTabMenuView.render().el;
			this.$el.find( '.stg-asttabmenu-container' ).html( this.astTabMenuHtml );
		},

		changeValue: function() {
			_.each( this.model.changed, function( val, key ) {
				if( key === 'srcCode' ) {
					$( '.stg-prc-src-container' ).show();
					val = unescape( val );
				}
				this.$el.find( '[target-data="' + key + '"]' ).text( val );
			}, this );
		},

		events: {
			'click .stg-prc-showsrc-btn' : 'showSrcCode'
		},

		showSrcCode: function( evt ) {
			var btn = $( evt.target );
			var srcView = this.$el.find( '.stg-prc-src' );
			var toggle = btn.attr('target-toggle');
			if( toggle === 'open' ) {
				btn.attr('target-toggle', 'close');
				btn.text( 'Show staged source code' );
			}else {
				btn.attr('target-toggle', 'open');
				btn.text( 'Hide staged source code' );
			}
			srcView.toggle( toggle === 'close' );
		}


	} );

	return View;
}
);