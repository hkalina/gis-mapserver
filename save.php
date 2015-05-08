<?php
ini_set('display_errors', '1');

$baseUrl = "http://".$_SERVER["SERVER_NAME"].substr($_SERVER["SCRIPT_NAME"],0,-4);

// Getting unique name
$name = "saved/".md5($_POST["exported"]).".kml";

file_put_contents($name, $_POST["exported"]);

echo $name;

