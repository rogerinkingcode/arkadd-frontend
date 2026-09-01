import { LayoutDashboard, Shield, Users, Users2, ImageIcon, Instagram, FileBarChart, Headset } from "lucide-react";

/**
 * Itens da sidebar, num lugar só.
 *
 * O `app-layout` e o `LayoutSkeleton` desenham a mesma barra — mantendo duas listas, a do
 * skeleton envelhecia calada (ficou sem "Instagram" por um tempo, e mostrava "Clientes" para
 * quem não pode vê-lo).
 */

/**
 * `ownerOnly` sai do menu no acesso de cliente — ele não gerencia clientes.
 *
 * `masterOnly` só aparece para o admin geral do sistema: cadastrar um usuário é abrir a
 * instalação para mais um escritório, e isso é decisão de quem opera o sistema, não de quem
 * apenas o contratou.
 *
 * `name` deixou de ir para a tela: é só identidade estável (chave de lista do React e alvo
 * de busca no código). O rótulo visível vem de `labelKey`, traduzido no componente — se o
 * texto voltasse a sair daqui, trocar de idioma remontaria a lista inteira.
 */
export const navigation = [
    { name: "Dashboard", labelKey: "nav.dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Clientes", labelKey: "nav.clients", href: "/clients", icon: Users, ownerOnly: true },
    { name: "Ativos", labelKey: "nav.brands", href: "/brands", icon: Shield },
    { name: "Busca por imagem", labelKey: "nav.imageScraper", href: "/image-scraper", icon: ImageIcon },
    { name: "Instagram", labelKey: "nav.instagram", href: "/instagram", icon: Instagram },
    { name: "Usuários", labelKey: "nav.users", href: "/users", icon: Users2, masterOnly: true },
];

/** Funcionalidades em desenvolvimento — exibidas na sidebar apenas para sinalizar
 *  o que vem por aí. São puramente visuais: não navegam nem possuem rota. */
export const upcomingFeatures = [
    { name: "Relatórios", labelKey: "nav.reports", icon: FileBarChart },
    { name: "Suporte personalizado", labelKey: "nav.support", icon: Headset },
];
