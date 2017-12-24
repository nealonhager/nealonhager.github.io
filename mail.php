<?php
$name = $_POST['name'];
$email = $_POST['email'];
$subject = $_POST['subject'];
$message = $_POST['message'];
$content = "From: \n$name \n $email \n\n Message: \n $message";
$recipient = "nealonhager@gmail.com";
mail($recipient,$subject,$message) or die("Error!");
echo "Thanks!";
?>