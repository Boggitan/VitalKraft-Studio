<?php
// Скрипт для отправки email с использованием PHPMailer
// Для работы этого скрипта необходимо установить PHPMailer через Composer:
// composer require phpmailer/phpmailer

// Проверяем, установлен ли PHPMailer
if (!file_exists(__DIR__ . '/vendor/autoload.php')) {
    // Если PHPMailer не установлен, используем стандартный обработчик
    include 'form-handler.php';
    exit;
}

// Подключаем автозагрузчик Composer
require __DIR__ . '/vendor/autoload.php';

// Импортируем классы PHPMailer
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

// Настройки для отправки email
$recipient_email = "bmt2017@ukr.net"; // Email получателя
$site_name = "VitalKraft Studio";

// Получаем данные из формы
$form_type = isset($_POST['form_type']) ? $_POST['form_type'] : 'unknown';
$name = isset($_POST['name']) ? htmlspecialchars($_POST['name']) : '';
$email = isset($_POST['email']) ? htmlspecialchars($_POST['email']) : '';
$training_type = isset($_POST['training-type']) ? htmlspecialchars($_POST['training-type']) : '';

// Формируем заголовок письма
$subject = "Neue Anfrage von $site_name Website";
if ($form_type === 'newsletter') {
    $subject = "Neue Newsletter-Anmeldung von $site_name Website";
}

// Формируем текст письма
$message = "<html><body>";
$message .= "<h2>Neue Anfrage von $site_name Website</h2>";
$message .= "<p><strong>Formular:</strong> " . ($form_type === 'newsletter' ? 'Newsletter-Anmeldung' : 'Probetraining-Anfrage') . "</p>";

if (!empty($name)) {
    $message .= "<p><strong>Name:</strong> $name</p>";
}

if (!empty($email)) {
    $message .= "<p><strong>E-Mail:</strong> $email</p>";
}

if (!empty($training_type)) {
    $message .= "<p><strong>Trainingsart:</strong> $training_type</p>";
}

// Добавляем информацию о времени отправки и IP-адресе
$message .= "<p><strong>Datum und Zeit:</strong> " . date('d.m.Y H:i:s') . "</p>";
$message .= "<p><strong>IP-Adresse:</strong> " . $_SERVER['REMOTE_ADDR'] . "</p>";
$message .= "</body></html>";

// Логирование запросов для отладки
$log_file = 'form_submissions.log';
$log_message = date('Y-m-d H:i:s') . " | Form: $form_type | Name: $name | Email: $email | Training: $training_type | ";

try {
    // Создаем экземпляр PHPMailer
    $mail = new PHPMailer(true);
    
    // Настройки сервера (замените на свои)
    // $mail->SMTPDebug = SMTP::DEBUG_SERVER; // Раскомментируйте для отладки
    $mail->isSMTP();
    $mail->Host       = 'smtp.example.com'; // Замените на свой SMTP сервер
    $mail->SMTPAuth   = true;
    $mail->Username   = 'your-email@example.com'; // Замените на свой email
    $mail->Password   = 'your-password'; // Замените на свой пароль
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port       = 587;
    
    // Отправитель и получатель
    $mail->setFrom('no-reply@vitalkraft.com', $site_name);
    $mail->addAddress($recipient_email);
    
    // Если указан email пользователя, добавляем его как Reply-To
    if (!empty($email)) {
        $mail->addReplyTo($email, $name);
    }
    
    // Содержимое письма
    $mail->isHTML(true);
    $mail->CharSet = 'UTF-8';
    $mail->Subject = $subject;
    $mail->Body    = $message;
    
    // Отправляем письмо
    $mail->send();
    $log_message .= "Sent: Yes\n";
    file_put_contents($log_file, $log_message, FILE_APPEND);
    
} catch (Exception $e) {
    // Логируем ошибку
    $log_message .= "Sent: No | Error: " . $mail->ErrorInfo . "\n";
    file_put_contents($log_file, $log_message, FILE_APPEND);
    
    // Пробуем отправить через стандартную функцию mail()
    $headers = "From: $site_name <no-reply@vitalkraft.com>\r\n";
    $headers .= "Reply-To: $email\r\n";
    $headers .= "MIME-Version: 1.0\r\n";
    $headers .= "Content-Type: text/html; charset=UTF-8\r\n";
    
    $fallback_sent = mail($recipient_email, $subject, $message, $headers);
    
    $log_message = date('Y-m-d H:i:s') . " | FALLBACK | Form: $form_type | Sent: " . ($fallback_sent ? 'Yes' : 'No') . "\n";
    file_put_contents($log_file, $log_message, FILE_APPEND);
}

// Всегда перенаправляем на страницу благодарности, даже если отправка не удалась
header('Location: danke.html');
exit;
?> 