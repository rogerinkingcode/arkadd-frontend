export interface IUser {
    id: string;
    fullName: string;
    email: string;
    avatarUrl?: string | null;
    isBlocked?: boolean;
    createdAt: string;
    notices: INotice[];
    credentials: ICredentials[];
}

export interface INotice {
    id: string;
    title: string;
    message: string;
    subject: string;
    /** `Sistema` (problema técnico) ou `Admin` (pede ação do dono). */
    recipient: string;
    createdAt: Date;
    brand: { name: string };
}

export interface IClient {
    id: string;
    email: string;
    companyName: string;
    companyRepresentative: string;
    country: string;
    isActive: boolean;
    createdAt: string;
    brand: IBrand[];
}

export interface IBrand {
    id: number;
    assetType: string;
    name: string;
    specifications: string;
    class: string;
    /** CNAEs do titular, só dígitos — o primeiro é o principal. Ao menos um, no cadastro e na edição. */
    cnaes: string[];
    logo_url?: string | null;
    productPrice: number;
    nameThreatPoints: number;
    priceThreatPoints: number;
    imageThreatPoints: number;
    domain?: string | null;
    typeOfHost: boolean;
    createdAt: string;
    client: { id: string; companyName: string; email: string; companyRepresentative: string };
    _count: { companies: number; domains: number; logoComparisons: number; marketplaces: number; socialMedia: number; trustedPartners: number };
    domains: [];
    companies: [];
    socialMedia: [];
    marketplaces: [];
    logoComparisons: [];
}

export interface ITrustedPartners {
    id: string;
    brandId: number;
    productPrice: number;
    type: string;
    category: string;
    name: string;
    partnerUrl: string | null;
    nameThreatPoints: number;
    priceThreatPoints: number;
    imageThreatPoints: number;
    platform: string;
    createdAt: string | undefined;
}

/** Ligação de uma ocorrência com uma tag que a encontrou. */
export interface IOccurrenceTag {
    tag: { id: string; term: string; source: "original" | "ai" | "manual" | string };
}

/** Situação de uma tag numa frente do rodízio de busca. */
export interface IBrandTagFrontState {
    /** `never` = ainda não chegou a vez dela nesta frente. */
    status: "active" | "exhausted" | "never";
    lastSearchedAt: string | null;
    exhaustedAt: string | null;
    searchCount: number;
}

/** `search`: pesquisadas nos marketplaces e redes sociais; `domain`: rótulos testados em cada TLD. */
export type BrandTagKind = "search" | "domain";

/**
 * Tag de um ativo (tela de tags). As de busca trazem as frentes `marketplaces` e `social`; as de
 * domínio, só `domains` — que nunca esgota, porque não há rodízio.
 */
export interface IBrandTag {
    id: string;
    term: string;
    source: "original" | "ai" | "manual" | string;
    createdAt: string;
    marketplaces?: IBrandTagFrontState;
    social?: IBrandTagFrontState;
    domains?: IBrandTagFrontState;
    /** Quantas ocorrências a tag trouxe em cada frente (todo o histórico). */
    occurrences: { marketplaces?: number; social?: number; domains?: number; companies?: number };
    /** Só nas de domínio: data do domínio mais recente que a tag encontrou (nulo = nunca encontrou). */
    lastNewAt?: string | null;
}

export interface IMarketplaces {
    id: string;
    brandId: number;
    link?: string | null;
    snippet?: string | null;
    displayLink?: string | null;
    thumbnail?: string | null;
    /** Tags que encontraram a ocorrência — só vem para o dono. */
    tags?: IOccurrenceTag[];
    /** Triagem da IA: `relevant` | `irrelevant`; nulo = ainda não triada. Só marca, nunca apaga. */
    aiRelevance?: "relevant" | "irrelevant" | null;
    aiRelevanceReason?: string | null;
    info: IMarketplaceProduct | null;
    feedbacks: IFeedbacks;
    score: number;
    logoComparisonStatus?: boolean | null;
    /** Rastreio que trouxe a ocorrência: busca por tags (`search_api`) ou pesquisa reversa de imagem (`reverse_image`). */
    origin?: "search_api" | "reverse_image" | null;
    /** País da ocorrência em ISO 3166-1 alpha-2. Nulo enquanto a dedução não resolveu. */
    country?: string | null;
    /** Como o país foi determinado: `tld` | `domain` | `url` | `ai` | `manual`. */
    countrySource?: string | null;
    verifiedThreat?: string | null;
    notified?: string | null;
    archiving?: string | null;
    countThreats?: string | null;
    source?: "marketplace" | "company" | "domain" | "social" | "logo" | null;
    createdAt: string | undefined;
    brand: IBrand;
}

