import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
// Configura como as notificações aparecem quando o app está aberto
// "banner" = aparece como banner no topo + som
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

// ── Solicitar permissão ─────────────────────────────────────
export async function solicitarPermissaoNotificacoes(): Promise<boolean> {
  // Notificações só funcionam em dispositivos físicos (não simulador)
  if (!Device.isDevice) {
    console.warn("Notificações não funcionam no simulador");
    return false;
  }

  const { status: statusAtual } = await Notifications.getPermissionsAsync();

  if (statusAtual === "granted") return true;

  const { status: novoStatus } = await Notifications.requestPermissionsAsync();
  return novoStatus === "granted";
}

// ── Notificar Estoque Crítico ────────────────────────────────
export async function notificarEstoqueCritico(produtosCriticos: any[]) {
  const quantidade = produtosCriticos.length;
  
  if (quantidade === 0) return;

  const title = quantidade === 1 
    ? "⚠️ Estoque Crítico" 
    : `⚠️ ${quantidade} Produtos Críticos`;
    
  const body = quantidade === 1
    ? `${produtosCriticos[0].nome} está com estoque abaixo do mínimo.`
    : `Você tem ${quantidade} produtos precisando de reposição urgente!`;

  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      data: { route: '/produtos' },
    },
    trigger: null, // dispara imediatamente
  });
}

// ── Agendamento Diário (opcional da aula) ────────────────────
export async function agendarVerificacaoDiaria() {
  await Notifications.cancelAllScheduledNotificationsAsync();
  
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Verificação de Estoque",
      body: "Bom dia! Já checou seu estoque hoje?",
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: 8,
      minute: 0,
    },
  });
}
