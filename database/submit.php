<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: *');
header('Access-Control-Allow-Headers: *');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $submissionTime = $_POST['submissionTime'];
    $elapsedTime = $_POST['elapsedTime'];

    $accuracyString = $_POST['accuracy'];
    $accuracy = (float) rtrim($accuracyString, '%');

    echo "Submission Time: $submissionTime\n";
    echo "Elapsed Time: $elapsedTime\n";
    echo "Accuracy: $accuracy\n";

    insertIntoDatabase($submissionTime, $elapsedTime, $accuracy);
} else {
    echo "Invalid request method.";
}

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

    $accuracy = $accuracy / 100;
    $elapsedTime = gmdate("H:i:s", $elapsedTime / 1000);

    $sql = "INSERT INTO demo_table (used_time, accuracy) VALUES ('$elapsedTime', $accuracy)";
    if ($conn->query($sql) === TRUE) {
        $lastInsertedId = $conn->insert_id;
        echo "Data inserted successfully. Inserted ID: $lastInsertedId. Used Time: $elapsedTime, Accuracy: $accuracy";
    } else {
        die("Error inserting data: " . $conn->error);
    }

    $conn->close();
}
