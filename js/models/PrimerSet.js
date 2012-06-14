/** Class PrimerSet **/
(function() {
  PD.PrimerSet = function(start, end, family) {
    this.setStart(start);
    this.setEnd(end);
  
    this.setFwd();
    this.setRev();
    
    if (family == null) { family = 'A'; }
    this.family = family;
  };
  
  var p = PD.PrimerSet.prototype;
  
  p.setStart = function(start) {
    this.start = start;
    this.dna_start = (start - 1) * 3;
    this.setFwd();
    return this;
  };
  
  p.setEnd = function(end) {
    this.end = end;
    this.dna_end = end * 3;
    this.setRev();
    return this;
  };
  
  p.setFwd = function() {
    var len = PD.settings.homology_length * 3;
    this.fwd = PD.MySequence.dna.substr(this.dna_start, len);
    return this;
  };
  
  p.setRev = function() {
    var len = PD.settings.homology_length * 3;
    this.rev = PD.MySequence.complement.substr(this.dna_end - len, len).reverse();
    return this;
  };
}());