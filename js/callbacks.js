(function() {

PD.applySlider = function(ele) {
  var primer = $(ele),
      data   = primer.data('primerSet');
  
  $(ele).find(".slider").slider({
    range:  true,
    min:    0,
    max:    PD.MySequence.protein.length,
    values: [data.start, data.end]
  })
  .triggerHandler('slide');
};

PD.createPrimer = function(start, end) {
  if (start == null) { start = 1; }
  if (end == null) { end = PD.MySequence.protein.length; }
  
  var data = new PD.PrimerSet(start, end);

  // Additional info for template/export
  data.num = $('#primers .primer').length + 1;
  
  var tmpl   = PD.tmpl('primer', data),
      primer = $(tmpl).appendTo('#primers');
  
  primer.data('primerSet', data);
  PD.applySlider(primer);

  return primer;
};

PD.renumberPrimers = function() {
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