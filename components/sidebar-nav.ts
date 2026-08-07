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
 */
export const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Clientes", href: "/clients", icon: Users, ownerOnly: true },
    { name: "Ativos", href: "/brands", icon: Shield },
    { name: "Busca por imagem", href: "/image-scraper", icon: ImageIcon },
    { name: "Instagram", href: "/instagram", icon: Instagram },
    { name: "Usuários", href: "/users", icon: Users2, masterOnly: true },
];

/** Funcionalidades em desenvolvimento — exibidas na sidebar apenas para sinalizar
 *  o que vem por aí. São puramente visuais: não navegam nem possuem rota. */
export const upcomingFeatures = [
    { name: "Relatórios", icon: FileBarChart },
    { name: "Suporte personalizado", icon: Headset },
];
