<?php
error_reporting(E_ALL);
ini_set('display_errors', 0);
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

$host = 'localhost';
$db_name = 'eph_db';
$username = 'root';
$password = '';

try {
    $conn = new PDO("mysql:host=$host;dbname=$db_name;charset=utf8", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
}
catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => "Connection failed: " . $e->getMessage()]);
    exit();
}

// Helper to record history
function logAction($conn, $userId, $action, $details = "")
{
    try {
        $stmt = $conn->prepare("INSERT INTO historique (user_id, action, details) VALUES (:uid, :act, :det)");
        $stmt->execute([':uid' => $userId, ':act' => $action, ':det' => $details]);
    }
    catch (Exception $e) {
    // Silent fail for logs
    }
}

// Simplified function to check alerts logic (e.g. after stock update)
function checkAlerts($conn, $medicamentId)
{
    $stmt = $conn->prepare("SELECT quantite, nom FROM medicaments WHERE id = ?");
    $stmt->execute([$medicamentId]);
    $med = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($med && $med['quantite'] < 20) {
        // Create alert if not exists active
        $check = $conn->prepare("SELECT id FROM alertes WHERE medicament_id = ? AND statut = 'active' AND type = 'stock_bas'");
        $check->execute([$medicamentId]);
        if (!$check->fetch()) {
            $insert = $conn->prepare("INSERT INTO alertes (medicament_id, type, titre, message, priorite) VALUES (?, 'stock_bas', 'Stock critique', ?, 'haute')");
            $insert->execute([$medicamentId, "Stock faible pour " . $med['nom'] . " (" . $med['quantite'] . " restants)"]);
        }
    }
}

$method = $_SERVER['REQUEST_METHOD'];
$type = isset($_GET['type']) ? $_GET['type'] : '';
$data = json_decode(file_get_contents("php://input"), true);

// --- ROUTING --- //

if ($type == 'medicaments') {
    if ($method == 'GET') {
        $stmt = $conn->prepare("SELECT * FROM medicaments ORDER BY nom ASC");
        $stmt->execute();
        echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
    }
    elseif ($method == 'POST') {
        try {
            $sql = "INSERT INTO medicaments (nom, code, code_barre, lot, prix, quantite, date_expiration, categorie) 
                    VALUES (:nom, :code, :code_barre, :lot, :prix, :qty, :dateExp, :categorie)";
            $stmt = $conn->prepare($sql);
            $stmt->execute([
                ':nom' => $data['nom'],
                ':code' => $data['code'] ?? null,
                ':code_barre' => $data['codeBarre'] ?? null,
                ':lot' => $data['lot'],
                ':prix' => $data['prix'] ?? 0,
                ':qty' => $data['quantite'] ?? 0,
                ':dateExp' => $data['date_expiration'],
                ':categorie' => $data['categorie'] ?? NULL
            ]);
            $id = $conn->lastInsertId();
            checkAlerts($conn, $id);
            echo json_encode(['success' => true, 'id' => $id, 'message' => 'Médicament ajouté']);
        }
        catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['success' => false, 'error' => $e->getMessage()]);
        }
    }
    elseif ($method == 'PUT') {
        // Simple update for quantity only
        if (isset($data['id']) && isset($data['quantite']) && !isset($data['nom'])) {
            $sql = "UPDATE medicaments SET quantite = :qty WHERE id = :id";
            $stmt = $conn->prepare($sql);
            $stmt->execute([':id' => $data['id'], ':qty' => $data['quantite']]);
            checkAlerts($conn, $data['id']);
            echo json_encode(['success' => true, 'message' => 'Quantité mise à jour']);
        }
        else {
            // Full update
            $sql = "UPDATE medicaments SET nom=:nom, code=:code, code_barre=:code_barre, lot=:lot, prix=:prix, quantite=:qty, date_expiration=:dateExp, categorie=:categorie WHERE id=:id";
            $stmt = $conn->prepare($sql);
            $stmt->execute([
                ':id' => $data['id'],
                ':nom' => $data['nom'],
                ':code' => $data['code'] ?? null,
                ':code_barre' => $data['codeBarre'] ?? null,
                ':lot' => $data['lot'],
                ':prix' => $data['prix'] ?? 0,
                ':qty' => $data['quantite'] ?? 0,
                ':dateExp' => $data['date_expiration'],
                ':categorie' => $data['categorie'] ?? NULL
            ]);
            checkAlerts($conn, $data['id']);
            echo json_encode(['success' => true, 'message' => 'Médicament mis à jour']);
        }
    }
    elseif ($method == 'DELETE') {
        $stmt = $conn->prepare("DELETE FROM medicaments WHERE id = ?");
        $stmt->execute([$_GET['id']]);
        echo json_encode(['success' => true, 'message' => 'Médicament supprimé']);
    }
}

