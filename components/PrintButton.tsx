"use client";

import { useRef, useEffect } from "react";

interface PrintAllTabsButtonProps {
    tabContainerIds: string[]; // IDs de todas as containers das abas
    buttonText?: string;
    autoPrint?: boolean; // Nova prop para impressão automática
}

export default function PrintAllTabsButton({
    tabContainerIds,
    buttonText = "📋 Exportar Todas as Abas",
    autoPrint = false, // Padrão: não imprime automaticamente
}: PrintAllTabsButtonProps) {
    const buttonRef = useRef<HTMLButtonElement>(null);
    const hasAutoPrinted = useRef(false); // Para controlar impressão automática única

    // Função de exportação (mesma lógica)
    const exportAllTabs = () => {
        if (!buttonRef.current || tabContainerIds.length === 0) return;

        const button = buttonRef.current;
        const wasDisabled = button.disabled; // Salva estado anterior
        const originalText = button.textContent;

        if (!wasDisabled) {
            button.disabled = true;
            button.textContent = "Preparando...";
        }

        try {
            // 1. Encontra e prepara TODAS as abas
            const allTabContents: { element: HTMLElement; originalDisplay: string }[] = [];

            tabContainerIds.forEach((id) => {
                const element = document.getElementById(id);
                if (element) {
                    // Salva o estado original e TORNA VISÍVEL
                    allTabContents.push({
                        element,
                        originalDisplay: element.style.display,
                    });

                    // Torna todas as abas visíveis temporariamente
                    element.style.display = "block";
                    element.style.opacity = "1";
                    element.style.visibility = "visible";
                    element.style.position = "relative";
                    element.style.height = "auto";
                }
            });

            // 2. Cria um container temporário para juntar tudo
            const printContainer = document.createElement("div");
            printContainer.id = "print-all-tabs-container";
            printContainer.style.cssText = `
        position: fixed;
        left: -9999px;
        top: 0;
        width: 100%;
        background: white;
        z-index: 99999;
      `;

            // 3. Clona e organiza todas as abas no container (SEM TÍTULO, SEM QUEBRAS)
            allTabContents.forEach(({ element }) => {
                const clone = element.cloneNode(true) as HTMLElement;
                clone.id = `${element.id}-print-clone`;

                // Remove classes/estilos que escondem elementos
                clone.classList.remove("hidden", "opacity-0", "invisible");
                clone.style.cssText = `
          display: block !important;
          opacity: 1 !important;
          visibility: visible !important;
          position: relative !important;
          width: 100% !important;
          margin-bottom: 20px !important; /* Espaço entre abas, mas SEM quebra de página */
          page-break-inside: avoid !important;
          break-inside: avoid !important;
        `;

                // REMOVE elementos com classe no-export do clone
                const noExportElements = clone.querySelectorAll(".no-export");
                noExportElements.forEach((el) => {
                    el.remove();
                });

                // NÃO ADICIONA TÍTULO - apenas o conteúdo da aba
                printContainer.appendChild(clone);
            });

            // 4. Adiciona o container à página
            document.body.appendChild(printContainer);

            // 5. Aplica estilos de impressão (UMA ÚNICA PÁGINA GIGANTE)
            const printStyles = document.createElement("style");
            printStyles.innerHTML = `
        @media print {
          /* CONFIGURAÇÃO PARA UMA PÁGINA ÚNICA E LONGA */
          @page {
            margin: 15mm; /* Margens padrão */
            size: A3 landscape; /* TAMANHO A3 EM PAISAGEM */
          }
          
          /* Remove qualquer texto/url das margens */
          @page {
            marks: none;
          }
          
          body {
            margin: 0 !important;
            padding: 0 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            height: auto !important; /* Altura automática */
            min-height: auto !important;
          }
          
          /* DESABILITA TODAS AS QUEBRAS DE PÁGINA */
          html, body, #print-all-tabs-container, 
          #print-all-tabs-container * {
            page-break-inside: avoid !important;
            page-break-before: avoid !important;
            page-break-after: avoid !important;
            break-inside: avoid !important;
            break-before: avoid !important;
            break-after: avoid !important;
          }
          
          body * {
            visibility: hidden;
          }
          
          #print-all-tabs-container,
          #print-all-tabs-container * {
            visibility: visible !important;
          }
          
          /* CONTAINER ÚNICO E CONTÍNUO */
          #print-all-tabs-container {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            background: white !important;
            margin: 0 !important;
            padding: 0 !important;
            display: block !important;
            height: auto !important;
            min-height: 100% !important;
            overflow: visible !important;
          }
          
          /* Garante que tudo fique em fluxo contínuo */
          #print-all-tabs-container > * {
            display: block !important;
            float: none !important;
            position: relative !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
          
          .no-print, .no-export {
            display: none !important;
          }
          
          /* Remove cabeçalhos e rodapés padrão do navegador */
          @page {
            margin-top: 0;
            margin-bottom: 0;
            margin-header: 0;
            margin-footer: 0;
          }
          
          /* Remove URLs, títulos e números de página */
          body:after {
            display: none !important;
          }
          
          /* Remove qualquer cabeçalho/rodapé que o navegador possa adicionar */
          header, footer, .header, .footer {
            display: none !important;
          }
          
          /* AJUSTES ESPECÍFICOS PARA CONTEÚDO LONGO */
          table {
            page-break-inside: auto !important;
          }
          
          tr {
            page-break-inside: avoid !important;
            page-break-after: auto !important;
          }
          
          /* Força o navegador a não quebrar */
          .card, .section, .table-container {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
        }
        
        /* Estilo temporário para visualização */
        @media screen {
          #print-all-tabs-container {
            position: relative !important;
            left: 0 !important;
            top: 0 !important;
            width: 420mm; /* Largura A3 em paisagem (420mm) */
            min-height: 1000mm; /* Altura longa */
            margin: 20px auto;
            padding: 20px;
            background: white;
            box-shadow: 0 0 20px rgba(0,0,0,0.1);
            box-sizing: border-box;
          }
        }
      `;
            document.head.appendChild(printStyles);

            // 6. Muda título (mas não aparecerá nas margens)
            const originalTitle = document.title;
            document.title = "Relatório Completo";

            // 7. Remove URL da impressão (para alguns navegadores)
            try {
                const removePrintMeta = document.createElement("meta");
                removePrintMeta.name = "robots";
                removePrintMeta.content = "noindex,nofollow";
                document.head.appendChild(removePrintMeta);

                setTimeout(() => {
                    document.head.removeChild(removePrintMeta);
                }, 1000);
            } catch (e) {
                // Ignora erros
            }

            // 8. Força um redimensionamento para garantir renderização
            setTimeout(() => {
                printContainer.offsetHeight; // Força reflow
            }, 100);

            // 9. Aciona a impressão
            window.print();

            // 10. Limpeza
            setTimeout(() => {
                document.head.removeChild(printStyles);
                document.body.removeChild(printContainer);
                document.title = originalTitle;

                // Restaura o estado original das abas
                allTabContents.forEach(({ element, originalDisplay }) => {
                    element.style.cssText = originalDisplay;
                });

                // Só reativa se não foi impressão automática
                if (!wasDisabled) {
                    button.disabled = false;
                    button.textContent = originalText || buttonText;
                }

                // Marca que a impressão automática foi concluída
                if (autoPrint) {
                    hasAutoPrinted.current = true;
                }
            }, 500);
        } catch (error) {
            console.error("Erro ao exportar:", error);

            // Só reativa se não foi impressão automática
            if (!wasDisabled) {
                button.disabled = false;
                button.textContent = buttonText;
            }
        }
    };

    // Efeito para impressão automática ao carregar
    useEffect(() => {
        if (autoPrint && !hasAutoPrinted.current) {
            // Pequeno delay para garantir que a página carregou
            const timer = setTimeout(() => {
                if (tabContainerIds.length > 0) {
                    hasAutoPrinted.current = true;
                    exportAllTabs();
                }
            }, 1000); // 1 segundo depois do carregamento

            return () => clearTimeout(timer);
        }
    }, [autoPrint, tabContainerIds]);

    return (
        <button ref={buttonRef} onClick={exportAllTabs} className="no-export bg-primary hover:bg-primary/90 text-white font-medium py-3 px-6 rounded-lg shadow transition-all duration-200">
            {buttonText}
        </button>
    );
}

