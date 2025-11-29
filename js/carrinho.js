// ==================================
// Funções Utilitárias para o Carrinho
// ==================================

/**
 * Obtém os produtos do carrinho armazenados no localStorage.
 * @returns {Array} A lista de produtos no carrinho.
 */
function obterProdutosDoCarrinho() {
    const produtos = localStorage.getItem("carrinho");
    return produtos ? JSON.parse(produtos) : [];
}

/**
 * Salva a lista de produtos no localStorage.
 * @param {Array} carrinho - A lista de produtos a ser salva.
 */
function salvarProdutosNoCarrinho(carrinho) {
    localStorage.setItem("carrinho", JSON.stringify(carrinho));
}

/**
 * Atualiza o contador de itens no ícone do carrinho.
 */
function atualizarContadorCarrinho() {
    const carrinho = obterProdutosDoCarrinho();
    const total = carrinho.reduce((soma, produto) => soma + produto.quantidade, 0);
    const contador = document.getElementById("contador-carrinho");
    if (contador) {
        contador.textContent = total;
    }
}

/**
 * Renderiza as linhas da tabela de produtos no modal do carrinho.
 */
function renderizarTabelaDoCarrinho() {
    const produtos = obterProdutosDoCarrinho();
    const corpoTabela = document.querySelector("#modal-1-content tbody");
    if (!corpoTabela) return;

    corpoTabela.innerHTML = ""; // Limpa a tabela antes de renderizar

    produtos.forEach(produto => {
        const tr = document.createElement("tr");
        tr.dataset.id = produto.id; // Adiciona data-id à linha para referência

        tr.innerHTML = `
            <td class="td-produto">
                <img src="${produto.imagem}" alt="${produto.nome}">
            </td>
            <td>${produto.nome}</td>
            <td class="td-preco-unitario">R$ ${produto.preco.toFixed(2).replace(".", ",")}</td>
            <td class="td-quantidade">
                <input type="number" class="input-quantidade" value="${produto.quantidade}" min="1">
            </td>
            <td class="td-subtotal">R$ ${(produto.preco * produto.quantidade).toFixed(2).replace(".", ",")}</td>
            <td>
                <button class="btn-remover" title="Remover produto">
                    <img src="./assets/images/icone_deletar.svg" alt="Remover">
                </button>
            </td>
        `;
        corpoTabela.appendChild(tr);
    });
}

/**
 * Atualiza o valor total exibido no rodapé do carrinho.
 */
function atualizarValorTotalDoCarrinho() {
    const produtos = obterProdutosDoCarrinho();
    const total = produtos.reduce((soma, produto) => soma + produto.preco * produto.quantidade, 0);
    const totalEl = document.getElementById("total-carrinho");
    // TODO: Adicionar lógica de frete aqui se necessário no futuro.
    if (totalEl) {
        totalEl.textContent = `Total: R$ ${total.toFixed(2).replace(".", ",")}`;
    }
}

/**
 * Função principal que atualiza o estado completo do carrinho (contador, tabela e total).
 */
function atualizarCarrinhoETabela() {
    const carrinho = obterProdutosDoCarrinho();
    const containerPreco = document.querySelector(".container-preco");

    if(carrinho.length === 0){
        containerPreco.style.display = "none";
    } else {
        containerPreco.style.display = "flex";
    }

    atualizarContadorCarrinho();
    renderizarTabelaDoCarrinho();
    atualizarValorTotalDoCarrinho();
}

/**
 * Adiciona um produto ao carrinho. Se o produto já existir, incrementa a quantidade.
 * @param {HTMLElement} elementoProduto - O elemento HTML do produto a ser adicionado.
 */
function adicionarProdutoAoCarrinho(elementoProduto) {
    const produtoId = elementoProduto.dataset.id;
    const produtoNome = elementoProduto.querySelector(".nome").textContent;
    const produtoImagem = elementoProduto.querySelector("img").src;
    const produtoPreco = parseFloat(elementoProduto.querySelector(".preco").textContent.replace("R$ ", "").replace(",", "."));

    const carrinho = obterProdutosDoCarrinho();
    const produtoExistente = carrinho.find(p => p.id === produtoId);

    if (produtoExistente) {
        produtoExistente.quantidade++;
    } else {
        carrinho.push({
            id: produtoId,
            nome: produtoNome,
            imagem: produtoImagem,
            preco: produtoPreco,
            quantidade: 1,
        });
    }

    salvarProdutosNoCarrinho(carrinho);
    atualizarCarrinhoETabela();
}

/**
 * Remove um produto do carrinho com base no seu ID.
 * @param {string} produtoId - O ID do produto a ser removido.
 */
function removerProdutoDoCarrinho(produtoId) {
    const carrinho = obterProdutosDoCarrinho();
    const carrinhoAtualizado = carrinho.filter(produto => produto.id !== produtoId);
    salvarProdutosNoCarrinho(carrinhoAtualizado);
    atualizarCarrinhoETabela();
}

/**
 * Altera a quantidade de um produto no carrinho.
 * @param {string} produtoId - O ID do produto a ser atualizado.
 * @param {number} novaQuantidade - A nova quantidade do produto.
 */
function atualizarQuantidadeDoProduto(produtoId, novaQuantidade) {
    const carrinho = obterProdutosDoCarrinho();
    const produto = carrinho.find(p => p.id === produtoId);

    if (produto) {
        produto.quantidade = Math.max(1, novaQuantidade); // Garante que a quantidade não seja menor que 1
        salvarProdutosNoCarrinho(carrinho);
        atualizarCarrinhoETabela();
    }
}


// ==================================
// Event Listeners
// ==================================

// Adiciona evento de clique para todos os botões "Adicionar ao Carrinho"
document.querySelectorAll('.adicionar-carrinho').forEach(botao => {
    botao.addEventListener('click', (evento) => {
        const elementoProduto = evento.target.closest(".produto");
        if (elementoProduto) {
            adicionarProdutoAoCarrinho(elementoProduto);
        }
    });
});

// Adiciona eventos de clique e input na tabela do carrinho para delegação de eventos
const corpoTabelaCarrinho = document.querySelector("#modal-1-content tbody");
if (corpoTabelaCarrinho) {
    corpoTabelaCarrinho.addEventListener('click', (evento) => {
        const botaoRemover = evento.target.closest('.btn-remover');
        if (botaoRemover) {
            const linhaProduto = botaoRemover.closest('tr');
            if (linhaProduto) {
                removerProdutoDoCarrinho(linhaProduto.dataset.id);
            }
        }
    });

    corpoTabelaCarrinho.addEventListener('input', (evento) => {
        const inputQuantidade = evento.target.closest('.input-quantidade');
        if (inputQuantidade) {
            const linhaProduto = inputQuantidade.closest('tr');
            const novaQuantidade = parseInt(inputQuantidade.value, 10);
            if (linhaProduto && !isNaN(novaQuantidade)) {
                atualizarQuantidadeDoProduto(linhaProduto.dataset.id, novaQuantidade);
            }
        }
    });
}

// Inicializa o carrinho ao carregar a página para refletir o estado do localStorage
document.addEventListener('DOMContentLoaded', atualizarCarrinhoETabela);