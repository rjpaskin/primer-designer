/** class GeneticCode */
Bio.GeneticCode = function(name, ncbiString) {
  this.name = name;
  this.ncbiString = ncbiString;
};

// codes from http://www.ncbi.nlm.nih.gov/Taxonomy/Utils/wprintgc.cgi
Bio.GeneticCode.STANDARD = new Bio.GeneticCode(
  "standard",
  "FFLLSSSSYY**CC*WLLLLPPPPHHQQRRRRIIIMTTTTNNKKSSRRVVVVAAAADDEEGGGG"
);