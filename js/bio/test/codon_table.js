var cdn;

module('Bio.CodonTable', {
  setup: function() {
    cdn = new Bio.CodonTable(
      "standard",
      "FFLLSSSSYY**CC*WLLLLPPPPHHQQRRRRIIIMTTTTNNKKSSRRVVVVAAAADDEEGGGG"
    );
  }
});

test('Initialises correctly', function() {
  equal(cdn.name, "standard", 'Sets name correctly');
  equal(cdn.ncbiString, "FFLLSSSSYY**CC*WLLLLPPPPHHQQRRRRIIIMTTTTNNKKSSRRVVVVAAAADDEEGGGG",
    'Sets NCBI string correctly');
});

test('Raises error on incorrect length NCBI string', function() {  
  raises(function() {
    return new Bio.CodonTable('wrong', '');
  }, 'Fails on empty string');
  
  raises(function() {
    return new Bio.CodonTable('wrong', 'FFLLSSSSYY**CC*WLLLLPPPPHHQQRRRRIIIMTTTTNNKKSSRRVVVVAAAADDEEGGG');
  }, 'Fails on short string');
  
  raises(function() {
    return new Bio.CodonTable('wrong', 'FFLLSSSSYY**CC*WLLLLPPPPHHQQRRRRIIIMTTTTNNKKSSRRVVVVAAAADDEEGGGGn');
  }, 'Fails on empty string');
});