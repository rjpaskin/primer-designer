/** Class SequenceSet **/
(function() {
  PD.SequenceSet = function(dna, title) {
    this.dna = new Bio.DNASequence(dna);
    
    this.complement = this.dna.complement();
    this.protein = this.dna.translate();
    this.marker = {
      dna: this.ruler(this.dna),
      protein: this.ruler(this.protein, 30)
    };
    this.title = title || '';
    if (title instanceof Array) { this.title = title[1]; }
  };
  
  var p = PD.SequenceSet.prototype;
  
  p.ruler = function(str, padding) { // for protein: padding = 30, CSS::left: 6px
    if (padding == null) { padding = 10; }
    
    if (typeof str !== 'String') {
      str = str.toString();
    }
    
    var count = Math.floor(str.length / 10), // how many numbers to output
        nums  = '';
  
    for (var i = 1; i <= count; i++) {
      var pad_n = padding - i.toString().length - 1,
          text  = '<span class="marker-group"><span class="spacer">'
                  + (new Array(parseInt(pad_n) + 1).join('&nbsp;'))
                  + '</span><span class="number">' + i + '<u>0</u></span></span>';
      nums += text;
    }
  
    return nums;
  };
}());