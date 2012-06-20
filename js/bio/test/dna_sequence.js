module('Bio.DNASequence');

test('Initialises correctly', function() {
  var seq = 'ATCGATCGGGAGGT',
      obj = new Bio.DNASequence(seq);
  
  equal(seq, obj.toString(), 'Assigns sequence correctly');
  equal(seq.length, obj.toString().length, 'Sequence correct length');
  equal(seq.length, obj.length, 'Sequence correct length');
});

test('Strips out non-DNA letters', function() {
  var seq = ' A\t\rTC\nG+£$atcg',
      obj = new Bio.DNASequence(seq);
  
  equal('ATCGATCG', obj.toString(), 'Assigns sequence correctly');
  equal('ATCGATCG'.length, obj.toString().length, 'Sequence correct length');
  equal('ATCGATCG'.length, obj.length, 'Sequence correct length');
});

test('Complement', function() {
  var seq   = 'ATCGATCGGGAGGT',
      compl = 'TAGCTAGCCCTCCA',
      obj   = new Bio.DNASequence(seq);
  
  equal(compl, obj.complement().toString(), 'Correct complement');
  notStrictEqual(obj.complement(), obj.complement(), 'Returns new object');
  ok(obj.complement() instanceof Bio.DNASequence, 'Returns DNASequence');
});

test('Translate', function() {
  var seq   = 'ATGTCCCCTATACTAGGTTATTGGAAAATTAAGGGCCTTGTGCAACCCACTCGACTTCTTTTGGAATATCTTGAAGAAAAATATGAAGAGCATTTGTATG\
AGCGCGATGAAGGTGATAAATGGCGAAACAAAAAGTTTGAATTGGGTTTGGAGTTTCCCAATCTTCCTTATTATATTGATGGTGATGTTAAATTAACACA\
GTCTATGGCCATCATACGTTATATAGCTGACAAGCACAACATGTTGGGTGGTTGTCCAAAAGAGCGTGCAGAGATTTCAATGCTTGAAGGAGCGGTTTTG\
GATATTAGATACGGTGTTTCGAGAATTGCATATAGTAAAGACTTTGAAACTCTCAAAGTTGATTTTCTTAGCAAGCTACCTGAAATGCTGAAAATGTTCG\
AAGATCGTTTATGTCATAAAACATATTTAAATGGTGATCATGTAACCCATCCTGACTTCATGTTGTATGACGCTCTTGATGTTGTTTTATACATGGACCC\
AATGTGCCTGGATGCGTTCCCAAAATTAGTTTGTTTTAAAAAACGTATTGAAGCTATCCCACAAATTGATAAGTACTTGAAATCCAGCAAGTATATAGCA\
TGGCCTTTGCAGGGCTGGCAAGCCACGTTTGGTGGTGGCGACCATCCTCCAAAATCGGATCTGGTTCCGCGTGGATCCGAAAACCTGTATTTTCAGGGCG\
CC',
      trans = 'MSPILGYWKIKGLVQPTRLLLEYLEEKYEEHLYERDEGDKWRNKKFELGLEFPNLPYYID\
GDVKLTQSMAIIRYIADKHNMLGGCPKERAEISMLEGAVLDIRYGVSRIAYSKDFETLKV\
DFLSKLPEMLKMFEDRLCHKTYLNGDHVTHPDFMLYDALDVVLYMDPMCLDAFPKLVCFK\
KRIEAIPQIDKYLKSSKYIAWPLQGWQATFGGGDHPPKSDLVPRGSENLYFQGA',
      obj   = new Bio.DNASequence(seq);
  
  equal(trans, obj.translate().toString(), 'Correct translation');
  notStrictEqual(obj.translate(), obj.translate(), 'Returns new object');
  ok(obj.translate() instanceof Bio.ProteinSequence, 'Returns ProteinSequence');
  
  // TODO: handling non-DNA letters
  // TODO: handling non-divisible-by-3 sequences
});