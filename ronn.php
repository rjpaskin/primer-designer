<?php
//$url = 'http://www.strubi.ox.ac.uk';
//$url = $_SERVER['HTTP_REFERER'] . '/ronn.php.html';
$url = 'http://localhost/~rjp44/primer_redesign/data/ronn.php.html';

$seq = <<<SEQ
QLSPAVAKDGSEQISQKRSECPWLGIRISESPEPGQRTFTTLSSVNCPFISTLSTEGCSS
NLEIGNDDYVSEPQQEPCPYACVISLGDDSETDTEGDSESCSAREQECEVKLPFNAQRII
SLSRNDFQSLLKMHKLTPEQLDCIHDIRRRSKNRIAAQRCRKRKLDCIQNLESEIEKLQS
EKESLLKERDHILSTLGETKQNLTGLCQKVCKEAALSQEQIQILAKYSAADCPLSFLISE
KDKSTPDGELALPSIFSLSDRPPAVLPPCARGNSEPGYARGQESQQMSTATSEQAGPAEQ
CRQSGGISDFCQQMTDKCTTDE
SEQ;

$seq = $_POST['seq'];

$seq = str_replace("\n", "\r\n", $seq);

$data = array(
  'sequence' => $seq, // fasta sequence
  'display_probs' => 'y',
);

$opts = array(
  'http' => array(
    'method' => "POST",
    // with \r\n line endings:
    //'content' => 'sequence=%3EBach1%0D%0AQLSPAVAKDGSEQISQKRSECPWLGIRISESPEPGQRTFTTLSSVNCPFISTLSTEGCSS%0D%0ANLEIGNDDYVSEPQQEPCPYACVISLGDDSETDTEGDSESCSAREQECEVKLPFNAQRII%0D%0ASLSRNDFQSLLKMHKLTPEQLDCIHDIRRRSKNRIAAQRCRKRKLDCIQNLESEIEKLQS%0D%0AEKESLLKERDHILSTLGETKQNLTGLCQKVCKEAALSQEQIQILAKYSAADCPLSFLISE%0D%0AKDKSTPDGELALPSIFSLSDRPPAVLPPCARGNSEPGYARGQESQQMSTATSEQAGPAEQ%0D%0ACRQSGGISDFCQQMTDKCTTDE&display_probs=y',
    'content' => http_build_query($data),
  )
);

$context = stream_context_create($opts);
$request_url = $url;
//$request_url = $url .  '/RONN';

$fp = fopen($request_url, 'r', false, $context);
$html = stream_get_contents($fp);
fclose($fp);

$out = array();

$xml = simplexml_load_string($html);
$def = '//div[@class="content"]';

$arr = $xml->xpath($def . '//img');
$out['img'] = $url . (string)$arr[0]->attributes()->{'src'};

$pre = $xml->xpath($def . '//pre');
$out['diagram'] = (string)$pre[0]; 

$out['disorder'] = explode("\n", trim((string)$pre[1]));
foreach ($out['disorder'] as &$residue) {
  $values = explode("\t", $residue);
  $residue = array(
    'r'  => $values[0],
    'd' => floatval($values[1]),
  );
}

$out['disorder_ranges'] =  (string)array_pop($xml->xpath($def . '//p[3]'));

header('Content-Type: text/javascript; charset=utf8');
echo json_encode($out);