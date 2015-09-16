define(
[
  'jquery',
  'underscore',
  'backbone',
  'bootstrap',

  'Helpers/Connector',

  'Models/Stage',
  'Models/Ast',

  'Collections/Ast',

  'Views/Stage'
],

function(
  $,
  _,
  Backbone,
  Bootstrap,

  Connector,

  StageModel,
  AstModel,

  AstCollection,

  StageView
) {

  var SERVER_POLLING_INTERVAL = 4 * 1000;

  var rootDom, stageModel, astCollection, stageView;

	var initialize = function() {
	
    rootDom = $('#container');

    stageModel = new StageModel( { 
      status: 'Not connected yet' 
    } );

    astCollection = new AstCollection();

    stageView = new StageView( {
      model: stageModel,
      astCollection: astCollection
    } );

    rootDom.append( stageView.render().el );

	};

  var startSyncPollingProcess = function() {
    var syncMutex = {
      start:      function() { this.isSyncing = true; },
      stop:       function() { this.isSyncing = false; },
      isSyncing:  false
    };

    var onServerSyncSuccess = function( msg ) {
      stageModel.set( 'status', 'synced' );

      if( _.has( msg, 'inlines' ) ) {
        stageModel.set( 'inlines', msg.inlines );
      }

      if( _.has( msg, 'stage' ) ) {
        stageModel.set( 'depth', msg.stage.depth );
        stageModel.set( 'srcCode', msg.stage.srcCode );
      }

      if( _.has( msg, 'inspectAst' ) ) {
        var ast = new AstModel( {
          root: msg.inspectAst
        } );
        astCollection.add( ast );
      }

      syncMutex.stop();
    };

    var onServerSyncFail = function( resp ) {
      syncMutex.stop();
    };

    var serverSync = function() {
      if( syncMutex.isSyncing ) {
        return;
      }
      syncMutex.start();
      stageModel.set( 'status', 'syncing' );
      Connector.send( 'SYNC', {
        success:  onServerSyncSuccess,
        fail:     onServerSyncFail
      } );
    };

    setInterval( serverSync, SERVER_POLLING_INTERVAL );
  };

	return { 
    initialize:               initialize,
    startSyncPollingProcess:  startSyncPollingProcess
  };
}
);