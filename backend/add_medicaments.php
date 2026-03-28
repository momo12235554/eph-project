<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

$host = 'localhost';
$username = 'root';
$password = '';

// Essayons de trouver la bonne base de données
$possible_dbs = ['eph_db', 'utfmb4_0900_ai_ci', 'mudistock', 'ascg'];

$pdo = null;
$dbname = null;

foreach ($possible_dbs as $db) {
    try {
        $test_pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8", $username, $password);
        $test_pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        
        // Vérifier si la table medicaments existe
        $result = $test_pdo->query("SHOW TABLES LIKE 'medicaments'");
        if ($result->rowCount() > 0) {
            $pdo = $test_pdo;
            $dbname = $db;
            break;
        }
    } catch (PDOException $e) {
        continue;
    }
}

if (!$pdo) {
    echo json_encode([
        'success' => false,
        'error' => 'Aucune base de données avec une table medicaments trouvée. Veuillez créer la table medicaments d\'abord.'
    ]);
    exit;
}

try {
    // Liste de 50 médicaments réalistes
    $medicaments = [
        ['nom' => 'Paracétamol 500mg', 'lot' => 'LOT2024001', 'quantite' => 8, 'date_expiration' => '2025-06-15', 'categorie' => 'Antalgique'],
        ['nom' => 'Amoxicilline 1g', 'lot' => 'LOT2024002', 'quantite' => 45, 'date_expiration' => '2025-08-20', 'categorie' => 'Antibiotique'],
        ['nom' => 'Ibuprofène 400mg', 'lot' => 'LOT2024003', 'quantite' => 120, 'date_expiration' => '2026-01-10', 'categorie' => 'Anti-inflammatoire'],
        ['nom' => 'Aspirine 100mg', 'lot' => 'LOT2024004', 'quantite' => 6, 'date_expiration' => '2025-05-22', 'categorie' => 'Antiagrégant'],
        ['nom' => 'Doliprane 1000mg', 'lot' => 'LOT2024005', 'quantite' => 95, 'date_expiration' => '2025-12-30', 'categorie' => 'Antalgique'],
        ['nom' => 'Azithromycine 250mg', 'lot' => 'LOT2024006', 'quantite' => 32, 'date_expiration' => '2025-09-15', 'categorie' => 'Antibiotique'],
        ['nom' => 'Oméprazole 20mg', 'lot' => 'LOT2024007', 'quantite' => 78, 'date_expiration' => '2026-03-10', 'categorie' => 'Anti-ulcéreux'],
        ['nom' => 'Metformine 850mg', 'lot' => 'LOT2024008', 'quantite' => 150, 'date_expiration' => '2026-07-25', 'categorie' => 'Antidiabétique'],
        ['nom' => 'Atorvastatine 20mg', 'lot' => 'LOT2024009', 'quantite' => 88, 'date_expiration' => '2025-11-18', 'categorie' => 'Hypolipémiant'],
        ['nom' => 'Losartan 50mg', 'lot' => 'LOT2024010', 'quantite' => 5, 'date_expiration' => '2025-04-30', 'categorie' => 'Antihypertenseur'],
        ['nom' => 'Amlodipine 5mg', 'lot' => 'LOT2024011', 'quantite' => 110, 'date_expiration' => '2026-02-14', 'categorie' => 'Antihypertenseur'],
        ['nom' => 'Clopidogrel 75mg', 'lot' => 'LOT2024012', 'quantite' => 64, 'date_expiration' => '2025-10-08', 'categorie' => 'Antiagrégant'],
        ['nom' => 'Levothyroxine 100mcg', 'lot' => 'LOT2024013', 'quantite' => 92, 'date_expiration' => '2026-05-20', 'categorie' => 'Hormone thyroïdienne'],
        ['nom' => 'Tramadol 50mg', 'lot' => 'LOT2024014', 'quantite' => 7, 'date_expiration' => '2025-07-12', 'categorie' => 'Antalgique opioïde'],
        ['nom' => 'Ciprofloxacine 500mg', 'lot' => 'LOT2024015', 'quantite' => 41, 'date_expiration' => '2025-09-28', 'categorie' => 'Antibiotique'],
        ['nom' => 'Prednisolone 20mg', 'lot' => 'LOT2024016', 'quantite' => 55, 'date_expiration' => '2026-01-05', 'categorie' => 'Corticoïde'],
        ['nom' => 'Salbutamol 100mcg', 'lot' => 'LOT2024017', 'quantite' => 73, 'date_expiration' => '2025-12-15', 'categorie' => 'Bronchodilatateur'],
        ['nom' => 'Lorazépam 1mg', 'lot' => 'LOT2024018', 'quantite' => 28, 'date_expiration' => '2025-08-30', 'categorie' => 'Anxiolytique'],
        ['nom' => 'Sertraline 50mg', 'lot' => 'LOT2024019', 'quantite' => 9, 'date_expiration' => '2025-06-22', 'categorie' => 'Antidépresseur'],
        ['nom' => 'Furosémide 40mg', 'lot' => 'LOT2024020', 'quantite' => 67, 'date_expiration' => '2026-04-18', 'categorie' => 'Diurétique'],
        ['nom' => 'Ranitidine 150mg', 'lot' => 'LOT2024021', 'quantite' => 84, 'date_expiration' => '2025-11-25', 'categorie' => 'Anti-ulcéreux'],
        ['nom' => 'Cétirizine 10mg', 'lot' => 'LOT2024022', 'quantite' => 135, 'date_expiration' => '2026-06-30', 'categorie' => 'Antihistaminique'],
        ['nom' => 'Diclofénac 50mg', 'lot' => 'LOT2024023', 'quantite' => 4, 'date_expiration' => '2025-05-10', 'categorie' => 'Anti-inflammatoire'],
        ['nom' => 'Warfarine 5mg', 'lot' => 'LOT2024024', 'quantite' => 52, 'date_expiration' => '2025-10-20', 'categorie' => 'Anticoagulant'],
        ['nom' => 'Insuline Glargine', 'lot' => 'LOT2024025', 'quantite' => 18, 'date_expiration' => '2025-07-05', 'categorie' => 'Antidiabétique'],
        ['nom' => 'Enalapril 10mg', 'lot' => 'LOT2024026', 'quantite' => 98, 'date_expiration' => '2026-02-28', 'categorie' => 'Antihypertenseur'],
        ['nom' => 'Bisoprolol 5mg', 'lot' => 'LOT2024027', 'quantite' => 76, 'date_expiration' => '2025-12-08', 'categorie' => 'Bêta-bloquant'],
        ['nom' => 'Morphine 10mg', 'lot' => 'LOT2024028', 'quantite' => 3, 'date_expiration' => '2025-04-15', 'categorie' => 'Antalgique opioïde'],
        ['nom' => 'Codéine 30mg', 'lot' => 'LOT2024029', 'quantite' => 58, 'date_expiration' => '2025-09-12', 'categorie' => 'Antalgique opioïde'],
        ['nom' => 'Doxycycline 100mg', 'lot' => 'LOT2024030', 'quantite' => 89, 'date_expiration' => '2026-03-22', 'categorie' => 'Antibiotique'],
        ['nom' => 'Clarithromycine 500mg', 'lot' => 'LOT2024031', 'quantite' => 44, 'date_expiration' => '2025-11-10', 'categorie' => 'Antibiotique'],
        ['nom' => 'Pantoprazole 40mg', 'lot' => 'LOT2024032', 'quantite' => 102, 'date_expiration' => '2026-05-15', 'categorie' => 'Anti-ulcéreux'],
        ['nom' => 'Simvastatine 20mg', 'lot' => 'LOT2024033', 'quantite' => 71, 'date_expiration' => '2025-10-30', 'categorie' => 'Hypolipémiant'],
        ['nom' => 'Allopurinol 100mg', 'lot' => 'LOT2024034', 'quantite' => 8, 'date_expiration' => '2025-06-18', 'categorie' => 'Antigouteux'],
        ['nom' => 'Spironolactone 25mg', 'lot' => 'LOT2024035', 'quantite' => 63, 'date_expiration' => '2026-01-28', 'categorie' => 'Diurétique'],
        ['nom' => 'Fluoxétine 20mg', 'lot' => 'LOT2024036', 'quantite' => 95, 'date_expiration' => '2025-12-20', 'categorie' => 'Antidépresseur'],
        ['nom' => 'Alprazolam 0.5mg', 'lot' => 'LOT2024037', 'quantite' => 37, 'date_expiration' => '2025-08-15', 'categorie' => 'Anxiolytique'],
        ['nom' => 'Clonazépam 2mg', 'lot' => 'LOT2024038', 'quantite' => 6, 'date_expiration' => '2025-05-28', 'categorie' => 'Antiépileptique'],
        ['nom' => 'Gabapentine 300mg', 'lot' => 'LOT2024039', 'quantite' => 81, 'date_expiration' => '2026-04-10', 'categorie' => 'Antiépileptique'],
        ['nom' => 'Lévétiracétam 500mg', 'lot' => 'LOT2024040', 'quantite' => 54, 'date_expiration' => '2025-11-05', 'categorie' => 'Antiépileptique'],
        ['nom' => 'Montelukast 10mg', 'lot' => 'LOT2024041', 'quantite' => 118, 'date_expiration' => '2026-07-12', 'categorie' => 'Antiasthmatique'],
        ['nom' => 'Budesonide 200mcg', 'lot' => 'LOT2024042', 'quantite' => 69, 'date_expiration' => '2025-10-18', 'categorie' => 'Corticoïde inhalé'],
        ['nom' => 'Hydroxyzine 25mg', 'lot' => 'LOT2024043', 'quantite' => 5, 'date_expiration' => '2025-04-25', 'categorie' => 'Antihistaminique'],
        ['nom' => 'Mirtazapine 15mg', 'lot' => 'LOT2024044', 'quantite' => 47, 'date_expiration' => '2025-09-08', 'categorie' => 'Antidépresseur'],
        ['nom' => 'Venlafaxine 75mg', 'lot' => 'LOT2024045', 'quantite' => 92, 'date_expiration' => '2026-02-15', 'categorie' => 'Antidépresseur'],
        ['nom' => 'Colchicine 1mg', 'lot' => 'LOT2024046', 'quantite' => 33, 'date_expiration' => '2025-07-30', 'categorie' => 'Antigouteux'],
        ['nom' => 'Digoxine 0.25mg', 'lot' => 'LOT2024047', 'quantite' => 9, 'date_expiration' => '2025-06-05', 'categorie' => 'Cardiotonique'],
        ['nom' => 'Isosorbide 20mg', 'lot' => 'LOT2024048', 'quantite' => 76, 'date_expiration' => '2026-03-18', 'categorie' => 'Vasodilatateur'],
        ['nom' => 'Nitroglycérine 0.5mg', 'lot' => 'LOT2024049', 'quantite' => 61, 'date_expiration' => '2025-11-28', 'categorie' => 'Vasodilatateur'],
        ['nom' => 'Héparine 5000UI', 'lot' => 'LOT2024050', 'quantite' => 7, 'date_expiration' => '2025-05-12', 'categorie' => 'Anticoagulant'],
    ];

    $stmt = $pdo->prepare("INSERT INTO medicaments (nom, lot, quantite, date_expiration, categorie) VALUES (?, ?, ?, ?, ?)");

    $count = 0;
    foreach ($medicaments as $med) {
        $stmt->execute([
            $med['nom'],
            $med['lot'],
            $med['quantite'],
            $med['date_expiration'],
            $med['categorie']
        ]);
        $count++;
    }

    echo json_encode([
        'success' => true,
        'message' => "$count médicaments ajoutés avec succès dans la base '$dbname'",
        'database' => $dbname,
        'count' => $count
    ]);

} catch (PDOException $e) {
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
?>
