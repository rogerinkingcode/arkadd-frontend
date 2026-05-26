/** Poda domínios ou links para expor somente o nome do site */
export function extractRootDomain(url: string): string {
    let clean = url.replace(/^https?:\/\//, "").replace(/^www\./, "");
    const parts = clean.split(".");
    const root = parts.length > 2 ? parts[parts.length - 3] : parts[0];

    const formatted = root.charAt(0).toUpperCase() + root.slice(1).toLowerCase();

    return formatted.length > 20 ? formatted.slice(0, 20) + "..." : formatted;
}

export function formatCNPJ(value: string): string {
    if (!value) return "";

    const digits = value.replace(/\D/g, "");

    if (digits.length !== 14) return value;

    return digits.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5");
}

export function generateUniqueNumbers(amount: number): number[] {
    if (amount < 1 || amount > 28) {
        throw new Error("A quantidade deve ser entre 1 e 28");
    }

    const numbers = new Set<number>();

    while (numbers.size < amount) {
        const random = Math.floor(Math.random() * 28) + 1; // 1 a 28
        numbers.add(random);
    }

    return Array.from(numbers).sort((a, b) => a - b);
}

export function normalizeAliExpressProductUrl(url: string) {
    if (typeof url !== "string") return url;

    let parsedUrl;

    // Garante que é uma URL válida
    try {
        parsedUrl = new URL(url);
    } catch {
        return url;
    }

    const hostname = parsedUrl.hostname.toLowerCase();

    // 1️⃣ Não é AliExpress → retorna como veio
    if (!hostname.includes("aliexpress.com")) {
        return url;
    }

    // 2️⃣ Tenta extrair productId da query (?productId=...)
    const productIdFromQuery = parsedUrl.searchParams.get("productId");

    if (productIdFromQuery && /^\d+$/.test(productIdFromQuery)) {
        return `https://www.aliexpress.com/item/${productIdFromQuery}.html`;
    }

    // 3️⃣ Tenta extrair productId da URL /item/XXXX.html
    const matchFromPath = parsedUrl.pathname.match(/\/item\/(\d+)\.html/);

    if (matchFromPath) {
        return `https://www.aliexpress.com/item/${matchFromPath[1]}.html`;
    }

    // 4️⃣ Não conseguiu identificar productId → retorna URL original
    return url;
}

export function hasQueryString(url: string) {
    if (typeof url !== "string") return false;
    return url.includes("?");
}

export const formatPrice = (price: any) => {
    if (!price && price !== 0) return "R$ 0,00";
    //
    //const strValue = price.toString();
    //const parts = strValue?.split(".");
    //
    //let priceInCents: number;
    //
    //if (parts?.length === 2) {
    //    const beforeOfPoint = parts[0];
    //    const afterOfPoint = parts[1];
    //
    //    if (afterOfPoint.length === 3 && beforeOfPoint.length <= 3) {
    //        priceInCents = parseInt(beforeOfPoint + afterOfPoint + "00", 10);
    //    } else {
    //        priceInCents = parseInt(strValue.replace(".", ""), 10);
    //    }
    //} else {
    //    priceInCents = parseInt(strValue, 10) * 100;
    //}

    return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
    }).format(price);
};
