/** class GeneticCode */
PD.GeneticCode = function(name, ncbiString) {
  this.name = name;
  this.ncbiString = ncbiString;
};

// codes from http://www.ncbi.nlm.nih.gov/Taxonomy/Utils/wprintgc.cgi
PD.GeneticCode.STANDARD = new PD.GeneticCode(
  "standard",
  "FFLLSSSSYY**CC*WLLLLPPPPHHQQRRRRIIIMTTTTNNKKSSRRVVVVAAAADDEEGGGG"
);