elseif ($type == 'fournisseurs') {
    if ($method == 'GET') {
        echo json_encode($conn->query("SELECT * FROM fournisseurs")->fetchAll(PDO::FETCH_ASSOC));
    }
    elseif ($method == 'POST') {
        $stmt = $conn->prepare("INSERT INTO fournisseurs (nom, contact_personne, email, telephone, adresse) VALUES (?, ?, ?, ?, ?)");
        $stmt->execute([$data['nom'], $data['contact_personne'], $data['email'], $data['telephone'], $data['adresse']]);
        echo json_encode(["id" => $conn->lastInsertId(), "message" => "Fournisseur added"]);
    }
}

elseif ($type == 'users') {
    if ($method == 'GET') {
        $role = isset($_GET['role']) ? $_GET['role'] : null;
        if ($role) {
            $stmt = $conn->prepare("SELECT id, username, nom, prenom, role, email FROM users WHERE role = ?");
            $stmt->execute([$role]);
        }
        else {
            $stmt = $conn->query("SELECT id, username, nom, prenom, role, email FROM users");
        }
        echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
    }
    elseif ($method == 'POST') { // Create user (Admin/Pharm)
        $stmt = $conn->prepare("INSERT INTO users (username, password, nom, prenom, email, telephone, role) VALUES (?, ?, ?, ?, ?, ?, ?)");
        // Note: Password should be hashed in production
        $stmt->execute([$data['username'], $data['password'], $data['nom'], $data['prenom'], $data['email'], $data['telephone'], $data['role']]);
        echo json_encode(["id" => $conn->lastInsertId(), "message" => "User created"]);
    }
}

elseif ($type == 'alertes') {
    if ($method == 'GET') {
        echo json_encode($conn->query("SELECT a.*, m.nom as medicament_nom FROM alertes a JOIN medicaments m ON a.medicament_id = m.id WHERE statut = 'active'")->fetchAll(PDO::FETCH_ASSOC));
    }
    elseif ($method == 'PUT') { // Resolve alert
        $stmt = $conn->prepare("UPDATE alertes SET statut = 'resolue' WHERE id = ?");
        $stmt->execute([$data['id']]);
        echo json_encode(["message" => "Alerte résolue"]);
    }
}

