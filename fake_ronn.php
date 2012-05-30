<?php

$json = file_get_contents('data/bach1.ronn.json');

header('Content-Type: text/javascript; charset=utf8');
//echo json_encode(json_decode($json));
echo $json;