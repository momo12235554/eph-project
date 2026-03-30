const fs = require('fs');

let code = fs.readFileSync('app/(admin)/alertes_page.jsx', 'utf8');

const fetchRegex = /const fetchAlertes = async \(\) => \{[\s\S]*?\};\n\n    const getPrioriteConfig/g;

const newFetch = `const fetchAlertes = async () => {
        try {
            const response = await apiClient.get('/alertes');
            const data = response.data.data || response.data;

            if (Array.isArray(data)) {
                const alertesAffichees = data.map(al => ({
                    ...al,
                    medicament: al.medicament ? al.medicament.nom : 'Inconnu',
                    date: new Date(al.created_at || new Date()).toLocaleString('fr-FR')
                }));
                setAlertes(alertesAffichees);
            }
            setLoading(false);
        } catch (error) {
            console.error("Erreur de chargement des alertes:", error);
            setLoading(false);
        }
    };

    const handleResoudre = async (id) => {
        try {
            await apiClient.patch(\`/alertes/\${id}/resoudre\`);
            fetchAlertes();
        } catch (error) {
            console.error(error);
            Alert.alert("Erreur", "Impossible de résoudre.");
        }
    };

    const getPrioriteConfig`;

code = code.replace(fetchRegex, newFetch);
code = code.replace(/<TouchableOpacity style=\{styles.btnActionSecondary\}>/g, '<TouchableOpacity style={styles.btnActionSecondary} onPress={() => handleResoudre(item.id)}>');

fs.writeFileSync('app/(admin)/alertes_page.jsx', code);
console.log('alertes_page replaced successfully.');
