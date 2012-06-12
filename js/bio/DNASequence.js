/** Class DNASequence **/
(function() {
  Bio.DNASequence = function(seq) {
    Bio.Sequence.call(this, seq, 'ATCG');
  };
  
  var p = PD.extend(Bio.Sequence, Bio.DNASequence);
  
  p.complement = function() {
    var bases  = { A: 'T', T: 'A', C: 'G', G: 'C' },
        output = '';
    
    var str = this.seq.split('');
    
    for (var i = 0, l = this.seq.length; i <= l; i++) {
      if (bases[str[i]] != undefined) {
        output += bases[str[i]];
      }
    }
       
    return new this.constructor(output);
  };
  
  p.translate = function() {
    var protein = "";
    for (var i = 0, l = this.seq.length; i + 2 < l; i += 3) {
      protein += this.translateCodon(this.seq[i], this.seq[i+1], this.seq[i+2]);
    }
    return new Bio.ProteinSequence(protein);
  };
    
  p.translateCodon = function(b1, b2, b3) {
    // Private sub-function
    var base2index = function(base) {
      // Switch is faster than Array#indexOf
      switch(base) {
        case 'T': return 0;
        case 'C': return 1;
        case 'A': return 2;
        case 'G': return 3;
        default: return -1;
      }
    };
    var base1 = base2index(b1),
        base2 = base2index(b2),
        base3 = base2index(b3);
    
    if (base1 == -1 || base2 == -1 || base3 == -1) {
      return '?';
    }
    else {
      return Bio.GeneticCode.STANDARD.ncbiString[base1 * 16 + base2 * 4 + base3];
    }
  };
  
  p.highlight = function(start, end) {
    var region = this.seq.slice(start, end),
        len    = PD.settings.homology_length * 3;
        
    return '<span class="unselected">' + this.seq.slice(0, start) + '</span>'
    + '<span>'
      + '<span class="n-homology">' + region.substr(0, len) + '</span>'
      + this.seq.slice(start + len, end - len)
      + '<span class="c-homology">' + region.substr(region.length - len) + '</span>'
    + '</span>'
    + '<span class="unselected">' + this.seq.substr(end)  + '</span>';
  };
}());