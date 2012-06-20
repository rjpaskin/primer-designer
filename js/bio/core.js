(function() {
  Bio = {};

  Bio.extend = function(base, ext, extra) {
    ext.prototype = Object.create(base.prototype);
    ext.prototype.constructor = ext; // Need to explicitly set ext's constructor
  
    if (extra != null) {
      for (f in extra) {
        ext.prototype[f] = extra[f];
      }
    }
  
    // Return object's prototype for further additions
    return ext.prototype;
  }
}());