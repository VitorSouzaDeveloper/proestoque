import { Redirect } from 'expo-router';

// Redireciona sempre para a tela de login ao iniciar o app
export default function Index() {
      return <Redirect href="/(auth)/login" />;
    //return <Redirect href="/(tabs)" />;
}

