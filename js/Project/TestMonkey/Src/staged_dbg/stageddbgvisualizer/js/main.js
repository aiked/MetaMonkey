
require.config( 
{
	paths: {
		jquery:                 'Lib/jquery.min',
		underscore:             'Lib/underscore-min',
		backbone:               'Lib/backbone-min',
		bootstrap:              'Lib/bootstrap.min',
    'bootstrap-slider':     'Lib/bootstrap-slider.min',

    asttreeviewwithoption:  'Ast/asttreeviewwithoptions',
    asttreeviewdraw:        'Ast/asttreeviewdraw',
    asttreeview:            'Ast/asttreeview',
    asttreestringify:       'Ast/asttreestringify',
    asttraverse:            'Ast/asttraverse',
    optionsgenerator:       'Helpers/OptionsGen'

	},

  shim: {
      jquery: {
          exports: '$'
      },
      backbone: {
          deps: [ 'underscore', 'jquery' ],
          exports: 'Backbone'
      },
      underscore: {
          exports: '_'
      },
      bootstrap : { deps : [ 'jquery' ] }
  }
} 
);

require( 
[
  // Load our app module and pass it to our definition function
  'app'
], 

function( App ) {

  // The "app" dependency is passed in as "App"
  App.initialize();
  App.startSyncPollingProcess();
} 
);