elseif ($type == 'ordonnances') {
    if ($method == 'GET') {
        $sql = "SELECT o.*, u.username as pharmacien_nom 
                FROM ordonnances o 
                LEFT JOIN users u ON o.pharmacien_id = u.id 
                ORDER BY o.created_at DESC";
        $ords = $conn->query($sql)->fetchAll(PDO::FETCH_ASSOC);

        // Fetch lines for each ordonnance
        foreach ($ords as &$ord) {
            $stmt = $conn->prepare("SELECT ol.*, m.nom as medicament_nom 
                                   FROM ordonnance_lignes ol 
                                   JOIN medicaments m ON ol.medicament_id = m.id 
                                   WHERE ol.ordonnance_id = ?");
            $stmt->execute([$ord['id']]);
            $ord['lignes'] = $stmt->fetchAll(PDO::FETCH_ASSOC);
        }
        echo json_encode($ords);
    }
    elseif ($method == 'POST') {
        try {
            $conn->beginTransaction();

            // 1. Create Ordonnance
            $stmt = $conn->prepare("INSERT INTO ordonnances (numero_ordonnance, patient_nom, patient_prenom, medecin_nom, date_prescription, statut, pharmacien_id) VALUES (?, ?, ?, ?, ?, 'en_attente', ?)");
            $stmt->execute([
                $data['numero_ordonnance'],
                $data['patient_nom'],
                $data['patient_prenom'] ?? '',
                $data['medecin_nom'],
                $data['date_prescription'] ?? date('Y-m-d'),
                $data['pharmacien_id'] ?? 1
            ]);
            $ordId = $conn->lastInsertId();

            // 2. Add Lines
            if (isset($data['lignes']) && is_array($data['lignes'])) {
                $lineStmt = $conn->prepare("INSERT INTO ordonnance_lignes (ordonnance_id, medicament_id, quantite, posologie) VALUES (?, ?, ?, ?)");
                foreach ($data['lignes'] as $ligne) {
                    $lineStmt->execute([
                        $ordId,
                        $ligne['medicament_id'],
                        $ligne['quantite'],
                        $ligne['posologie'] ?? ''
                    ]);
                }
            }

            $conn->commit();
            logAction($conn, $data['pharmacien_id'] ?? 1, "Création ordonnance", "Ordonnance #$ordId créée");
            echo json_encode(["success" => true, "id" => $ordId, "message" => "Ordonnance créée avec succès"]);
        }
        catch (Exception $e) {
            $conn->rollBack();
            http_response_code(500);
            echo json_encode(["success" => false, "error" => $e->getMessage()]);
        }
    }
}

elseif ($type == 'commandes') {
    if ($method == 'GET') {
        $sql = "SELECT c.*, f.nom as fournisseur_nom FROM commandes c JOIN fournisseurs f ON c.fournisseur_id = f.id ORDER BY c.date_commande DESC";
        echo json_encode($conn->query($sql)->fetchAll(PDO::FETCH_ASSOC));
    }
    elseif ($method == 'POST') {
        // 1. Create Commande
        $stmt = $conn->prepare("INSERT INTO commandes (fournisseur_id, date_commande, statut, montant_total) VALUES (?, NOW(), 'en_attente', ?)");
        $stmt->execute([$data['fournisseur_id'], $data['montant_total']]);
        $cmdId = $conn->lastInsertId();

        // 2. Add Lines
        if (isset($data['lignes']) && is_array($data['lignes'])) {
            $lineStmt = $conn->prepare("INSERT INTO ligne_commandes (commande_id, medicament_id, quantite, prix_unitaire) VALUES (?, ?, ?, ?)");
            foreach ($data['lignes'] as $ligne) {
                $lineStmt->execute([$cmdId, $ligne['medicament_id'], $ligne['quantite'], $ligne['prix_unitaire']]);
            }
        }
        logAction($conn, 1, "Création commande", "Commande #$cmdId créée");
        echo json_encode(["id" => $cmdId, "message" => "Commande créée"]);
    }
    elseif ($method == 'PUT') { // Update Status (e.g. Validate Delivery)
        if (isset($data['statut']) && $data['statut'] == 'livree') {
            // Logic for delivery validation
            $stmt = $conn->prepare("UPDATE commandes SET statut = 'livree' WHERE id = ?");
            $stmt->execute([$data['id']]);

            // Register delivery
            $recuStmt = $conn->prepare("INSERT INTO livraisons (commande_id, recu_par, commentaire) VALUES (?, ?, ?)");
            $recuStmt->execute([$data['id'], 1, $data['commentaire'] ?? 'Réception validée']); // 1 assumed current user

            // Update stocks
            // Fetch lines
            $lines = $conn->prepare("SELECT medicament_id, quantite FROM ligne_commandes WHERE commande_id = ?");
            $lines->execute([$data['id']]);
            $updateStock = $conn->prepare("UPDATE medicaments SET quantite = quantite + ? WHERE id = ?");

            while ($row = $lines->fetch(PDO::FETCH_ASSOC)) {
                $updateStock->execute([$row['quantite'], $row['medicament_id']]);
                checkAlerts($conn, $row['medicament_id']); // Re-check alerts (maybe resolve stock low)
            }
            logAction($conn, 1, "Validation livraison", "Commande #" . $data['id'] . " reçue");
            echo json_encode(["message" => "Livraison validée et stock mis à jour"]);
        }
        else {
            // Simple status update
            $stmt = $conn->prepare("UPDATE commandes SET statut = ? WHERE id = ?");
            $stmt->execute([$data['statut'], $data['id']]);
            echo json_encode(["message" => "Statut mis à jour"]);
        }
    }
}

elseif ($type == 'stats') {
    $stats = [];
    $stats['medicaments_count'] = $conn->query("SELECT COUNT(*) FROM medicaments")->fetchColumn();
    $stats['alertes_active'] = $conn->query("SELECT COUNT(*) FROM alertes WHERE statut = 'active'")->fetchColumn();
    $stats['commandes_en_attente'] = $conn->query("SELECT COUNT(*) FROM commandes WHERE statut = 'en_attente'")->fetchColumn();
    $stats['commandes_livrees'] = $conn->query("SELECT COUNT(*) FROM commandes WHERE statut = 'livree'")->fetchColumn();
    $stats['notifications_count'] = $conn->query("SELECT COUNT(*) FROM notifications WHERE lu = 0")->fetchColumn();
    $stats['users_count'] = $conn->query("SELECT COUNT(*) FROM users")->fetchColumn();
    echo json_encode($stats);
}

elseif ($type == 'notifications') {
    if ($method == 'GET') {
        echo json_encode($conn->query("SELECT n.*, m.nom as medicament_nom, u.username as expediteur FROM notifications n LEFT JOIN medicaments m ON n.medicament_id = m.id LEFT JOIN users u ON n.user_id = u.id ORDER BY n.created_at DESC")->fetchAll(PDO::FETCH_ASSOC));
    }
    elseif ($method == 'POST') {
        $stmt = $conn->prepare("INSERT INTO notifications (user_id, medicament_id, message, type) VALUES (?, ?, ?, 'signalement')");
        $stmt->execute([$data['user_id'] ?? null, $data['medicament_id'], $data['message']]);
        echo json_encode(["status" => "success", "message" => "Signalement envoyé à l'administration"]);
    }
}

elseif ($type == 'historique') {
    echo json_encode($conn->query("SELECT h.*, u.username FROM historique h LEFT JOIN users u ON h.user_id = u.id ORDER BY date_action DESC LIMIT 50")->fetchAll(PDO::FETCH_ASSOC));
}

// Default...
else {
    echo json_encode(["message" => "API endpoints: medicaments, fournisseurs, users, alertes, commandes, stats, historique"]);
}
?>