export interface ISocialMedia {
    id: string;
    brandId: number;
    link?: string | null;
    snippet?: string | null;
    displayLink?: string | null;
    thumbnail?: string | null;
    /** Tags que encontraram a ocorrência — só vem para o dono. */
    tags?: IOccurrenceTag[];
    /** Triagem da IA: `relevant` | `irrelevant`; nulo = ainda não triada. Só marca, nunca apaga. */
    aiRelevance?: "relevant" | "irrelevant" | null;
    aiRelevanceReason?: string | null;
    logoComparisonStatus?: boolean | null;
    /** País da ocorrência em ISO 3166-1 alpha-2. Nulo enquanto a dedução não resolveu. */
    country?: string | null;
    /** Como o país foi determinado: `tld` | `domain` | `url` | `ai` | `manual`. */
    countrySource?: string | null;
    verifiedThreat?: string | null;
    notified?: string | null;
    archiving?: string | null;
    countThreats?: string | null;
    source?: "marketplace" | "company" | "domain" | "social" | "logo" | null;
    createdAt: string | undefined;
    brand: IBrand;
}

export interface IDomains {
    id: string;
    brandId: number;
    domain: string | null;
    status: boolean | null;
    details: IDomainWhoisInfo | null;
    /** Tags de domínio que encontraram o domínio — só vem para o dono. */
    tags?: IOccurrenceTag[];
    verifiedThreat?: string | null;
    notified?: string | null;
    archiving?: string | null;
    countThreats?: string | null;
    source?: "marketplace" | "company" | "domain" | "social" | "logo" | null;
    createdAt: string | undefined;
    brand: IBrand;
}

export interface ICompanies {
    id: string;
    brandId: number;
    cnpj: string | null;
    data: ICompaniesInfoData | null;
    /** Tags de busca que trouxeram a empresa — só vem para o dono. */
    tags?: IOccurrenceTag[];
    /** Atividades da empresa: a principal (`main`) e as secundárias. */
    cnaes?: { cnae: string; main: boolean }[];
    verifiedThreat?: string | null;
    notified?: string | null;
    archiving?: string | null;
    countThreats?: string | null;
    source?: "marketplace" | "company" | "domain" | "social" | "logo" | null;
    createdAt: string | undefined;
    brand: IBrand;
}

export interface ILogoComparisons {
    id: string;
    brandId: number;
    sourceLink: string;
    about: string;
    logo_url: string;
    occurrence_url: string;
    verifiedThreat?: string | null;
    notified?: string | null;
    archiving?: string | null;
    countThreats?: string | null;
    source?: "marketplace" | "company" | "domain" | "social" | "logo" | null;
    createdAt: string | undefined;
    brand: IBrand;
}

export interface IDomainWhoisInfo {
    domain_name: string;
    registry_domain_id: string;
    registrar_whois_server: string;
    registrar_url: string;
    updated_date: string;
    creation_date: string;
    expiration_date: string;
    registrar: string;
    registrar_abuse_contact_email: string;
    registrar_abuse_contact_phone: string;
    registrant_organization: string;
}

export interface ICompaniesInfoData {
    taxId: string;
    emails: EmailInfo[];
    phones: PhoneInfo[];
    status: {
        text: string;
    };
    address: AddressInfo;
    company: CompanyInfo;
    founded: string; // "2017-08-25"
    updated: string; // ISO date
    statusDate: string; // "2017-08-25"
    mainActivity: ActivityInfo;
    sideActivities: ActivityInfo[];
}

interface Reviews {
    count: number;
    rating: number;
}

export interface IMarketplaceProduct {
    title: string;
    price: number;
    description: string;
    seller: string;
    sellerSales: number;
    reviews: Reviews;
    platform: string;
    itemId: string;
    productId: string;
    imageUrl: string;
}

interface EmailInfo {
    address: string;
    ownership: string; // "PERSONAL", etc.
}

interface PhoneInfo {
    area: string; // "21"
    type: string; // "MOBILE"
    number: string; // "97450514"
}

interface AddressInfo {
    zip: string;
    city: string;
    state: string;
    number: string;
    street: string;
    details: string;
    district: string;
    municipality: number;
    country: {
        name: string;
    };
}

