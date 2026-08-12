import LegalShell from "../_components/LegalShell";

export const metadata = {
    title: "Política de Privacidade | Trackings",
    description: "Como o Trackings coleta, usa, compartilha e exclui dados pessoais, incluindo os dados obtidos do Instagram.",
};

export default function PrivacyPolicyPage() {
    return (
        <LegalShell title="Política de Privacidade" updatedAt="11 de agosto de 2026">
            <p>
                Esta política descreve como a <strong>APEX PROPRIEDADE INTELECTUAL LTDA</strong>, inscrita no CNPJ sob o nº <strong>55.975.721/0001-09</strong>, com sede na <strong>Quadra ACSO 1, Avenida Juscelino Kubitschek, 140, Sala 805, Palmas/TO, CEP 77015-012</strong> ("nós"), trata dados pessoais na plataforma <strong>Trackings</strong> ("plataforma"), um serviço de monitoramento de marca e combate à
                contrafação contratado por empresas.
            </p>
            <p>
                A plataforma é um serviço <strong>empresarial</strong>: quem a utiliza é o escritório contratante e os representantes das empresas clientes dele. Não há cadastro aberto ao público nem oferta a consumidores.
            </p>

            <h2>1. Quem é o controlador dos dados</h2>
            <p>
                Somos o <strong>controlador</strong> dos dados de cadastro e de uso da plataforma. Em relação aos dados que tratamos por conta e ordem de uma empresa cliente — os ativos monitorados, o conteúdo do site dela e os perfis do Instagram que ela conecta —, atuamos como <strong>operador</strong>, seguindo as
                instruções de quem contratou o serviço.
            </p>
            <p>
                Encarregado pelo tratamento de dados pessoais (DPO): <strong>Guilherme de Carvalho Santos</strong> — <strong>info@apexip.com</strong>.
            </p>

            <h2>2. Dados que coletamos</h2>

            <h3>2.1. Dados de conta e acesso</h3>
            <ul>
                <li>Nome, e-mail e senha de quem acessa a plataforma. A senha é armazenada apenas como hash (bcrypt) — não temos acesso à senha em si.</li>
                <li>Dados cadastrais das empresas clientes: razão social, CNPJ, e-mail, país e nome do representante.</li>
                <li>Registros de convite e de redefinição de senha, cujos tokens são guardados em forma de hash e expiram automaticamente.</li>
            </ul>

            <h3>2.2. Dados dos ativos monitorados</h3>
            <ul>
                <li>Marcas, produtos, logotipos, domínios, CNPJs e termos de busca informados pela empresa cliente.</li>
                <li>Ocorrências localizadas publicamente na internet (endereço da página, título, trecho de texto, imagem de prévia, país estimado e data), em marketplaces, redes sociais, web geral, registros de domínio e cadastros empresariais.</li>
                <li>Imagens extraídas do site da própria empresa cliente, quando ela solicita esse monitoramento.</li>
            </ul>

            <h3>2.3. Dados obtidos do Instagram</h3>
            <p>
                A conexão com o Instagram é <strong>opcional</strong> e depende de autorização explícita do titular do perfil, feita na tela de permissões do próprio Instagram. Só é possível conectar contas profissionais (Comercial ou de Criador de conteúdo). Com essa autorização, recebemos, por meio da API oficial da
                Meta:
            </p>
            <ul>
                <li>
                    <strong>Perfil:</strong> identificador da conta, nome de usuário, nome de exibição, tipo de conta, foto de perfil e quantidade de publicações.
                </li>
                <li>
                    <strong>Publicações:</strong> imagens (inclusive as de álbuns/carrossel), legendas, links permanentes, identificadores de mídia e datas de publicação. <strong>Vídeos são ignorados</strong> e não são baixados.
                </li>
                <li>
                    <strong>Token de acesso</strong> emitido pela Meta, guardado no servidor para manter a importação funcionando. Ele nunca é enviado ao navegador nem compartilhado com terceiros.
                </li>
            </ul>
            <p>
                As imagens são copiadas para o nosso provedor de armazenamento porque os endereços do CDN do Instagram expiram em poucas horas. <strong>Não coletamos</strong> mensagens diretas, comentários, seguidores, dados de audiência, informações de pagamento ou qualquer conteúdo privado da conta.
            </p>

            <h3>2.4. Dados técnicos</h3>
            <ul>
                <li>Cookie de sessão (<code>token</code>), estritamente necessário para manter o login. Não usamos cookies de publicidade.</li>
                <li>Endereço IP, usado para limitar tentativas de login e proteger as contas contra ataques.</li>
                <li>Métricas agregadas de uso das páginas, coletadas pelo Vercel Analytics.</li>
            </ul>

            <h2>3. Para que usamos os dados</h2>
            <ul>
                <li>Autenticar o acesso e manter a segurança das contas.</li>
                <li>Executar o monitoramento contratado: localizar usos indevidos de marcas, produtos, logotipos e imagens.</li>
                <li>
                    <strong>No caso do Instagram:</strong> importar as imagens publicadas pelo perfil autorizado e procurar, na internet, <strong>cópias exatas</strong> dessas imagens — o que permite identificar perfis que se passam pela marca ou que revendem produtos usando as fotos originais. Guardamos somente as
                    correspondências localizadas dentro do próprio Instagram, e descartamos as ocorrências do conteúdo do próprio titular.
                </li>
                <li>Enviar notificações de ameaças encontradas e relatórios periódicos de atividade por e-mail.</li>
                <li>Cumprir obrigações legais e regulatórias.</li>
            </ul>
            <p>
                As bases legais aplicáveis são a <strong>execução de contrato</strong> (art. 7º, V da LGPD) para o serviço contratado, o <strong>consentimento</strong> (art. 7º, I) para a conexão com o Instagram, e o <strong>legítimo interesse</strong> (art. 7º, IX) para a segurança da plataforma e a proteção de direitos
                de propriedade intelectual.
            </p>

            <h2>4. Com quem compartilhamos</h2>
            <p>Não vendemos dados pessoais e não os cedemos para fins publicitários. Utilizamos os seguintes provedores, cada um apenas na medida necessária à sua função:</p>
            <ul>
                <li>
                    <strong>Meta Platforms (API do Instagram)</strong> — origem dos dados do perfil autorizado.
                </li>
                <li>
                    <strong>Google Cloud (Vision e Custom Search)</strong> — busca de cópias de imagens e de menções na web.
                </li>
                <li>
                    <strong>Groq</strong> — apoio automatizado na análise de ocorrências e na comparação de logotipos.
                </li>
                <li>
                    <strong>Backblaze B2</strong> — armazenamento das imagens.
                </li>
                <li>
                    <strong>Mailgun</strong> — envio dos e-mails transacionais e dos relatórios.
                </li>
                <li>
                    <strong>Vercel</strong> — hospedagem da interface e métricas agregadas de uso.
                </li>
            </ul>
            <p>Também poderemos compartilhar dados com autoridades quando houver ordem legal ou judicial, ou para o exercício regular de direitos.</p>

            <h2>5. Transferência internacional</h2>
            <p>Parte dos provedores acima está localizada fora do Brasil. Nesses casos, a transferência ocorre com base nas hipóteses do art. 33 da LGPD e nas garantias contratuais oferecidas por cada provedor.</p>

            <h2>6. Por quanto tempo guardamos</h2>
            <ul>
                <li>Dados de conta: enquanto o contrato estiver vigente, e depois pelo prazo necessário ao cumprimento de obrigações legais.</li>
                <li>Ocorrências localizadas: enquanto o ativo monitorado existir na plataforma, por constituírem histórico de prova para eventuais medidas de remoção.</li>
                <li>
                    <strong>Dados do Instagram:</strong> enquanto o perfil permanecer conectado. Ao desconectá-lo, o registro, as publicações importadas, as imagens armazenadas e as ocorrências relacionadas são <strong>excluídos imediatamente</strong>.
                </li>
            </ul>

            <h2>7. Como excluir os dados do Instagram</h2>
            <p>Há três caminhos, e todos resultam em exclusão:</p>
            <ol>
                <li>
                    <strong>Pelo painel:</strong> botão <em>Desconectar</em> na tela de Instagram, que apaga o perfil e tudo que foi importado dele.
                </li>
                <li>
                    <strong>Removendo o app no Instagram:</strong> em Configurações › Aplicativos e sites, ao remover o acesso, o Instagram nos avisa e o perfil deixa de ser importado.
                </li>
                <li>
                    <strong>Pedido de exclusão de dados:</strong> ao solicitar a exclusão pelo Instagram, recebemos o pedido, apagamos os dados na hora e devolvemos um código de confirmação com um endereço onde a situação do pedido pode ser consultada.
                </li>
            </ol>
            <p>
                Você também pode pedir a exclusão diretamente pelo e-mail <strong>info@apexip.com</strong>.
            </p>

            <h2>8. Seus direitos</h2>
            <p>Nos termos da LGPD (Lei nº 13.709/2018), você pode solicitar: confirmação da existência de tratamento; acesso aos dados; correção de dados incompletos ou desatualizados; anonimização, bloqueio ou eliminação de dados desnecessários; portabilidade; informação sobre compartilhamentos; e revogação do consentimento.</p>
            <p>
                Os pedidos devem ser enviados para <strong>info@apexip.com</strong> e são respondidos nos prazos legais.
            </p>

            <h2>9. Segurança</h2>
            <ul>
                <li>Todo o tráfego é cifrado por HTTPS.</li>
                <li>A sessão usa cookie <code>httpOnly</code>, inacessível a scripts do navegador.</li>
                <li>Senhas são armazenadas apenas como hash; tokens de convite e de redefinição, também.</li>
                <li>O token do Instagram e as chaves de integração permanecem no servidor e nunca trafegam para o navegador.</li>
                <li>O acesso aos dados é segregado por empresa: cada acesso de cliente enxerga exclusivamente os dados da própria empresa.</li>
                <li>Há limite de tentativas de login e de recuperação de senha.</li>
            </ul>
            <p>Nenhum sistema é imune a incidentes. Caso ocorra um incidente de segurança relevante, comunicaremos os titulares e a ANPD conforme a legislação.</p>

            <h2>10. Menores de idade</h2>
            <p>A plataforma é destinada a empresas e não se dirige a menores de 18 anos. Não coletamos intencionalmente dados de crianças e adolescentes.</p>

            <h2>11. Alterações desta política</h2>
            <p>Podemos atualizar esta política para refletir mudanças no serviço ou na legislação. A data de última atualização é sempre exibida no topo desta página, e mudanças relevantes são comunicadas aos contratantes.</p>

            <h2>12. Contato</h2>
            <p>
                Dúvidas, solicitações e exercício de direitos: <strong>info@apexip.com</strong>.
            </p>
        </LegalShell>
    );
}
