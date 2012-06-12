$(function() {
  // AA composition
  var seq = $('#id-seq').html().split('');

  for (var s in seq) {
    var info = Bio.ProteinSequence.aa[seq[s]];
    if (info != undefined) {
      seq[s] = '<span class="' + info.sym.toLowerCase() + '">' + seq[s] + '</span>';
    }
  }
  
  //var hi = $('#id-seq').html().replace(/S/gi, '<span style="color: #fc0">S</span>');
  $('#id-seq').html(seq.join('')).addClass('rasmol');
  
  $.each(Bio.ProteinSequence.aa, function(name, info) {
    $('.aa-composition').append('<tr><td class="' + info.sym.toLowerCase() + '">' + info.sym + '</td><td>' 
    + PD.MySequence.protein.count(name) + '</td><td>' 
    + (PD.MySequence.protein.count(name)/PD.MySequence.protein.length * 100).toFixed(1) + '%</td></tr>');
  });
  $('.aa-composition').addClass('rasmol');
  
  
  $('#seq-tabs').tabs();
});