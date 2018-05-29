(function( $ ) {
    $.fn.editor = function( options ) {

	var settings = $.extend({
	    locale: 'en',
	    transliterate: true
	}, options );
	
	var editbox = this.find('.editbox');
	var input   = this.find('input:text, textarea').first( );
	input.hide( );
	editbox.html(input.val( ));	
	
	this.find('.linker.modal input')
	    .api({
		action: 'get link items',
		stateContext: '.linker.modal .ui.input',
		dataType: 'script',
	    })
	;
	
	editbox
	    .blur( function( ) {
		var sFieldNum =this.id;
		input.val( $(this).html( ) );
	    })
	;
		    
	this.find('select')
	    .change( function( ) {
		var sCmd     = $(this).attr('id');
		var value    = $(this).find( 'option:selected' ).val( );
		if ( value < 1) { return; }
		formatDoc(editbox, sCmd, value);
	    })
	;
	
	this.find('.editor-button')
	    .click( function( ) {
		sCmd = $(this).attr('id');
		customCommands.hasOwnProperty(sCmd) ?
		    customCommands[sCmd](editbox) :
		formatDoc(editbox, sCmd, $(this).alt || false);
	    })
	;
	
	customCommands = {
	    "cleanDoc": function (oDoc) {
		if (confirm("Are you sure?")) { oDoc.innerHTML = ""; };
	    },
	    
	    "createLink": function (oDoc) {
		var sel = window.getSelection( );
		var range = sel.getRangeAt(0);
		console.log( range );
		
		$('.linker.modal')
		    .on('click', '.can.item', function( ){
			oDoc.focus( );
			sel  = window.getSelection( );
			sel.removeAllRanges( );
			sel.addRange(range);
			document.execCommand('createLink', false, $(this).data('url') );
			$('.linker.modal').modal('hide');
		    });
		$('.linker.modal').modal('show');
	    },
	    
	    "insertNote": function (oDoc) {
		var sNote = prompt("Add Note", "");
		var sLink = prompt("Unique Id", "");
		if( sNote && sNote !="" ){
		    formatDoc(oDoc, "createLink", "#");
		    var text = window.getSelection( ).focusNode.textContent;
		    var link = window.getSelection( ).focusNode.parentNode;
		    link.href = "";
		    link.id = sLink + "-ref";	
		    link.setAttribute("aria-describedby", "footnote-label");
		    
		    $("#notes").append
		    ('<li id="'+sLink+'">'+ sNote
		     +'<a aria-label="Back to content" href="">&#8617;</a></li>');
		    
		}
	    },
	    "insertImage": function(oDoc) {
		$("#upload_modal").modal('show');
		oDoc.focus();
	    },
	    "insertIframe": function(oDoc) {
		var url = prompt('Please enter the url', '');
		oDoc.append(url);
		oDoc.focus( );
	    }
	    
	};
	
    };
}( jQuery ));

function formatDoc(oDoc, sCmd, sValue) {
    oDoc.focus( );
    var flag = document.execCommand(sCmd, false, sValue);
    return flag;
}
