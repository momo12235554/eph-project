<?php
header("Content-Type: application/json; charset=utf-8");

$host = 'localhost';
$db_name = 'eph_db';
$username = 'root';
$password = '';

try {
    $conn = new PDO("mysql:host=$host;dbname=$db_name;charset=utf8", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Vider la table pour éviter les doublons lors du test
    $conn->exec("DELETE FROM medicaments");

    $sql = "INSERT INTO medicaments (nom, code, lot, prix, quantite, date_expiration, categorie) VALUES 
    ('Paracétamol 500mg', 'PARA-001', 'LOT2024001', 5.50, 8, '2025-06-15', 'Analgésique'),
    ('Amoxicilline 1g', 'AMOX-002', 'LOT2024002', 12.00, 45, '2025-08-20', 'Antibiotique'),
    ('Ibuprofène 400mg', 'IBU-003', 'LOT2024003', 8.50, 120, '2026-01-10', 'Anti-inflammatoire'),
    ('Spasfon', 'SPAS-004', 'LOT2024004', 6.20, 15, '2025-10-05', 'Antispasmodique'),
    ('Aspirine 100mg', 'ASP-005', 'LOT2024005', 4.00, 200, '2026-03-25', 'Antipyrétique')";

    $conn->exec($sql);

    echo json_encode(["status" => "success", "message" => "Base de données remplie avec 5 médicaments de test !"]);

}
catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => "Connection failed: " . $e->getMessage()]);
}
?>
