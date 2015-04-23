define( 
[
	'underscore',
	'backbone',

	'asttreeviewwithoption',

	'text!Templates/AstTabMenu.html'
],

function( _, Backbone, AstTreeViewWithOption, AstTabMenuTemplate ) {

	var View = Backbone.View.extend( {

		className: 'stg-asttabmenu',

		initialize: function( args ) {
			this.collection = args.astCollection;
			this.astTabMenuTemplate = _.template( AstTabMenuTemplate );

			this.listenTo( this.collection, 'add', this.addAstView );
		},

		render: function() {
			var html = this.astTabMenuTemplate( {
				collection: this.collection
			} );
			this.$el.append( html );
			this.$el.attr( 'role', 'tabpanel' );

			return this;
		},

		events: {},

		createNavTabHtml: function( id, name ) {
			return  '<li role="presentation">											\
						<a href="#' + id + '" aria-controls="' + id + '" role="tab" 	\
						data-toggle="tab" class="stg-ast-tab-item-btn">' + name + '		\
						<button type="button" class="close-ast-view close" data-dismiss="alert"\
						aria-label="Close"><span aria-hidden="true">×</span></button>	\
						</a>															\
					</li>';
		},

		createContantTabHtml: function( id ) {
			return '<div role="tabpanel" class="tab-pane" id="' + id + '">	\
				       <div class="astview-wrapper">						\
				         <div class="astview"></div>						\
				       </div>												\
				       <div class="astopts"></div>							\
					</div>';
		},

		addAstView: function( astModel ) {
			var len = this.collection.length;
			var id = 'ast_view_tab_' + len;
			var navTab = $( this.createNavTabHtml( id, 'ast ' + len ) );
			var contantTab = $( this.createContantTabHtml( id ) );

			this.$el.find( '.stg-ast-view-tabs' ).append( navTab );
			this.$el.find( '.stg-ast-view-content' ).append( contantTab );

			navTab.on( 'click', '.close-ast-view', function() {
				navTab.hide( 300, function() {
					navTab.remove();
				} );
				contantTab.slideUp( 300, function() {
					contantTab.remove();
				} );
			} );

			AstTreeViewWithOption( contantTab, astModel.get( 'root' ) );
		},


	} );

	return View;
}
);