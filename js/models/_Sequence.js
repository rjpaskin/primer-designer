/** Generic Class Sequence **/
(function() {
  PD.Sequence = function(seq, allowed) {
    var regexp = new RegExp('[^' + allowed + ']', "g");
    this.seq = seq.toUpperCase().replace(regexp, '');
    this.length = this.len();
  }
  
  var p = PD.Sequence.prototype;
  
  p.count = function(str) {
    return (this.seq.length - this.seq.replace(new RegExp(str,"g"), '').length) / str.length;
  }
  
  p.composition = function() {
    var count = {},
        len   = this.length;
    for (var i = 0; i < len; i++) {
      var x = this.seq[i];
      count[x] == undefined ? count[x] = 1: count[x]++;
    }
    return count;
  }
  
  p.reverse = function() {
    return new this.constructor(this.seq.split("").reverse().join(""));
  }
  
  p.slice = function(start, end) {
    if (typeof start == 'undefined') { start = 0 }
    if (typeof end == 'undefined') { end = this.seq.length }
        
    return new this.constructor(this.seq.slice(start, end));
  }
  
  p.substr = function(start, length) {
    if (typeof length == undefined) {
    return new this.constructor(this.seq.substr(start));
    }
    
    return new this.constructor(this.seq.substr(start, length));
  }
  
  p.highlight = function(start, end) {
    return '<span class="unselected">' + this.seq.slice(0, start) + '</span>'
    + '<span>'+this.seq.slice(start, end)+'</span>'
    + '<span class="unselected">' + this.seq.substr(end) + '</span>';
  }
  
  p.toString = function() {
    return this.seq;
  }
  
  p.len = function() {
    return this.seq.length;
  }
  
  p.toFasta = function(title) {
    if (typeof title == undefined) { title = 'Untitled sequence' }
    return '>' + title + "\n" + this.seq.match(/.{1,80}/g).join("\n");
  }
})();