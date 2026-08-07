import { countries } from "@/lib/countries";

/** Códigos alpha-2 conhecidos, montados a partir da lista que já existe no projeto. */
const KNOWN_CODES = new Set(countries.map((country) => country.cca2.toUpperCase()));

/** Nome em inglês por código — usado quando o navegador não sabe traduzir. */
const FALLBACK_NAMES = new Map(countries.map((country) => [country.cca2.toUpperCase(), country.name.common]));

/**
 * Tradutor de código para nome de país em pt-BR.
 *
 * `Intl.DisplayNames` já vem no navegador com a tabela de nomes localizados — evita carregar
 * uma segunda lista de países só para exibir "Brasil" em vez de "Brazil". Fica em `let` com
 * criação preguiçosa porque instanciar custa, e a tabela de ameaças chama isto uma vez por linha.
 */
let displayNames: Intl.DisplayNames | null = null;

function getDisplayNames(): Intl.DisplayNames | null {
    if (displayNames) return displayNames;

    try {
        displayNames = new Intl.DisplayNames(["pt-BR"], { type: "region" });
        return displayNames;
    } catch {
        return null;
    }
}

/**
 * Extrai o código alpha-2 do que veio do banco.
 *
 * A coluna é preenchida por dedução — em boa parte das vezes por IA — então o valor que chega
 * nem sempre é exatamente o combinado. O regex recorta as duas letras de formas como `BR`,
 * `br`, `"BR"` ou `pt-BR`, e a validação contra a lista conhecida barra o que sobrar. Devolve
 * `null` quando não dá para afirmar o país, e é isso que a tela mostra como "—".
 */
export function countryCodeFromValue(value?: string | null): string | null {
    if (!value) return null;

    // Em `pt-BR` quem vale é a região (a segunda metade); em `BR` é a única que existe.
    const match = value.trim().toUpperCase().match(/([A-Z]{2})\s*$/);

    if (!match) return null;

    const code = match[1];

    // "UK" não é ISO (o Reino Unido é "GB"), mas é o que todo mundo escreve.
    const normalized = code === "UK" ? "GB" : code;

    if (KNOWN_CODES.has(normalized)) return normalized;

    // Código fora da lista do projeto mas que o navegador reconhece (a lista tem 250 entradas,
    // o ISO tem algumas a mais). Quando `of()` devolve o próprio código, não reconheceu.
    const name = getDisplayNames()?.of(normalized);

    return name && name !== normalized ? normalized : null;
}

/** Nome do país em pt-BR, com o nome em inglês como último recurso. */
export function countryName(code: string): string {
    const name = getDisplayNames()?.of(code);

    if (name && name !== code) return name;

    return FALLBACK_NAMES.get(code) ?? code;
}
