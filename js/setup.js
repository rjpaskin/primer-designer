$(function() {
   // #DEBUG: Quick loading of particular panel from address hash
   PD.screens = ['#new-sequence', '#sequences', '#info-panel' /*, '#ronn'*/];
   if (location.hash !== '' && PD.screens.indexOf(location.hash) !== -1) {
     $(PD.screens.join(',')).hide();
     $(location.hash).show();
   }
      
  // Setup sortable primers
  $("#primers").sortable({
    items:     '.primer',
    handle:    '.header',
    axis:      'y',
    tolerance: 'pointer'
  });
    
  $("button").each(function() {
    var el   = $(this),
        icon = el.attr('data-icon');
    el.button({
      icons: {
         primary: icon
      }
    });
  });
  
  // Create export dialog
  $('#popup-export').dialog({
    modal:     true,
    width:     '60%',
    draggable: false,
    autoOpen:  false,
    title:     'Export'
  });
  
  // Access to files in 'seq' directory for quick selection
  $.get('_select_seq.php', function(data) {
    // Fetch <select> element built on the server
    $(data).appendTo('#new-sequence')
  });
});