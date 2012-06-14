/** class CodonTable */
Bio.CodonTable = function(name, ncbiString) {
  this.name = name;
  if (ncbiString.length === 64) {
    this.ncbiString = ncbiString;
  }
  else {
    throw new Error("NCBI string must be 64 characters long");
  }
};

// codes from http://www.ncbi.nlm.nih.gov/Taxonomy/Utils/wprintgc.cgi
Bio.CodonTable.STANDARD = new Bio.CodonTable(
  "standard",
  "FFLLSSSSYY**CC*WLLLLPPPPHHQQRRRRIIIMTTTTNNKKSSRRVVVVAAAADDEEGGGG"
);