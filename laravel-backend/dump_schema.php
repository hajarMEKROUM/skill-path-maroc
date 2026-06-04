<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();
$tables = \DB::select("SELECT name, sql FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'");
$out = "";
foreach($tables as $t) {
    $out .= $t->name . ":\n" . $t->sql . "\n\n";
}
file_put_contents('schema_full.txt', $out);
