$(function() {
  // AA composition - EXAMPLE CODE
  var seq = $('#id-seq').html().split('');

  for (var s in seq) {
    var info = Bio.ProteinSequence.aa[seq[s]];
    if (info != undefined) {
      seq[s] = '<span class="' + info.sym.toLowerCase() + '">' + seq[s] + '</span>';
    }
  }
  
  //var hi = $('#id-seq').html().replace(/S/gi, '<span style="color: #fc0">S</span>');
  $('#id-seq').html(seq.join('')).addClass('rasmol');
  
  $('.aa-composition tbody')
    .append(PD.tmpl('aa_composition', { protein: PD.MySequence.protein }))
    .parent()
    .addClass('rasmol');
  
  $('#seq-tabs').tabs();
});