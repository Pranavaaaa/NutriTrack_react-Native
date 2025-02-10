import { Stack } from 'expo-router';
import { useSelector } from 'react-redux';
import { Redirect } from 'expo-router';
import { RootState } from '../../redux/store';

export default function AuthLayout() {
  const token = useSelector((state: RootState) => state.auth.token);

  // If authenticated, redirect to main app
  if (token) {
    return <Redirect href="/(tabs)" />;
  }

  return (
    <Stack>
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="register" options={{ headerShown: false }} />
    </Stack>
  );
}