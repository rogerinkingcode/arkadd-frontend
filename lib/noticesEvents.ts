/**
 * O sino carrega os avisos uma vez, ao montar o layout. Telas que mudam o que o sino deve mostrar
 * (ex.: salvar as credenciais apaga o aviso de chaves faltando) disparam este evento para ele
 * recarregar na hora, sem esperar a próxima navegação completa.
 */
export const NOTICES_REFRESH_EVENT = "apex:notices-refresh";

export const refreshNotices = () => {
    if (typeof window !== "undefined") window.dispatchEvent(new Event(NOTICES_REFRESH_EVENT));
};

/** Assunto do aviso de credenciais incompletas (o backend o mantém enquanto faltar chave). */
export const CREDENTIALS_NOTICE_SUBJECT = "credentials";

/** Assunto do aviso de chave do Vertex AI Search recusada (expirada ou inválida) — também leva a Credenciais. */
export const VERTEX_CREDENTIAL_NOTICE_SUBJECT = "vertex-credential";