interface CompanyInfo {
    id: number;
    name: string;
    equity: number;
    size: {
        text: string;
        acronym: string;
    };
    nature: {
        text: string;
    };
}

interface ActivityInfo {
    id: number;
    text: string;
}

export interface WorkflowRoutine {
    key: "domains" | "companies" | "logoComparisons";
    count: number;
    days: number[];
    /** Roda todo dia, ignorando `days` — opção dos domínios, cuja consulta (DNS) é gratuita. */
    daily?: boolean;
}

interface ICredentials {
    id: string;
    userId: string;
    apiKeyGroq: string;
    apiKeyCnpja: string;
    /** Vertex AI Search — substitui a Custom Search API nas buscas de marketplaces e redes sociais. */
    apiKeyVertexSearch: string | null;
    /** Google Vision — busca de cópias do Instagram e das Imagens na web. */
    apiKeyGoogleVision: string | null;
    /** Projeto do Google Cloud onde ficam os apps do Vertex AI Search. */
    vertexProjectId: string | null;
    /** JSON da conta de serviço do Gemini (Vertex AI) — comparação de logos. */
    geminiServiceAccount: string | null;
    /** IA das tarefas de texto (termos, triagem, país) — a comparação de logos é sempre do Gemini. */
    textAiProvider: "groq" | "gemini";
    socialMediaMonitorId: string;
    marketplacesMonitorId: string;
    createdAt: string;
}

interface IFeedbacks {
    priceFeedback: string;
    partnerFeedback: string;
    imageFeedback: string;
}

export interface ISiteScrape {
    id: string;
    domain: string;
    status: "pending" | "extracting_pages" | "extracting_images" | "completed" | "failed";
    pagesCount: number;
    imagesCount: number;
    errorMessage?: string | null;
    startedAt?: string | null;
    finishedAt?: string | null;
    createdAt: string;
    brand: { id: number; name: string; logo_url?: string | null } | null;
}

export interface ISiteImage {
    id: string;
    url: string;
    alt: string | null;
    manual: boolean;
    searched: "pending" | "processing" | "completed";
    searchedAt: string | null;
    /** Quantas pesquisas já foram concluídas nesta imagem (a busca se repete a cada 30 dias). */
    searchCount: number;
    /** Ocorrências inéditas trazidas pela última pesquisa. */
    lastNewCount: number;
    createdAt: string;
    siteScrape: { id: string; domain: string; brand: { id: number; name: string } | null };
    sitePage: { id: string; url: string } | null;
    occurrencesCount?: number;
}

/** Imagem de origem exibida no topo da página de ocorrências (a imagem que foi pesquisada). */
export interface ISiteImageSource {
    id: string;
    url: string;
    alt: string | null;
    manual: boolean;
    searched: "pending" | "processing" | "completed";
    searchedAt: string | null;
    searchCount: number;
    lastNewCount: number;
    /** Quando a imagem vence e volta para a fila da extensão. */
    nextSearchAt: string | null;
    createdAt: string;
    siteScrape: { id: string; domain: string; brand: { id: number; name: string; logo_url?: string | null } | null };
}

export interface ISiteImageOccurrence {
    id: string;
    siteImageId: string;
    href: string | null;
    image: string | null;
    thumbnail: string | null;
    text: string | null;
    /** Última pesquisa em que a ocorrência ainda foi encontrada — diz se ela continua no ar. */
    lastSeenAt: string;
    /** Triagem manual: o usuário já analisou esta ocorrência. Não confundir com `lastSeenAt`. */
    reviewed: boolean;
    reviewedAt: string | null;
    /** A mesma ocorrência replicada em `marketplaces`, quando existe — é o que liga esta tela à
     *  tela do ativo. Nulo para ocorrências fora dos marketplaces que replicamos. */
    marketplace: { id: string; brandId: number } | null;
    createdAt: string;
}

/**
 * Estado de um acesso de cliente. É derivado no backend, não há coluna de status:
 * `pendente` (convite no ar) · `expirado` (convite venceu sem ser aceito) ·
 * `ativo` (aceito e valendo) · `desativado` (revogado, mas com histórico preservado).
 */
export type AccessStatus = "pendente" | "expirado" | "ativo" | "desativado";

export interface IClientAccess {
    id: string;
    email: string;
    fullName: string | null;
    status: AccessStatus;
    lastLoginAt: string | null;
    inviteSentCount: number;
    inviteSentAt: string | null;
    inviteExpiresAt: string | null;
    acceptedAt: string | null;
    createdAt: string;
}

