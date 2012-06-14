(function() {
  // Highlight a section of a protein sequence.
  Bio.ProteinSequence.prototype.highlight = function(start, end) {
    return '<span class="unselected">' + this.seq.slice(0, start) + '</span>'
    + '<span>'+this.seq.slice(start, end)+'</span>'
    + '<span class="unselected">' + this.seq.substr(end) + '</span>';
  };
  
  // Highlight a section of a DNA sequence.
  Bio.DNASequence.prototype.highlight = function(start, end) {
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
