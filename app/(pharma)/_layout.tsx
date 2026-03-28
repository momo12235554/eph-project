import { Stack } from 'expo-router';

export default function PharmaLayout() {
  return (
    <Stack>
      <Stack.Screen name="sc_phrm" options={{ headerShown: false }} />
    </Stack>
  );
}
