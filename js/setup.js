(function() {

PD.apply_slider = function(ele) {
  var primer = $(ele),
      data   = primer.data('primerSet');
  
  $(ele).find(".slider").slider({
    range: true,
    min: 0,
    max: PD.MySequence.protein.length,
    values: [data.start, data.end],
    slide: function(event, ui) {
      // Enforce mimimum size for constructs
      var min_len = PD.settings.min_construct_length;
      if (ui.values[1] - ui.values[0] <= min_len) { return false; }
            
      data.setStart(ui.values[0] + 1);
      data.setEnd(ui.values[1]);
      
      $(this).prevAll("input.range").val(data.start + ' - ' + data.end);
            
      PD.highlightAll(data.start, data.end);
        
      var table = $(this).nextAll("table"),
          tag   = PD.settings.homology[data.family];
      
      $(this).nextAll("table").find(".f-primer td.seq .insert")
        .html('<span class="insert">'+data.fwd+'</span>')
      .end().find(".r-primer td.seq .insert")
        .html('<span class="insert">'+data.rev+'</span>');
    },
    start: function(event, ui) {
      $(this).parents(".primer").click(); // give primer box focus
    }
  });
  $(ele).find('.slider').trigger('slide');
};

PD.create_primer = function(start, end) {
  if (typeof start === 'undefined') { start = 1; }
  if (typeof end === 'undefined') { end = PD.MySequence.protein.length; }
  
  var data = new PD.PrimerSet(start, end);
  var tmpl_data = {
    fwd:   data.fwd,
    rev:   data.rev,
    tag:   PD.settings.homology[data.family],
    start: data.start,
    end:   data.end,
    num:   $('#primers .primer').length + 1
  };
  
  var tmpl   = PD.tmpl('primer_tmpl', tmpl_data),
      primer = $(tmpl).appendTo('#primers');
  
  primer.data('primerSet', data);
  PD.apply_slider(primer);

  return primer;
};

PD.renumber_primers = function() {
  $("#primers .primer").each(function() {
    var el = $(this);
    el.find(".num").html(el.index() + 1);
  });
};

PD.highlightAll = function(start,end) {
  $.each(['protein', 'dna', 'complement'], function(i,seq) {
    var factor = (seq !== 'protein') ? 3 : 1;
    $('#'+seq).html(PD.MySequence[seq].highlight(
      (start - 1) * factor, end * factor
    ));
  });
};

PD.parseFasta = function(fasta) {
  var name = fasta.match(/^>(.+)$/m);
  return {
    name: name !== null ? name[1].trim() : '',
    seq:  fasta.replace(/^>.+$|[^ATCG]/gim, '')
  };
};

}());

/** Setup on DOM load **/
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
    tolerance: 'pointer',
    update:    PD.renumber_primers
  });
  
  $("#primers .primer").first().addClass("selected");
  
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
  
  // Form
  $('#new-sequence').on('keyup', 'textarea', function(e) {
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
  }).bind('paste', function() {
    PD.paste_flag = true;
  });
  
  // Access to files in 'seq' directory for quick selection
  $.get('_select_seq.php', function(data) {
    // Fetch <select> element built on the server and attach change event
    $(data).appendTo('#new-sequence').children('select').change(function() {
      // Fetch specified file and render it inside the form.
      // Trigger keyup handler to get stats about sequence.
      $.get($(this).val(), function(seq) {
        PD.paste_flag = true;
        $('#new-sequence textarea').val(seq).trigger('keyup');
      });
    });
  });
  
  // Submit new sequence form
  $(document).on('submit', "#new-sequence", function(e) {
    var fasta = PD.parseFasta($('#new-sequence textarea').val());
        
    PD.MySequence = new PD.SequenceSet(fasta.seq, fasta.name);
    $.event.trigger('sequenceChanged');
    $(this).hide();
    
    return false;
  });
  
  $('#sequences').bind('sequenceChanged', function(data) {
    $.each(['protein', 'dna', 'complement'], function(i,seq) {
      $('#'+seq).html(PD.MySequence[seq].toString()).wrapInner('<span />');
    });
    $('#marker_dna').html(PD.MySequence.marker.dna);
    
    $(this).show();
  });
  
  $('#primers').bind('sequenceChanged', function() {
    $(this).children('.primer').remove();
  });
  
  $('#seq-title').bind('sequenceChanged', function() {
    $(this).html(PD.MySequence.title);
  });
  
  /***** Button functions *****/
  $(".buttons").on('click', 'button', function(e) {
    switch (this.id.replace(/btn-/g, '')) {
      // Add primer to list
      case 'add-primer':
        PD.create_primer();

        if ($("#primers .primer").length === 1) {
          $("#primers .primer").first().trigger('click');
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
            primers = $("#primers .primer");
        if (primers.length === 0) { return false; } // nothing to export
    
        primers.each(function(index) {
          var name = $("input#default-name").val(),
              ind  = index + 1,
              data = $(this).data('primerSet'),
              tags = PD.settings.homology[data.family];
      
          values.push(name + ((2 * ind) - 1) + ' ' + tags[0] + data.fwd);
          values.push(name + (2 * ind) + ' ' + tags[1] + data.rev);
        });
        $('#popup-export textarea.export').empty()
        .html(values.join("\n")).attr("rows", values.length)
        .parent().dialog("open");
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
  
  $(document)
  // Primer boxes
  .on('click', ".primer", function() {
    var el   = $(this),
        data = el.data('primerSet');
        
    PD.highlightAll(
      data.start,
      data.end
    );
    $(".primer").removeClass('selected');
    el.addClass('selected');
    return false;
  })
  
  .on('click', ".delete", function() {
    var deleted = $(this).parents(".primer");
    // if currently selected
    if (deleted.attr('class').search(/selected/) !== -1) {
      if (deleted.prev('.primer').click().addClass("selected").length === 0) {
        deleted.next('.primer').click().addClass("selected");
      }
    }
    deleted.remove();
    PD.renumber_primers();
    
    // No primers left
    if ($('.primer').length === 0) {
      $('#sequences').trigger('sequenceChanged');
    }
    return false;
  })
  
  .on('change', "select.family", function() {
    var el     = $(this),
        family = el.val(),
        tag    = PD.settings.homology[family],
        data   = el.parents('.primer').data('primerSet');
        
    data.family = family;
    
    el.nextAll('table')
    .find('.f-primer .vector').html(tag[0]).end()
    .find('.r-primer .vector').html(tag[1]);
  });
});