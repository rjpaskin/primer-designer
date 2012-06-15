PD.translate_tag = function(tag, formatted) {
  if (formatted == null) { formatted = false; }
  var cmpnts = tag.split('-'),
      str    = '';
  
  for (var i in cmpnts) {
    var key = cmpnts[i].replace(/[\{\}]/g, '').split('*'),
        multiplier = ((key.length > 1) ? parseInt(key[1], 10) : 1),
        arr = new Array(multiplier + 1);
   
    if (PD.settings.tags[key[0]] != undefined) {
      str += '-' + arr.join(PD.settings.tags[key[0]]);
    }
    else {
      str += '-' + arr.join(key[0]);
    }
  }
    
  return new Bio.ProteinSequence(str);
};

$(function() {
  // #SERVER-SIDE
  function setup_tag_styles() {
	var str = '',
	kelly_col = ['#DFCC52', '#5F2774', '#C26435', '#9CC7D6', '#A01F39',
                 '#B6B881', '#767976', '#62A04B', '#C27AA2', '#4C6B9E',
                 '#C87D63', '#3E2D7C', '#CF9C41', '#7C2177', '#E1E965',
                 '#611B1F', '#8AA844', '#583220', '#B52C30', '#26311E'],
	// get rgb for hex: parseInt(h.substring(0,2),16), parseInt(h.substring(2,4),16), parseInt(h.substring(4,6),16)
	num = 0;
	
	$.each(PD.settings.tags, function(name, value) {
		str += '.tag-' + name.toLowerCase().replace(/ /g, '-') + ' { background-color: ' + kelly_col[num] + ";}\n";
		num += 1;
	});
						
	$('#styles').append(str);
  
  }
  setup_tag_styles();
  
  function attach_protein_tag(vector, seq) {
    var is_c_term  = ['pLEICS-05', 'pLEICS-06 (2nd)'],
        components = [seq.join('-'),
                      '&mdash;',
                      '<span class="tag tag-protein">Protein</span>'];
        
    if (is_c_term.indexOf(vector) != -1) { //is C-term.
      components = components.reverse();
    }
    return components.join('');
  }
  
  $.each(PD.settings.vectors, function(name, tag) {
    var cmpnts = tag.split('-'),
        arr = [];
    for (var n in cmpnts) {
      var key = cmpnts[n].replace(/[\{\}]/g, '').split('*'),
          extra = '';
      
      if (PD.settings.tags[key[0]] != undefined) {
        if (key[1] != undefined) {
          extra = '<sub>' + key[1] + '</span>';
        }
        arr.push('<span class="tag tag-' + key[0].toLowerCase().replace(/ /g, '-') +'">' + key[0] + extra + '</span>');
      }
      else {
        arr.push('<span>' + key[0] + '</span>');
      }
    }
    $('#tags').append('<tr style="display:none"><td>' + name + '</td><td style="color: #666" class="vector-tag">'
    + attach_protein_tag(name, arr) + '</td><td>'
    + PD.translate_tag(tag).calcMW() + '</td></tr>');
  });
  $('#tags tr').eq(Math.floor(Math.random()*21)).show();
});