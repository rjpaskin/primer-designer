(function(PD) {
PD.settings = PD.settings || {};

PD.settings.homology = {
  'A':          ['GTATTTTCAGGGCGCC',         'GACGGAGCTCGAATTTCA'],
  'B (His)':    ['AGGAGATATACATATG',         'GAAGTACAGGTTCTC'],
  'B (no His)': ['AGGAGATATACATATG',         'GAAGTACAGGTTCTCTCA'],
  'C':          ['TACTTCCAATCCATG',          'TATCCACCTTTACTGTCA'],
  'D (w/ TEV)': ['GTATTTTCAGGGCGCC',         'GTCGACTGCAGAATTtca'],
  'E (no TEV)': ['TCCGGACTCAGATCT',          'GTCGACTGCAGAATTtca'],
  'F':          ['CGAAACGAGGAATTCTCGATG',    'CAGGTTCTCACTAGT'],
  'G':          ['GCTCGAGAATTCTTCG',         'CAGGTTCTCACTAGT'],
  'H':          ['TACGTAGAATTCTCGATG',       'CAGGTTCTCACTAGT'],
  'I':          ['TACGTAGAATTCTCG',          'CAGGTTCTCACTAGT'],
  'J (w/ TEV)': ['GTATTTTCAGGGCGCC',         'CAATGCCAATAGGATATCtca'],
  'K (no TEV)': ['TCCGGACTCAGATCT',          'GTGGTGGTGGTGCTCGAGtca'],
  '72':         ['CATCATTTTGGCAAAGAATTCATG', 'GGAGGGAGAGGGGCGGAATTCtca'],
  '73':         ['ACCTGTGGGTACCCGCTCGAGATG', 'TATCGATACCGTCGACCTCGAGtca'],
  '74':         ['TCTGCTACCACAGCCGCGGATCC',  'TCCTTCACAAAGATCCTCTAGAtca'],
  '76':         ['CATCATCAGACCACGCGGATTC',   'TCCTTCACAAAGATCCTCTAGAtca']
};

PD.settings.homology_length = 7; // amino acids
PD.settings.min_construct_length = (PD.settings.homology_length * 2) - 1;
})(window.PD);
