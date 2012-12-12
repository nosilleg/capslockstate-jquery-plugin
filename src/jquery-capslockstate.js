/*!
 * jQuery capslockstate plugin v1.0.0
 * https://github.com/nosilleg/capslockstate-jquery-plugin/
 *
 * Copyright 2012 Jason Ellison
 * Released under the MIT license
 * https://github.com/nosilleg/capslockstate-jquery-plugin/blob/master/MIT-LICENSE.txt
 *
 * Date: Fri Jul 21 2012 02:35:00 GMT
 */
(function( $ ) {

    var capslockState = "unknown";
	
	var methods = {
		init : function ( options ) {

	        // Create some defaults, extending them with any options that were provided
	        var settings = $.extend( {
	        	// No defaults, because there are no options
	        }, options);

	        var helpers = {
	            isCapslockOn : function(event) {

	                var charCode = event.which; // logs which key was pressed
	                
	                var shiftOn = false;
	                if (event.shiftKey) { // determines whether or not the shift key was held
	                    shiftOn = event.shiftKey; // stores shiftOn as true or false
	                } else if (event.modifiers) { // determines whether or not shift, alt or ctrl were held
	                    shiftOn = !!(event.modifiers & 4); 
	                }

	                if (charCode >= 65 && charCode <= 90) {
	                    capslockState = !shiftOn;
	                }
	                if (charCode >= 97 && charCode <= 122) {
	                    capslockState = shiftOn;
	                }

	                return capslockState;

	            },
	            
	            isCapslockKey : function(event) {

	                var keyCode = event.which; // logs which key was pressed
	                
	                if (keyCode === 20) {
	                    
	                    if (capslockState !== "unknown") {
	                        capslockState = !capslockState;    
	                    }    
	                                
	                }
	                
	                return capslockState;
	    
	            },
	            
	            hasStateChange : function(previousState, currentState) {

	                if (previousState !== currentState) {
	                    $('body').trigger("capsChanged");

	                    if (currentState === true) {                        
	                        $('body').trigger("capsOn");                        
	                    } else if (currentState === false) {                        
	                        $('body').trigger("capsOff");                        
	                    } else if (currentState === "unknown") {                    
	                        $('body').trigger("capsUnknown");    
	                    }
	                }
	            }
	        };
	        
	        return this.each(function() {
	            
	            $('body').bind("keypress.capslockstate", function(event){
	                var previousState = capslockState;
	                capslockState = helpers.isCapslockOn(event);
	                helpers.hasStateChange(previousState, capslockState);
	            });
	            
	            $('body').bind("keydown.capslockstate", function(event){
	                var previousState = capslockState;
	                capslockState = helpers.isCapslockKey(event);
	                helpers.hasStateChange(previousState, capslockState);
	            });
	                     
	            // If the window loses focus then we no longer know the state
	            $(window).bind("focus.capslockstate", function(){
	                var previousState = capslockState;
	                capslockState = "unknown";
	                helpers.hasStateChange(previousState, capslockState);
	            });
	        
	        });

		},
		state : function() {
			return capslockState;
		},
		destroy : function() {
			return this.each(function(){
				$('body').unbind('.capslockstate');
				$(window).unbind('.capslockstate');
			})
		}
	}

	jQuery.fn.capslockstate = function( method ) {
    
    	// Method calling logic
    	if ( methods[method] ) {
			return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof method === 'object' || ! method ) {
			return methods.init.apply( this, arguments );
		} else {
			$.error( 'Method ' +  method + ' does not exist on jQuery.capslockstate' );
		}

    };
})( jQuery );