/**
 * Um tenant da instalação — na prática, um escritório inteiro, com os próprios clientes e
 * ativos. Só o admin geral enxerga essa lista.
 */
export interface IManagedUser {
    id: string;
    fullName: string | null;
    email: string;
    isBlocked: boolean | null;
    createdAt: string;
    /** O primeiro usuário do sistema, gravado em `MasterAdmin`. */
    isMasterAdmin: boolean;
    _count: {
        client: number;
        brand: number;
    };
}

export interface IClientServices {
    marketplacesMonitoring: boolean;
    companiesMonitoring: boolean;
    domainsMonitoring: boolean;
    socialMediaMonitoring: boolean;
    logoComparisonMonitoring: boolean;
    reverseImageSearchMonitoring: boolean;
    instagramProtectionMonitoring: boolean;
    webImageProtectionMonitoring: boolean;
    /**
     * Não é serviço de rastreio: decide o quanto o acesso de cliente enxerga do que já foi
     * encontrado. Desligado (padrão), ele lista apenas ocorrências verificadas e não
     * arquivadas; ligado, lista tudo, como o dono.
     */
    fullOccurrencesAccess: boolean;
}

/**
 * Situação da importação. `discovering` percorre a API listando publicações; `downloading`
 * baixa as imagens; `reauth_required` significa token revogado/expirado — nenhuma retentativa
 * resolve, o usuário precisa reconectar o perfil.
 */
export type InstagramSyncStatus = "idle" | "discovering" | "downloading" | "completed" | "failed" | "reauth_required";

/** Contagem de imagens por situação — alimenta a barra de progresso. */
export interface IInstagramProgress {
    stored: number;
    pending: number;
    failed: number;
}

/**
 * Situação da proteção de um perfil: quantas imagens já foram buscadas no Vision e quantas
 * cópias apareceram. `total` é o universo protegível (imagens já armazenadas), não o número
 * de publicações.
 */
export interface IInstagramProtectionProgress {
    total: number;
    checked: number;
    pending: number;
    failed: number;
    occurrences: number;
}

/**
 * Cópia de uma imagem do perfil encontrada em outro lugar do Instagram.
 *
 * Houve um `pageUrl` aqui, com a publicação que o Google apontava como origem. Saiu em
 * out/2026: na prática ele trazia um post apenas **relacionado** à imagem, não a ocorrência em
 * si, e confundia mais do que ajudava. O que leva à cópia é o `imageUrl`.
 *
 * `imageUrl` aponta para o CDN do Instagram e **expira** — por isso a prévia do card mostra a
 * nossa imagem, e não ele.
 */
export interface IInstagramOccurrence {
    id: string;
    imageUrl: string;
    domain: string;
    lastSeenAt: string;
    createdAt: string;
    /** Carimbo do descarte manual. `null` = ativa. Só o dono enxerga as descartadas. */
    ignoredAt: string | null;
    image: {
        id: string;
        url: string | null;
        post: { permalink: string | null; postedAt: string | null } | null;
    };
}

/** Perfil do Instagram conectado a um cliente (o token fica só no backend). */
export interface IInstagramAccount {
    id: string;
    clientId: string;
    instagramUserId: string;
    username: string;
    name: string | null;
    accountType: string | null;
    profilePictureUrl: string | null;
    mediaCount: number | null;
    syncStatus: InstagramSyncStatus;
    syncError: string | null;
    /** A varredura parou no teto de páginas: faltam publicações a importar. */
    syncTruncated: boolean;
    /** Há um cursor salvo — a próxima busca retoma de onde parou. */
    resumable: boolean;
    syncStartedAt: string | null;
    /** Último percentual de cota da API reportado pela Meta. */
    apiUsagePercent: number | null;
    postsCount: number;
    imagesCount: number;
    lastSyncAt: string | null;
    tokenExpiresAt: string | null;
    createdAt: string;
    progress: IInstagramProgress;
    protection: IInstagramProtectionProgress;
}

/** Imagem importada de uma publicação — já hospedada no nosso bucket. */
export interface IInstagramImage {
    id: string;
    mediaId: string;
    url: string;
    position: number;
    /** Ocorrências ativas desta imagem — já exclui as descartadas. Alimenta o contador da grade. */
    occurrencesCount: number;
}

