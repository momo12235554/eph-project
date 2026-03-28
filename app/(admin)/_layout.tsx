import { Stack } from 'expo-router';

export default function AdminLayout() {
  return (
    <Stack>
      <Stack.Screen name="admin" options={{ headerShown: false }} />
      <Stack.Screen name="ordonnances_page" options={{ title: 'Ordonnances' }} />
      <Stack.Screen name="alertes_page" options={{ title: 'Alertes' }} />
      <Stack.Screen name="gs_medicament" options={{ title: 'Gestion Médicaments' }} />
      <Stack.Screen name="gs_ordonnance" options={{ title: 'Gestion Ordonnances' }} />
    </Stack>
  );
}
