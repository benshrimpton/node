/**
 * Created by tebesfinwo on 8/20/14.
 */

'use strict';

$(document).on('change', '#different-shipping-address', function(e){

    if ( $(this).prop('checked') ) {
        $('.shipping-form').show();
    } else {
        $('.shipping-form').hide();
    }

});
