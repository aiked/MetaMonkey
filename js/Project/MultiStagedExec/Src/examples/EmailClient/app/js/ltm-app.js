// tmplBasicLayout
// tmplLeftMenu
// tmplEmailList
// tmplEmailListItem
// tmplComposeEmail

var GenerateComposeEmailView = function( emailEntry ) {
	var composeEmail = $( window.tmplComposeEmail ).clone();
	if( emailEntry ) {
		composeEmail.find( '.ltm-compose-to' ).val( emailEntry.to );
		composeEmail.find( '.ltm-compose-from' ).val( emailEntry.senter );
		composeEmail.find( '.ltm-compose-subject' ).val( emailEntry.title );
		composeEmail.find( '.ltm-compose-body' ).val( emailEntry.body );
	}
	return composeEmail;
};

var GenerateEmailListItemView = function( emailEntry, onItemSelected ) {
	var emailListItem = $( window.tmplEmailListItem ).clone();
	emailListItem.find( '.ltm-email-list-item-senter' ).text( emailEntry.senter );
	emailListItem.find( '.ltm-email-list-item-title' ).text( emailEntry.title );
	emailListItem.find( '.ltm-email-list-item-date' ).text( emailEntry.date );
	emailListItem.find( '.wx-wxBoxSizer > .wx-wxBoxSizer-item:nth-child(2) *' ).click( function() {
		onItemSelected( emailEntry );
	} );
	return emailListItem;
};

var GenerateEmailListView = function( category, onItemSelected ) {
	var emailList = $( window.tmplEmailList ).clone();
	var containerSel = emailList.find( '.ltm-email-list-container' );

	_.each( category, function( emailEntry ) {
		var emailListItemView = GenerateEmailListItemView( emailEntry, onItemSelected );
		containerSel.append( emailListItemView );
	} );

	return emailList;
};

var GenerateLeftMenuView = function() {
	var leftMenu = $( window.tmplLeftMenu );
	return leftMenu;
};

var GenerateHeaderView = function() {
	var tmplHeader = $( window.tmplHeader );
	return tmplHeader;
};

var GenerateBasicLayoutView = function( menu, header ) {
	var basicLayout = $( window.tmplBasicLayout );
	basicLayout.find( '.ltm-header-container' ).append( header );
	basicLayout.find( '.ltm-left-menu-container' ).append( menu );
	return basicLayout;
};

var GenerateLayoutView = function() {

	var leftMenuView = GenerateLeftMenuView();
	var headerView = GenerateHeaderView();
	var layoutView = GenerateBasicLayoutView( leftMenuView, headerView );

	var currView, currLink;
	var openPage = function( view, linkSel ) {
		if( currView ) {
			currView.remove();
		}
		if( linkSel ) {
			if( currLink ) {
				currLink.removeClass( 'enable' );
			}
			linkSel.addClass( 'enable' );
			currLink = linkSel;
		}
		currView = view;
		layoutView.find( '.ltm-email-body-container' ).append( view );
	};

	leftMenuView.find( '.ltm-compose-mail' ).click( function() {
		var composeEmailView = GenerateComposeEmailView();
		openPage( composeEmailView, $(this) );
	} );	

	_.each( [ 'inbox', 'sent', 'trash', 'draft' ], function( linkType ) {
		leftMenuView.find( '.ltm-menu-link-open-' + linkType ).click( function( evt ) {
			evt.preventDefault();
			var composeEmailView = GenerateEmailListView( ltmDB[ linkType ], function( emailEntry ) {
				var composeEmailView = GenerateComposeEmailView( emailEntry );
				openPage( composeEmailView );
			} );
			openPage( composeEmailView, $(this) );
		} );	
	} );


	leftMenuView.find( '.ltm-compose-mail' ).click();
	return layoutView;
};

$(document).ready( function() {

	var layoutView = GenerateLayoutView();
	$( '#content' ).append( layoutView );

} );