<?php
$name = $_POST['name'];
$email = $_POST['email'];
$subject = $_POST['subject'];
$message = $_POST['message'];
$content = "From: \n$name \n $email \n\n Message: \n $message";
$recipient = "nealonhager@gmail.com";
mail($recipient,$subject,$message,"website contact sheet") or die("Error!");
echo "Thanks!";
?>