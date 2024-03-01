<?php
// 允許所有來源的跨源請求
header('Access-Control-Allow-Origin: *');//支持全域名访问
header('Access-Control-Allow-Methods: *');//支持的http动作
header('Access-Control-Allow-Headers: *');//响应头

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // 獲取 JavaScript 發送的數據
    $submissionTime = $_POST['submissionTime'];
    $elapsedTime = $_POST['elapsedTime'];

    // 處理 accuracy 字符串，將百分比轉換為數字
    $accuracyString = $_POST['accuracy'];
    $accuracy = (float) rtrim($accuracyString, '%');

    // 在這裡可以進行一些驗證或處理

    // 打印收到的數據
    echo "Submission Time: $submissionTime\n";
    echo "Elapsed Time: $elapsedTime\n";
    echo "Accuracy: $accuracy\n";

    // 在這裡插入到數據庫
    insertIntoDatabase($submissionTime, $elapsedTime, $accuracy);
} else {
    echo "Invalid request method.";
}

// 將數據插入到數據庫的函數，你需要實現這個函數
function insertIntoDatabase($submissionTime, $elapsedTime, $accuracy)
{
    $server = 'localhost';
    $dbuser = 'root';
    $dbpassword = '';
    $dbname = 'demo';

    $conn = new mysqli($server, $dbuser, $dbpassword, $dbname);
    if ($conn->connect_error) {
        die('Database connection failed' . $conn->connect_error);
    }

    // 將 accuracy 轉換為合適的小數格式
    $accuracy = $accuracy / 100;

    // 將毫秒轉換為時間格式
    $elapsedTime = gmdate("H:i:s", $elapsedTime / 1000);

    // 插入數據
    $sql = "INSERT INTO demo_table (used_time, accuracy) VALUES ('$elapsedTime', $accuracy)";
    if ($conn->query($sql) === TRUE) {
        $lastInsertedId = $conn->insert_id;
        echo "Data inserted successfully. Inserted ID: $lastInsertedId. Used Time: $elapsedTime, Accuracy: $accuracy";
    } else {
        die("Error inserting data: " . $conn->error);
    }

    $conn->close();
}
