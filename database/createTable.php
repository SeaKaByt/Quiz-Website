<?php
$server = 'localhost';
$dbuser = 'root';
$dbpassword = '';
$dbname = 'demo';

$conn = new mysqli($server, $dbuser, $dbpassword, $dbname);
if ($conn->connect_error) {
    die('Database connection failed' . $conn->connect_error);
}

$sql = "CREATE TABLE demo_table(
    ID INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    used_time TIME NOT NUll,
    accuracy DECIMAL(3,2) NOT NUll,
    submitted_DataTime TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    )";

if ($conn->query($sql) === TRUE) {
    echo "Table demo_table created successfully";
} else {
    die("Error creating table: " . $conn->error);
}

$conn->close();
