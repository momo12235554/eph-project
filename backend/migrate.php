<?php
$host = 'localhost';
$db_name = 'eph_db';
$username = 'root';
$password = '';

try {
    $conn = new PDO("mysql:host=$host;dbname=$db_name;charset=utf8", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // 1. Table Historique
    $sql_hist = "CREATE TABLE IF NOT EXISTS historique (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        action VARCHAR(100) NOT NULL,
        details TEXT,
        date_action TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4";
    $conn->exec($sql_hist);
    echo "Table 'historique' créée ou déjà existante.\n";

    // 2. Table Notifications
    $sql_notif = "CREATE TABLE IF NOT EXISTS notifications (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        medicament_id INT,
        message TEXT NOT NULL,
        type VARCHAR(50) DEFAULT 'signalement',
        lu BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
        FOREIGN KEY (medicament_id) REFERENCES medicaments(id) ON DELETE SET NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4";
    $conn->exec($sql_notif);
    echo "Table 'notifications' créée ou déjà existante.\n";

}
catch (PDOException $e) {
    echo "Erreur : " . $e->getMessage();
}
?>