//"use client";
//
//import { useRef } from "react";
//
//interface PrintAllTabsButtonProps {
//    tabContainerIds: string[]; // IDs de todas as containers das abas
//    buttonText?: string;
//}
//
//export default function PrintAllTabsButton({ tabContainerIds, buttonText = "📋 Exportar Todas as Abas" }: PrintAllTabsButtonProps) {
//    const buttonRef = useRef<HTMLButtonElement>(null);
//
//    const exportAllTabs = () => {
//        if (!buttonRef.current || tabContainerIds.length === 0) return;
//
//        const button = buttonRef.current;
//        button.disabled = true;
//        button.textContent = "Preparando...";
//
//        try {
//            // 1. Encontra e prepara TODAS as abas
//            const allTabContents: { element: HTMLElement; originalDisplay: string }[] = [];
//
//            tabContainerIds.forEach((id) => {
//                const element = document.getElementById(id);
//                if (element) {
//                    // Salva o estado original e TORNA VISÍVEL
//                    allTabContents.push({
//                        element,
//                        originalDisplay: element.style.display,
//                    });
//
//                    // Torna todas as abas visíveis temporariamente
//                    element.style.display = "block";
//                    element.style.opacity = "1";
//                    element.style.visibility = "visible";
//                    element.style.position = "relative";
//                    element.style.height = "auto";
//                }
//            });
//
//            // 2. Cria um container temporário para juntar tudo
//            const printContainer = document.createElement("div");
//            printContainer.id = "print-all-tabs-container";
//            printContainer.style.cssText = `
//        position: fixed;
//        left: -9999px;
//        top: 0;
//        width: 100%;
//        background: white;
//        z-index: 99999;
//      `;
//
//            // 3. Clona e organiza todas as abas no container (SEM TÍTULO, SEM QUEBRAS)
//            allTabContents.forEach(({ element }) => {
//                const clone = element.cloneNode(true) as HTMLElement;
//                clone.id = `${element.id}-print-clone`;
//
//                // Remove classes/estilos que escondem elementos
//                clone.classList.remove("hidden", "opacity-0", "invisible");
//                clone.style.cssText = `
//          display: block !important;
//          opacity: 1 !important;
//          visibility: visible !important;
//          position: relative !important;
//          width: 100% !important;
//          margin-bottom: 20px !important; /* Espaço entre abas, mas SEM quebra de página */
//          page-break-inside: avoid !important;
//          break-inside: avoid !important;
//        `;
//
//                // REMOVE elementos com classe no-export do clone
//                const noExportElements = clone.querySelectorAll(".no-export");
//                noExportElements.forEach((el) => {
//                    el.remove();
//                });
//
//                // NÃO ADICIONA TÍTULO - apenas o conteúdo da aba
//                printContainer.appendChild(clone);
//
//                // NÃO ADICIONA QUEBRA DE PÁGINA - tudo contínuo
//            });
//
//            // 4. Adiciona o container à página
//            document.body.appendChild(printContainer);
//
//            // 5. Aplica estilos de impressão (UMA ÚNICA PÁGINA GIGANTE)
//            const printStyles = document.createElement("style");
//            printStyles.innerHTML = `
//        @media print {
//          /* CONFIGURAÇÃO PARA UMA PÁGINA ÚNICA E LONGA */
//          @page {
//            margin: 15mm; /* Margens padrão */
//            size: auto; /* Tamanho automático - o conteúdo define a altura */
//          }
//
//          /* Remove qualquer texto/url das margens */
//          @page {
//            marks: none;
//          }
//
//          body {
//            margin: 0 !important;
//            padding: 0 !important;
//            -webkit-print-color-adjust: exact !important;
//            print-color-adjust: exact !important;
//            height: auto !important; /* Altura automática */
//            min-height: auto !important;
//          }
//
//          /* DESABILITA TODAS AS QUEBRAS DE PÁGINA */
//          html, body, #print-all-tabs-container,
//          #print-all-tabs-container * {
//            page-break-inside: avoid !important;
//            page-break-before: avoid !important;
//            page-break-after: avoid !important;
//            break-inside: avoid !important;
//            break-before: avoid !important;
//            break-after: avoid !important;
//          }
//
//          body * {
//            visibility: hidden;
//          }
//
//          #print-all-tabs-container,
//          #print-all-tabs-container * {
//            visibility: visible !important;
//          }
//
//          /* CONTAINER ÚNICO E CONTÍNUO */
//          #print-all-tabs-container {
//            position: absolute !important;
//            left: 0 !important;
//            top: 0 !important;
//            width: 100% !important;
//            background: white !important;
//            margin: 0 !important;
//            padding: 0 !important;
//            display: block !important;
//            height: auto !important;
//            min-height: 100% !important;
//            overflow: visible !important;
//          }
//
//          /* Garante que tudo fique em fluxo contínuo */
//          #print-all-tabs-container > * {
//            display: block !important;
//            float: none !important;
//            position: relative !important;
//            page-break-inside: avoid !important;
//            break-inside: avoid !important;
//          }
//
//          .no-print, .no-export {
//            display: none !important;
//          }
//
//          /* Remove cabeçalhos e rodapés padrão do navegador */
//          @page {
//            margin-top: 0;
//            margin-bottom: 0;
//            margin-header: 0;
//            margin-footer: 0;
//          }
//
//          /* Remove URLs, títulos e números de página */
//          body:after {
//            display: none !important;
//          }
//
//          /* Remove qualquer cabeçalho/rodapé que o navegador possa adicionar */
//          header, footer, .header, .footer {
//            display: none !important;
//          }
//
//          /* AJUSTES ESPECÍFICOS PARA CONTEÚDO LONGO */
//          table {
//            page-break-inside: auto !important;
//          }
//
//          tr {
//            page-break-inside: avoid !important;
//            page-break-after: auto !important;
//          }
//
//          /* Força o navegador a não quebrar */
//          .card, .section, .table-container {
//            page-break-inside: avoid !important;
//            break-inside: avoid !important;
//          }
//        }
//
//        /* Estilo temporário para visualização */
//        @media screen {
//          #print-all-tabs-container {
//            position: relative !important;
//            left: 0 !important;
//            top: 0 !important;
//            width: 210mm; /* Largura A4 */
//            min-height: 1000mm; /* Altura longa */
//            margin: 20px auto;
//            padding: 20px;
//            background: white;
//            box-shadow: 0 0 20px rgba(0,0,0,0.1);
//            box-sizing: border-box;
//          }
//        }
//      `;
//            document.head.appendChild(printStyles);
//
//            // 6. Muda título (mas não aparecerá nas margens)
//            const originalTitle = document.title;
//            document.title = "Relatório Completo";
//
//            // 7. Remove URL da impressão (para alguns navegadores)
//            try {
//                const removePrintMeta = document.createElement("meta");
//                removePrintMeta.name = "robots";
//                removePrintMeta.content = "noindex,nofollow";
//                document.head.appendChild(removePrintMeta);
//
//                setTimeout(() => {
//                    document.head.removeChild(removePrintMeta);
//                }, 1000);
//            } catch (e) {
//                // Ignora erros
//            }
//
//            // 8. Força um redimensionamento para garantir renderização
//            setTimeout(() => {
//                printContainer.offsetHeight; // Força reflow
//            }, 100);
//
//            // 9. Aciona a impressão
//            window.print();
//
//            // 10. Limpeza
//            setTimeout(() => {
//                document.head.removeChild(printStyles);
//                document.body.removeChild(printContainer);
//                document.title = originalTitle;
//
//                // Restaura o estado original das abas
//                allTabContents.forEach(({ element, originalDisplay }) => {
//                    element.style.cssText = originalDisplay;
//                });
//
//                button.disabled = false;
//                button.textContent = buttonText;
//            }, 500);
//        } catch (error) {
//            console.error("Erro ao exportar:", error);
//            button.disabled = false;
//            button.textContent = buttonText;
//        }
//    };
//
//    return (
//        <button ref={buttonRef} onClick={exportAllTabs} className="no-export bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-6 rounded-lg shadow transition-all duration-200">
//            {buttonText}
//        </button>
//    );
//}
//
