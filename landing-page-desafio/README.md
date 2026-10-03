# Landing page — Desafio Seu Negócio no Digital

Página estática em HTML, CSS e JavaScript. Não exige instalação de dependências ou etapa de compilação.

## Abrir no VS Code

Abra esta pasta no VS Code. O arquivo principal é `index.html`.

Para visualizar, abra `index.html` no navegador ou use um servidor local, como a extensão Live Server, caso já esteja instalada. Também funciona com `python -m http.server 5500 --bind 127.0.0.1` executado nesta pasta.

## Arquivos

- `index.html`: conteúdo, oferta de R$37, navegação e perguntas frequentes.
- `styles.css`: cores, tipografia e layout para celular e computador.
- `main.js`: menu de navegação no celular.
- `config.js`: endereço do checkout da Kiwify.
- `assets/mockup-ebook.png`: mockup fornecido no projeto.
- `assets/favicon.svg`: ícone do site.

## Compra

O pagamento será realizado pelo checkout da Kiwify. Insira o endereço real deste produto na variável `CHECKOUT_URL` de `config.js`.

O checkout fornecido já está configurado: https://pay.kiwify.com.br/3Vut15T. O mesmo endereço está no HTML para a compra funcionar também sem JavaScript; em uma alteração futura, atualize os dois arquivos.

Enquanto o endereço não estiver definido, o botão mostra “Vendas em breve” e não inicia uma compra. Quando receber um endereço HTTPS válido da Kiwify, o botão será ativado e exibirá “Comprar pela Kiwify”.

Os links de contato do rodapé continuam no WhatsApp da A-nfc: https://wa.me/message/HHMYTHKZZHEPG1. Não há pagamento, envio automático ou garantia comercial simulados. Configure o checkout e confira as condições de venda antes de publicar.

## Publicação

Envie o conteúdo desta pasta para uma hospedagem de sites estáticos, preservando o diretório `assets`. Nenhuma publicação foi realizada nesta tarefa.

As fontes DM Sans e Manrope são carregadas pelo Google Fonts. Se estiver offline, a página usa fontes locais de substituição.
