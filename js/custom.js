$(document).on("ready",function(){
  $.get( "http://openexchangerates.org/api/latest.json?app_id=209a9a50ae9b44fdbbf9ffcfb5a15a2c", function( data ) {
    $( ".result" ).html( data );
  });
});