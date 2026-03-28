<?php
header('Content-Type: application/json; charset=utf-8');

$host = 'localhost';
$username = 'root';
$password = '';

try {
    // Connexion sans spécifier de base de données
    $pdo = new PDO("mysql:host=$host;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Lire le fichier SQL
    $sql = file_get_contents(__DIR__ . '/database.sql');
    
    // Exécuter le SQL
    $pdo->exec($sql);

    echo json_encode([
        'success' => true,
        'message' => 'Base de données créée avec succès'
    ]);

} catch (PDOException $e) {
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
?>
