import { Stack } from 'expo-router';

export default function FournisseurLayout() {
  return (
    <Stack>
      <Stack.Screen name="fournisseur" options={{ title: 'Espace Fournisseur' }} />
    </Stack>
  );
}
