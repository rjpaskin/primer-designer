/** Generic Class Sequence **/
(function() {
  // Bio.Sequence is a generic base class for sequences. It is meant to be extended to provide
  // functionality particular to different types of sequence.
  Bio.Sequence = function(seq, allowed) {
    var regexp = new RegExp('[^' + allowed + ']', "g");
    this.seq = seq.toUpperCase().replace(regexp, '');
    this.length = this.len();
  };
  
  var p = Bio.Sequence.prototype;
  
  // Return the count of a particular monomer.
  p.count = function(str) {
    return (this.seq.length - this.seq.replace(new RegExp(str,"g"), '').length) / str.length;
  };
  
  // Return a hash of the composition of the sequence, keyed by monomer
  // For example:
  //     var sequence = new Bio.Sequence('AATGC')
  //     sequence.composition() // => { A: 2, T: 1, G: 1, C: 1 }
  p.composition = function() {
    var count = {},
        len   = this.length;
    for (var i = 0; i < len; i++) {
      var x = this.seq[i];
      count[x] == undefined ? count[x] = 1: count[x]++;
    }
    return count;
  };
  
  // Reverse the sequence.
  p.reverse = function() {
    return new this.constructor(this.seq.split("").reverse().join(""));
  };
  
  // Generate a section of the sequence, returning a new sequence object.
  // Syntax is the same as JavaScript's `String.slice()` function.
  p.slice = function(start, end) {
    if (typeof start == 'undefined') { start = 0; }
    if (typeof end == 'undefined') { end = this.seq.length; }
        
    return new this.constructor(this.seq.slice(start, end));
  };
  
  // Generate a sub-sequence.
  // Syntax is the same as JavaScript's `String.substr()` function. 
  p.substr = function(start, length) {
    if (typeof length == undefined) {
    return new this.constructor(this.seq.substr(start));
    }
    
    return new this.constructor(this.seq.substr(start, length));
  };
  
  // Return the string representation of the sequence.
  p.toString = function() {
    return this.seq;
  };
  
  // Returns the length of the sequence.
  p.len = function() {
    return this.seq.length;
  };
  
  // Output sequence in Fasta format.
  // Pass an optional string to get a title in the output (defaults to 'Untitled sequence')
  p.toFasta = function(title) {
    if (typeof title == undefined) { title = 'Untitled sequence'; }
    return '>' + title + "\n" + this.seq.match(/.{1,80}/g).join("\n");
  };
}());