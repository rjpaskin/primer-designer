(function() {

PD.apply_slider = function(ele) {
  var primer = $(ele),
      data   = primer.data('primerSet'),
      slider = $(ele).find(".slider");
  
  slider.slider({
    range: true,
    min: 0,
    max: PD.MySequence.protein.length,
    values: [data.start, data.end],
    slide: function(event, ui) {
      // Enforce mimimum size for constructs
      var min_len = PD.settings.min_construct_length;
      if (ui.values[1] - ui.values[0] <= min_len) { return false; }

      // Update model
      data.setStart(ui.values[0] + 1);
      data.setEnd(ui.values[1]);
      
      // Update primer box UI
      $(this).prevAll("input.range").val(data.start + ' - ' + data.end);
            
      PD.highlightAll(data.start, data.end);

      // Update homology tags on primer set
      primer
        .find(".f-primer .insert")
        .html('<span class="insert">' + data.fwd + '</span>')
        .end()
        .find(".r-primer .insert")
        .html('<span class="insert">' + data.rev + '</span>');
    },
    start: function(event, ui) {
      $(this).parents(".primer").click(); // give primer box focus
    }
  });
  slider.triggerHandler('slide');
};

PD.create_primer = function(start, end) {
  if (start == null) { start = 1; }
  if (end == null) { end = PD.MySequence.protein.length; }
  
  var data = new PD.PrimerSet(start, end);

  // Additional info for template/export
  data.num = $('#primers .primer').length + 1;
  
  var tmpl   = PD.tmpl('primer', data),
      primer = $(tmpl).appendTo('#primers');
  
  primer.data('primerSet', data);
  PD.apply_slider(primer);

  return primer;
};

PD.renumber_primers = function() {
  $("#primers .primer").each(function() {
    var el  = $(this),
        ind = el.index() + 1;
        
    el.find(".num").html(ind);
    el.data('primerSet').num = ind;
  });
};

PD.highlightAll = function(start, end) {
  $('#protein, #dna, #complement').html(function() {
    var obj = PD.MySequence[this.id];
    
    if (this.id === 'protein') {
      return PD.tmpl('protein_highlight', {
        obj:   obj,
        start: start - 1, 
        end:   end
      });
    }
    else {
      var _start = (start - 1) * 3,
          _end   = end * 3;
          
      return PD.tmpl('dna_highlight', {
        obj:    obj,
        start:  _start,
        end:    _end,
        region: obj.slice(_start, _end),
        len:    PD.settings.homology_length * 3
      });
    }
  });
};

PD.parseFasta = function(fasta) {
  var name = fasta.match(/^>(.+)$/m);
  return {
    name: name !== null ? name[1].trim() : '',
    seq:  fasta.replace(/^>.+$|[^ATCG]/gim, '')
  };
};

PD.collectPrimerInfo = function(name) {
  return $('#primers .primer').map(function() {
    var data = $(this).data('primerSet');

    return [
      name + ((2 * data.num) - 1) + ' ' + data.tags[0] + data.fwd,
      name + (2 * data.num) + ' ' + data.tags[1] + data.rev
    ];
  }).get();
}

}());