/** Publicação de imagem importada (post simples ou carrossel). */
export interface IInstagramPost {
    id: string;
    mediaId: string;
    mediaType: "IMAGE" | "CAROUSEL_ALBUM" | string;
    caption: string | null;
    permalink: string | null;
    postedAt: string | null;
    createdAt: string;
    images: IInstagramImage[];
}

/** Situação da proteção de um ativo nas Imagens na web — mesmo formato do Instagram. */
export type IWebProtectionProgress = IInstagramProtectionProgress;

/** Ativo do cliente como aparece nos cards da tela de Imagens na web. */
export interface IWebImageBrand {
    id: number;
    name: string;
    assetType: string;
    logo_url: string | null;
    /** Site do ativo — o que a busca desconsidera como cópia. */
    domain: string | null;
    protection: IWebProtectionProgress;
}

/** Imagem enviada para a busca na web — sempre um arquivo nosso, em `web-images/`. */
export interface IWebImage {
    id: string;
    url: string;
    /** Preenchido quando a imagem foi copiada do acervo do Instagram. */
    sourceUrl: string | null;
    protectionStatus: "pending" | "checked" | "failed" | string;
    lastCheckedAt: string | null;
    checkError: string | null;
    /** Ocorrências ativas — já exclui as descartadas. */
    occurrencesCount: number;
    createdAt: string;
}

/**
 * Cópia de uma imagem encontrada num site da web.
 *
 * Aqui, ao contrário do Instagram, a página importa: é onde a cópia está publicada e o endereço
 * que vai para o takedown. Opcional porque o Google às vezes só conhece o arquivo.
 */
export interface IWebImageOccurrence {
    id: string;
    imageUrl: string;
    pageUrl: string | null;
    pageTitle: string | null;
    domain: string;
    lastSeenAt: string;
    createdAt: string;
    ignoredAt: string | null;
    image: { id: string; url: string };
}

/** Preço de um serviço cobrado por consulta (tela de Custos). */
export interface IServicePrice {
    service: string;
    label: string;
    provider: "vertex" | "vision" | "cnpja" | "groq" | "gemini";
    /**
     * Unidade do preço: `query` = por consulta (Google); `credit` = por crédito do CNPJá (1 a cada 10
     * empresas lidas); `mtoken` = por 1 milhão de tokens (Groq e Gemini, entrada e saída de cada modelo).
     */
    unit: "query" | "credit" | "mtoken";
    /** Só nas IAs: onde o modelo é usado. */
    usedBy?: string | null;
    /** Custo e preço por unidade, em reais. */
    costBrl: number;
    priceBrl: number;
    configured: boolean;
}

/** Uso, custo e valor a cobrar — com o lucro já calculado. Consultas e créditos não se somam. */
export interface ICostMoney {
    /** Consultas do Google (busca de marcas, Vision) */
    queries: number;
    /** Créditos do CNPJá (monitoramento de empresas) */
    credits: number;
    /** Tokens das IAs (Groq e Gemini), entrada + saída */
    tokens: number;
    costBrl: number;
    priceBrl: number;
    profitBrl: number;
}

export interface ICostServiceLine extends ICostMoney {
    service: string;
    label: string;
    unit: "query" | "credit" | "token";
}

export interface ICostReport {
    /** Período do relatório, `AAAA-MM-DD`, as duas datas inclusive. */
    startDate: string;
    endDate: string;
    /** Busca pelo nome do ativo aplicada (vazio = todos). */
    search: string;
    /** O período ainda tem dias pela frente — só então há projeção. */
    hasProjection: boolean;
    totals: ICostMoney;
    clients: (ICostMoney & {
        clientId: string;
        name: string;
        /** `services`: todos os serviços, um por linha — os sem uso no período vêm zerados. */
        brands: (ICostMoney & { brandId: number; name: string; quota: number; services: ICostServiceLine[]; projection: ICostMoney | null })[];
        withoutBrand: ICostServiceLine[];
    })[];
}

export interface IDashboard {

    _count: {
        brand: number;
        /** `null` no acesso de cliente — ele só enxerga a si mesmo, e o card não é exibido. */
        client: number | null;
        companies: number;
        domains: number;
        logoComparisons: number;
        marketplaces: number;
        socialMedia: number;
        /** Ocorrências da pesquisa reversa das imagens do site (site_image_occurrence). */
        siteImageOccurrences: number;
        /** Cópias das imagens do Instagram encontradas pela proteção (instagram_image_occurrence). */
        instagramImageOccurrences: number;
    };
}
