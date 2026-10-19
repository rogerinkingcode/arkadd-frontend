/**
 * Conversa entre a janela de autorização do Instagram e a tela do Instagram que a abriu.
 *
 * Por que `BroadcastChannel`, e não `window.opener.postMessage`: a janela passa pelo
 * instagram.com, e o isolamento entre sites (COOP) corta o vínculo com a janela que a abriu —
 * na volta, `window.opener` é `null`. O canal liga quaisquer janelas da mesma origem, com ou sem
 * esse vínculo.
 *
 * O protocolo é de duas mensagens: a janela de retorno anuncia o resultado e a tela principal
 * confirma o recebimento. Sem confirmação (aba fechada, fluxo sem pop-up), a janela de retorno
 * segue sozinha para a tela do Instagram, como antes.
 */

export const INSTAGRAM_AUTH_CHANNEL = "apex-instagram-auth";

/** Nome da janela de autorização — abrir de novo com o mesmo nome reaproveita a janela, quando dá. */
export const INSTAGRAM_AUTH_WINDOW = "apex-instagram-auth-window";

export type InstagramAuthResult = { type: "result"; ok: true; accountId: string; username: string; clientId: string; clientName: string } | { type: "result"; ok: false; message: string };

type InstagramAuthMessage = InstagramAuthResult | { type: "ack" };

/** Quanto a janela de retorno espera a confirmação da tela principal antes de seguir sozinha. */
const ACK_TIMEOUT_MS = 1200;

const channelAvailable = () => typeof window !== "undefined" && "BroadcastChannel" in window;

/**
 * Lado da janela de retorno: anuncia o resultado e diz se alguma tela o recebeu.
 * `true` = a tela principal assumiu (esta janela pode fechar); `false` = ninguém ouvindo.
 */
export function announceInstagramAuthResult(result: InstagramAuthResult): Promise<boolean> {
    if (!channelAvailable()) return Promise.resolve(false);

    return new Promise((resolve) => {
        const channel = new BroadcastChannel(INSTAGRAM_AUTH_CHANNEL);

        const finish = (received: boolean) => {
            clearTimeout(timer);
            channel.close();
            resolve(received);
        };

        const timer = setTimeout(() => finish(false), ACK_TIMEOUT_MS);

        channel.onmessage = (event: MessageEvent<InstagramAuthMessage>) => {
            if (event.data?.type === "ack") finish(true);
        };

        channel.postMessage(result);
    });
}

/** Lado da tela principal: recebe o resultado (e confirma). Devolve a função que para de ouvir. */
export function listenInstagramAuthResult(onResult: (result: InstagramAuthResult) => void): () => void {
    if (!channelAvailable()) return () => undefined;

    const channel = new BroadcastChannel(INSTAGRAM_AUTH_CHANNEL);

    channel.onmessage = (event: MessageEvent<InstagramAuthMessage>) => {
        if (event.data?.type !== "result") return;

        channel.postMessage({ type: "ack" } satisfies InstagramAuthMessage);
        onResult(event.data);
    };

    return () => channel.close();
}

/** Janela centralizada, no tamanho da tela de login e permissão do Instagram. */
export function popupFeatures(width = 520, height = 760) {
    const left = Math.max(0, Math.round(window.screenX + (window.outerWidth - width) / 2));
    const top = Math.max(0, Math.round(window.screenY + (window.outerHeight - height) / 2));

    return `popup=yes,width=${width},height=${height},left=${left},top=${top}`;
}
