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
  
  // Form
  $('#new-sequence')
  .on('keyup', 'textarea', function(e) {
    var fasta = PD.parseFasta($(this).val()),
        bp    = fasta.seq.length;
        
    $('#sequence-info .bp').html(bp + ' bp');
    
    var aa   = Math.floor(bp / 3),
        frac = bp % 3;
        
    switch (frac) {
      case 0: frac = '';          break;
      case 1: frac = ' &frac13;'; break;
      case 2: frac = ' &frac23;'; break;
    }
    
    $('#sequence-info .aa').html('('+ aa + frac + ' aa)');
    
    if (PD.paste_flag) {
      $('#new-sequence .title').val(fasta.name);
      PD.paste_flag = false;
    }
  })
  
  .on('paste', function() {
    PD.paste_flag = true;
  })
  
  .on('change', 'select', function() {
    // Fetch specified file and render it inside the form.
    // Trigger keyup handler to get stats about sequence.
    $.get($(this).val(), function(seq) {
      PD.paste_flag = true;
      $('#new-sequence textarea').val(seq).trigger('keyup');
    });
  })
  
   // Submit new sequence form
  .on('submit', function(e) {
    var fasta = PD.parseFasta($('#new-sequence textarea').val());
        
    PD.MySequence = new PD.SequenceSet(fasta.seq, fasta.name);
    $.event.trigger('sequenceChanged');
    $(this).hide();
    
    return false;
  });
  
  $('#sequences').on('sequenceChanged', function(data) {
    $('#protein, #dna, #complement').html(function() {
      return PD.MySequence[this.id].toString();
    }).wrapInner('<span />');
    
    $('#marker_dna').html(PD.MySequence.marker.dna);
    
    $(this).show();
  });
    
  $('#seq-title').on('sequenceChanged', function() {
    $(this).html(PD.MySequence.title);
  });
  
  /***** Button functions *****/
  $(".buttons").on('click', 'button', function(e) {
    switch (this.id.replace(/btn-/g, '')) {
      // Add primer to list
      case 'add-primer':
        PD.createPrimer();
        var primers = $("#primers .primer");

        if (primers.length === 1) {
          primers.first().trigger('click');
        }
      break;
      
      // Toggle settings panel
      case 'settings':
        $('#settings').slideToggle('fast');
        $(e.target).toggleClass('ui-state-error');
      break;
    
      // Show export dialog
      case 'export':
        var values  = [],
            primers = $("#primers .primer"),
            name    = $("input#default-name").val();
            
        if (primers.length === 0) { return false; } // nothing to export
        
        var info = PD.collectPrimerInfo(name);
        
        $('#popup-export textarea.export')
          .empty()
          .html(info.join("\n"))
          .attr("rows", info.length)
          .parent()
          .dialog("open");
      break;
      
      // #DEBUG: toggle between different screens
      case 'screens':
        var next = PD.screens.indexOf('#' + $('.sequences-wrapper > *:visible').get(0).id) + 1;
            
        if (next > PD.screens.length - 1) { next = 0; }
        $(PD.screens.join(',')).hide();
        $(PD.screens[next]).show();
      break;
    }
  });
  
  $('.display-settings').on('change', 'input:checkbox', function(event){
    $("#" + this.id.replace(/checkbox-/g, '')).toggle();
    
    var height = $(".display-settings input:checkbox:checked").length * 100 + 100;
    $("#sequences").css('line-height', height + "%");
    
    if ($("#sequences div:visible").length === 1 && $("#protein:visible").length === 1) {
      $("#protein").css('letter-spacing', '0');
    }
    else {
      $("#protein").css('letter-spacing', '18px');
    }
  });
  
  $('#primers')
  // Primer boxes
  .on('click', ".primer", function() {
    var el   = $(this),
        data = el.data('primerSet');
        
    PD.highlightAll(data.start, data.end);
    
    $(".primer").removeClass('selected');
    el.addClass('selected');
    return false;
  })
  
  .on('click', ".delete", function() {
    var deleted = $(this).parents(".primer");
    // if currently selected
    if (deleted.hasClass('selected')) {
      if (deleted.prev('.primer').click().addClass("selected").length === 0) {
        deleted.next('.primer').click().addClass("selected");
      }
    }
    deleted.remove();
    PD.renumberPrimers();
    
    // No primers left
    if ($('.primer').length === 0) {
      $('#sequences').trigger('sequenceChanged');
    }
    return false;
  })
  
  .on('change', "select.family", function() {
    var element = $(this),
        data    = element.parents('.primer').data('primerSet');
        
    data.family = element.val();
    // Update PrimerSet model
    data.getTags();
    
    element
      .nextAll('table')
      .find('.f-primer .vector')
      .html(data.tags[0])
      .end()
      .find('.r-primer .vector')
      .html(data.tags[1]);
  })
  
  .on('sequenceChanged', function() {
    $(this).children('.primer').remove();
  })
  
  .on('sortupdate', PD.renumberPrimers)
  
  .on('slide', '.primer', function(event, ui) {
      var primer = $(this),
          data   = primer.data('primerSet');
  
    // Enforce mimimum size for constructs
    var min_len = PD.settings.min_construct_length;
    if (ui.values[1] - ui.values[0] <= min_len) { return false; }

    // Update model
    data
      .setStart(ui.values[0] + 1)
      .setEnd(ui.values[1]);
    
    // Update primer box UI
    primer
      .find("input.range")
      .val(data.start + ' - ' + data.end)
      .end()
      // Update homology tags on primer set
      .find(".f-primer .insert")
      .text(data.fwd.toString())
      .end()      
      .find(".r-primer .insert")
      .text(data.rev.toString());
      
    PD.highlightAll(data.start, data.end);
  })
  
  .on('slidestart', '.primer', function() {
    $(this).click();
  });
});