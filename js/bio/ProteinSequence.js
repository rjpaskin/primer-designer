/** Class ProteinSequence **/
(function() {
  Bio.ProteinSequence = function(seq) {
    Bio.Sequence.call(this, seq, 'FLSY\*CWPHQRIMTNKVADEG\?');
  };
  
  var p = PD.extend(Bio.Sequence, Bio.ProteinSequence);
  
  // Details of each amino acid
  // Molecular weight values from http://web.expasy.org/findmod/findmod_masses.html#AA
  // Weight values are for amino acids in a polypeptide chain, since:
  //     M.W. in chain = M.W of monomer - M.W. of water
  Bio.ProteinSequence.aa = {
    A: { sym: 'Ala', name: 'Alanine',       mw:  71.0788 },
    R: { sym: 'Arg', name: 'Arginine',      mw: 156.1875 },
    N: { sym: 'Asn', name: 'Asparagine',    mw: 114.1038 },
    D: { sym: 'Asp', name: 'Aspartic acid', mw: 115.0886 },
    C: { sym: 'Cys', name: 'Cysteine',      mw: 103.1388 },
    E: { sym: 'Glu', name: 'Glutamic acid', mw: 129.1155 },
    Q: { sym: 'Gln', name: 'Glutamine',     mw: 128.1307 },
    G: { sym: 'Gly', name: 'Glycine',       mw:  57.0519 },
    H: { sym: 'His', name: 'Histidine',     mw: 137.1411 },
    I: { sym: 'Ile', name: 'Isoleucine',    mw: 113.1594 },
    L: { sym: 'Leu', name: 'Leucine',       mw: 113.1594 },
    K: { sym: 'Lys', name: 'Lysine',        mw: 128.1741 },
    M: { sym: 'Met', name: 'Methionine',    mw: 131.1926 },
    F: { sym: 'Phe', name: 'Phenylalanine', mw: 147.1766 },
    P: { sym: 'Pro', name: 'Proline',       mw:  97.1167 },
    S: { sym: 'Ser', name: 'Serine',        mw:  87.0782 },
    T: { sym: 'Thr', name: 'Threonine',     mw: 101.1051 },
    W: { sym: 'Trp', name: 'Tryptophan',    mw: 186.2132 },
    Y: { sym: 'Tyr', name: 'Tyrosine',      mw: 163.1760 },
    V: { sym: 'Val', name: 'Valine',        mw:  99.1326 }
  };
  
  // Calculate the molecular weight of the sequence.
  p.calcMW = function() {
    var sum = 0,
        seq = this;
        
    var properties = this.constructor.aa;
    for (var aa in properties) {
      sum += seq.count(aa) * properties[aa].mw;
    }
    
    // Need to add MW of water
    sum += 18.015;
    
    return sum.toFixed(2);
  };
  
  // Calculate the extinction coefficient at 280 nm, based on the ProtParam algorithm.
  // Value given by default is for reduced proteins - to calculate oxidised value, pass
  // the string 'ox' as a parameter.
  p.calcExtCoeff = function(mode) {
    if (typeof mode == 'undefined') { mode = 'red'; }
    // Values from http://web.expasy.org/tools/protparam/protparam-doc.html
    var values = {
      Y: 1490,
      W: 5500
      //C: 125, // cystine
    };
    
    var seq = this,
      coeff = 0;
    
    for (var aa in values) {
      coeff += seq.count(aa) * values[aa];
    }
    
    if (mode == 'ox') {
      values.C = 125;
      coeff += Math.floor(seq.count('C') / 2) * values.C; // add on cystine value
    }
    return '&epsilon;<sub>280</sub> = ' + coeff + ' M<sup>-1</sup>&nbsp;cm<sup>-1</sup>';
  };
}());