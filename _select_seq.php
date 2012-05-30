<?php

$files = glob('data/seq/*.fasta');
$str = '<p>Or select a commonly-used sequence: <select>\
<option value="none">Select a file..</option>';

foreach ($files as $file) {
  $str .= '<option value="' . $file . '">' . str_replace('_', ' ', basename($file, '.fasta')) . '</option>';
}

echo $str . '</select></p>';