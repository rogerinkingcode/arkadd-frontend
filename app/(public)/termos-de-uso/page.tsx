import LegalShell from "../_components/LegalShell";

export const metadata = {
    title: "Termos de Uso | Trackings",
    description: "Condições de uso da plataforma Trackings de monitoramento de marca e combate à contrafação.",
};

export default function TermsOfUsePage() {
    return (
        <LegalShell title="Termos de Uso" updatedAt="11 de agosto de 2026">
            <p>
                Estes termos regem o uso da plataforma <strong>Trackings</strong> ("plataforma"), fornecida pela <strong>APEX PROPRIEDADE INTELECTUAL LTDA</strong>, CNPJ <strong>55.975.721/0001-09</strong> ("nós"). Ao acessar a plataforma, o usuário declara que leu, entendeu e aceita estas condições, bem como a{" "}
                <a href="/politica-de-privacidade">Política de Privacidade</a>.
            </p>

            <h2>1. O que a plataforma faz</h2>
            <p>A plataforma monitora, de forma automatizada, o uso indevido de marcas, produtos, logotipos e imagens na internet. Conforme os serviços contratados, ela pode:</p>
            <ul>
                <li>buscar ocorrências em marketplaces, redes sociais e na web em geral;</li>
                <li>verificar registros de domínio e cadastros empresariais semelhantes aos do contratante;</li>
                <li>comparar logotipos encontrados com o original;</li>
                <li>extrair imagens do site do contratante e procurar cópias delas na internet;</li>
                <li>importar as publicações de um perfil profissional do Instagram autorizado e procurar cópias exatas dessas imagens dentro do Instagram.</li>
            </ul>

            <h2>2. Quem pode usar</h2>
            <p>O acesso é restrito a pessoas jurídicas e aos representantes por elas indicados. Cada credencial é pessoal e intransferível, e o titular responde pelas ações praticadas com ela. Suspeitando de uso indevido, o acesso deve ser comunicado imediatamente para revogação.</p>
            <p>Existem dois níveis de acesso: o do escritório contratante, que administra clientes, ativos e serviços; e o de cliente, restrito à visualização dos dados da própria empresa.</p>

            <h2>3. Responsabilidades do contratante</h2>
            <ul>
                <li>Garantir que detém os direitos sobre as marcas, produtos, logotipos e imagens cadastrados para monitoramento, ou que está autorizado a representá-los.</li>
                <li>Conectar ao Instagram apenas perfis próprios ou de clientes que tenham autorizado expressamente a conexão. A autorização é dada na tela do próprio Instagram, pelo titular da conta.</li>
                <li>Manter dados cadastrais corretos e atualizados.</li>
                <li>Não utilizar a plataforma para monitorar pessoas naturais, coletar dados sem base legal ou qualquer finalidade estranha à proteção de ativos de marca.</li>
                <li>Avaliar cada ocorrência antes de tomar qualquer medida contra terceiros.</li>
            </ul>

            <h2>4. Natureza dos resultados</h2>
            <p>
                Este é o ponto mais importante destes termos. Os resultados são produzidos por <strong>buscas automatizadas e análises algorítmicas, inclusive com uso de inteligência artificial</strong>, e por isso:
            </p>
            <ul>
                <li>
                    <strong>não constituem parecer jurídico</strong> nem prova pericial de contrafação;
                </li>
                <li>
                    podem conter <strong>falsos positivos</strong> — ocorrências legítimas apontadas como suspeitas;
                </li>
                <li>
                    podem conter <strong>falsos negativos</strong> — não há garantia de que toda infração existente será localizada;
                </li>
                <li>dependem do que os buscadores e as APIs de terceiros indexam e devolvem, o que muda ao longo do tempo e está fora do nosso controle.</li>
            </ul>
            <p>
                A decisão de notificar, denunciar, pedir remoção de conteúdo ou tomar medidas judiciais é <strong>exclusivamente do contratante</strong>, que deve validar as informações e, quando for o caso, consultar assessoria jurídica. Não respondemos pelas consequências de medidas tomadas com base nos resultados.
            </p>

            <h2>5. Serviços contratados e cotas</h2>
            <p>Cada modalidade de monitoramento é contratada separadamente e pode ser ativada ou desativada por empresa cliente. Desativar um serviço interrompe novas buscas, mas não apaga o que já foi encontrado.</p>
            <p>As integrações externas possuem limites de requisição impostos pelos próprios fornecedores. Ao atingi-los, as buscas são pausadas e retomadas automaticamente, o que pode atrasar resultados.</p>

            <h2>6. Integração com o Instagram</h2>
            <ul>
                <li>Somente contas profissionais (Comercial ou de Criador de conteúdo) podem ser conectadas — é uma exigência da própria Meta.</li>
                <li>A conexão pode ser encerrada a qualquer momento, pelo painel ou pelas configurações do Instagram, e a desconexão apaga os dados importados.</li>
                <li>O uso da API do Instagram está sujeito às políticas da Meta. Alterações que a Meta faça em suas regras, limites ou disponibilidade podem afetar esta funcionalidade sem aviso prévio.</li>
                <li>Não somos afiliados, patrocinados ou endossados pela Meta Platforms.</li>
            </ul>

            <h2>7. Disponibilidade</h2>
            <p>Empregamos esforços para manter a plataforma disponível, mas ela pode ficar indisponível por manutenção, falha de fornecedores ou eventos fora do nosso controle. Salvo previsão contratual em contrário, não há garantia de disponibilidade ininterrupta.</p>

            <h2>8. Propriedade intelectual</h2>
            <p>O software, a interface, a marca e a documentação da plataforma são de nossa titularidade. O contrato não transfere qualquer direito sobre eles, sendo vedada a cópia, engenharia reversa, redistribuição ou criação de obra derivada.</p>
            <p>Os dados cadastrados e os resultados gerados pertencem ao contratante, que pode solicitar cópia enquanto o contrato estiver vigente.</p>

            <h2>9. Uso proibido</h2>
            <ul>
                <li>Tentar acessar dados de outro contratante ou de outra empresa cliente.</li>
                <li>Automatizar acesso à plataforma sem autorização, ou contornar limites de uso.</li>
                <li>Explorar vulnerabilidades, interferir na operação ou sobrecarregar deliberadamente a infraestrutura.</li>
                <li>Empregar os resultados para assédio, concorrência desleal ou qualquer finalidade ilícita.</li>
            </ul>
            <p>O descumprimento autoriza a suspensão imediata do acesso, sem prejuízo das medidas cabíveis.</p>

            <h2>10. Limitação de responsabilidade</h2>
            <p>Na máxima extensão permitida pela lei, não respondemos por lucros cessantes, perda de oportunidade ou danos indiretos decorrentes do uso da plataforma, tampouco por atos de terceiros, incluindo indisponibilidade ou alteração de serviços de fornecedores externos.</p>

            <h2>11. Encerramento</h2>
            <p>O contratante pode encerrar o uso a qualquer momento. Encerrado o contrato, os dados são mantidos apenas pelo prazo legal aplicável e depois eliminados, conforme a Política de Privacidade.</p>

            <h2>12. Alterações destes termos</h2>
            <p>Estes termos podem ser atualizados. A data de última atualização é sempre exibida no topo desta página, e mudanças relevantes são comunicadas aos contratantes.</p>

            <h2>13. Lei aplicável e foro</h2>
            <p>
                Aplica-se a legislação brasileira. Fica eleito o foro da comarca de <strong>Palmas/TO</strong> para dirimir controvérsias, com renúncia a qualquer outro.
            </p>

            <h2>14. Contato</h2>
            <p>
                <strong>info@apexip.com</strong>
            </p>
        </LegalShell>
    );
}
