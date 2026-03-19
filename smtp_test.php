<?php
require __DIR__ . '/vendor/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;

$mail = new PHPMailer(true);

$mail->SMTPDebug = SMTP::DEBUG_SERVER;
$mail->isSMTP();
$mail->Host = 'smtp.123-reg.co.uk';
$mail->SMTPAuth = true;
$mail->Username = 'team@contributionline.com';
$mail->Password = ';A=V%(K$D{LT';
$mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
$mail->Port = 587;

$mail->setFrom('team@contributionline.com', 'Test');
$mail->addAddress('yourpersonalemail@example.com');

$mail->Subject = 'SMTP Test';
$mail->Body = 'Testing SMTP';

$mail->send();
