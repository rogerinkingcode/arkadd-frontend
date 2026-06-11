export interface IUser {
    id: string;
    fullName: string;
    email: string;
    role: string;
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
    recipient: string;
    createdAt: Date;
    brand: { name: string };
}

export interface IClient {
    id: string;
    email: string;
    companyName: string;
    companyRepresentative: string;
    registrationNumber: string;
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
    logo_url?: string | null;
    productPrice: number;
    nameThreatPoints: number;
    priceThreatPoints: number;
    imageThreatPoints: number;
    variations?: any | null;
    DomainVariations?: any | null;
    domain?: string | null;
    tagGraphs: ITagGraph[];
    variationBank?: any[];
    domainVariationDatabase?: [];
    variationsSoldOut?: IVariationsSoldOut[];
    typeOfHost: boolean;
    createdAt: string;
    client: { id: string; companyName: string; email: string; companyRepresentative: string };
    _count: { companies: number; domains: number; generalWeb: number; logoComparisons: number; marketplaces: number; socialMedia: number; trustedPartners: number };
    domains: [];
    companies: [];
    socialMedia: [];
    marketplaces: [];
    generalWeb: [];
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

export interface IGeneralWeb {
    id: string;
    brandId: number;
    link?: string | null;
    snippet?: string | null;
    displayLink?: string | null;
    thumbnail?: string | null;
    feedbackTags?: TagAnalysis | null;
    logoComparisonStatus?: boolean | null;
    verifiedThreat?: string | null;
    notified?: string | null;
    archiving?: string | null;
    accesses?: number | null;
    countThreats?: string | null;
    source?: "web" | "marketplace" | "company" | "domain" | "social" | "logo" | null;
    createdAt: string | undefined;
    brand: IBrand;
}

export interface IMarketplaces {
    id: string;
    brandId: number;
    link?: string | null;
    snippet?: string | null;
    displayLink?: string | null;
    thumbnail?: string | null;
    feedbackTags?: TagAnalysis | null;
    info: IMarketplaceProduct | null;
    feedbacks: IFeedbacks;
    score: number;
    logoComparisonStatus?: boolean | null;
    verifiedThreat?: string | null;
    notified?: string | null;
    archiving?: string | null;
    accesses?: number | null;
    countThreats?: string | null;
    source?: "web" | "marketplace" | "company" | "domain" | "social" | "logo" | null;
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
    feedbackTags?: TagAnalysis | null;
    logoComparisonStatus?: boolean | null;
    verifiedThreat?: string | null;
    notified?: string | null;
    archiving?: string | null;
    accesses?: number | null;
    countThreats?: string | null;
    source?: "web" | "marketplace" | "company" | "domain" | "social" | "logo" | null;
    createdAt: string | undefined;
    brand: IBrand;
}

export interface IDomains {
    id: string;
    brandId: number;
    domain: string | null;
    status: boolean | null;
    details: IDomainWhoisInfo | null;
    verifiedThreat?: string | null;
    notified?: string | null;
    archiving?: string | null;
    accesses?: number | null;
    countThreats?: string | null;
    source?: "web" | "marketplace" | "company" | "domain" | "social" | "logo" | null;
    createdAt: string | undefined;
    brand: IBrand;
}

export interface ICompanies {
    id: string;
    brandId: number;
    cnpj: string | null;
    data: ICompaniesInfoData | null;
    verifiedThreat?: string | null;
    notified?: string | null;
    archiving?: string | null;
    accesses?: number | null;
    countThreats?: string | null;
    source?: "web" | "marketplace" | "company" | "domain" | "social" | "logo" | null;
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
    accesses?: number | null;
    countThreats?: string | null;
    source?: "web" | "marketplace" | "company" | "domain" | "social" | "logo" | null;
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
}

interface TagAnalysis {
    matches: string[];
    ignoredTags: string[];
    activatedTags: string[];
}

interface ICredentials {
    id: string;
    userId: string;
    apiKeyGroq: string;
    apiKeyCnpja: string;
    apiKeyGoogleSearch: string;
    socialMediaMonitorId: string;
    marketplacesMonitorId: string;
    generalWebMonitorId: string;
    createdAt: string;
}

interface IFeedbacks {
    priceFeedback: string;
    partnerFeedback: string;
    imageFeedback: string;
}

export interface IVariationsSoldOut {
    date: string;
    tags: string[];
}

interface ITagGraph {
    brandId: number;
    tags: IForGraphs;
    createdAt: string;
}

export interface IForGraphs {
    tag: string;
    count: number;
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
    createdAt: string;
}

export interface IClientServices {
    webMonitoring: boolean;
    marketplacesMonitoring: boolean;
    companiesMonitoring: boolean;
    domainsMonitoring: boolean;
    socialMediaMonitoring: boolean;
    logoComparisonMonitoring: boolean;
    reverseImageSearchMonitoring: boolean;
}

export interface IDashboard {
    _count: {
        brand: number;
        client: number;
        companies: number;
        domains: number;
        generalWeb: number;
        logoComparisons: number;
        marketplaces: number;
        socialMedia: number;
    };
}
