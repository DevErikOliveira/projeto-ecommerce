/*
Objetivo 1 - quando clicar no botão de adicionar ao carrinho:
    - atualizar o contador
    - adicionar o produto no localStorage
    - atualizar a tabela HTML do carrinho
    parte 1: vamos adicionar +1 no ícone do carrinho
    passo 1 - pegar os botoes de adicionar ao carrinho do html
    passo 2 - adicionar um evento nos botões para ouvir o evento de click (ação)
    passo 3 - pegar as informações do produto clicado e colocar no localStorage
    passo 4 - atualizar o contador do carrinho
    passo 5 - renderizar a tabela do carrinho na tela

Objetivo 2 - remover produtos do carrinho:
    passo 1- ouvir o botão de deletar
    - remover do localStorage
    - atualizar o DOM e o total

Objetivo 3 - atualizar valores do carrinho:
    - ouvir mudanças de quantidade
    - recalcular total individual
    - recalcular total geral
*/

// Objetivo 1 - passo 1:
const botoesAdicionarAoCarrinho = document.querySelectorAll('.adicionar-carrinho');

// Objetivo 1 - passo 2:
botoesAdicionarAoCarrinho.forEach((botao) => {
    botao.addEventListener('click', (evento) => {
        console.log("Botão 'adicionar ao carrinho' clicado!");
        // Objetivo 1 - passo 3:
        const elementoProduto = evento.target.closest(".produto");
        const produtoId = elementoProduto.getAttribute("data-id"); //ou pode ser elementoProduto.dataset.id
        const produtoNome = elementoProduto.querySelector(".nome").textContent;
        const produtoImagem = elementoProduto.querySelector("img").getAttribute("src");
        const produtoPreco = parseFloat(elementoProduto.querySelector(".preco").textContent.replace("R$ ", "").replace(".", "").replace(",", "."));

        //buscar a lista de produtos no localStorage
        const carrinho = obterProdutosDoCarrinho();

        //testar se o produto já existe np carrinho
        const existeProduto = carrinho.find((produto) => produto.id === produtoId);
        //se existe produto, incrementar a quantidade
        if (existeProduto) {
            existeProduto.quantidade += 1;
        } else {
            //se não existe, adicionar o produto com quantidade 1
            const produto = {
                id: produtoId,
                nome: produtoNome,
                imagem: produtoImagem,
                preco: produtoPreco,
                quantidade: 1
            };
            carrinho.push(produto);
        }

        salvarProdutosNoCarrinho(carrinho);
        atualizarContadorCarrinho();
        renderizarTabelaDoCarrinho();
    });

});

function salvarProdutosNoCarrinho(carrinho) {
    localStorage.setItem("carrinho", JSON.stringify(carrinho));
}
function obterProdutosDoCarrinho() {
    const produtos = localStorage.getItem("carrinho");
    return produtos ? JSON.parse(produtos) : [];
}

// passo 4 - atualizar o contador do carrinho de compras
function atualizarContadorCarrinho() {
    const carrinho = obterProdutosDoCarrinho();
    let total = 0;

    carrinho.forEach((produto) => {
        total += produto.quantidade;
    });

    document.getElementById("contador-carrinho").textContent = total;
}

atualizarContadorCarrinho();

// Objetivo 1 - passo 5: renderizar a tabela do carrinho na tela

function renderizarTabelaDoCarrinho() {
    const produtos = obterProdutosDoCarrinho();
    const corpoTabela = document.querySelector("#modal-1-content tbody");

    corpoTabela.innerHTML = ""; // Limpar o conteúdo atual da tabela

    produtos.forEach(produto => {
        const tr = document.createElement("tr");
        tr.innerHTML = `<td class="td-produto"><img src="${produto.imagem}" alt="${produto.nome}">
                        </td>
                        <td>${produto.nome}</td>
                        <td class="td-preco-unitario">R$ ${produto.preco.toFixed(2).replace(".", ",")}</td>
                        <td class="td-quantidade"><input type="number" value="${produto.quantidade}" min="1"></td>
                        <td class="td-subtotal">R$ ${produto.preco.toFixed(2).replace(".", ",")}</td>
                        <td><button id="deletar" class="btn-remover" data-id="${produto.id}"></button></td>`;
        corpoTabela.appendChild(tr);
    });
}

renderizarTabelaDoCarrinho();

//Objetivo 2 - remover produtos do carrinho:
    //passo 1- ouvir o botão de deletar

const corpoTabela = document.querySelector("#modal-1-content table tbody");
corpoTabela.addEventListener("click", evento => {
    if (evento.target.classList.contains('btn-remover')) {
        const id = evento.target.dataset.id;
        removerProdutosDoCarrinho(id);
    }
})

function removerProdutosDoCarrinho(id) {
    const produtos = obterProdutosDoCarrinho();

    //filtra os produtos que não tem o id passado por parametro 
    const carrinhoAtualizado = produtos.filter(produto => produto.id !== id);
    salvarProdutosNoCarrinho(carrinhoAtualizado);
    atualizarContadorCarrinho();
    renderizarTabelaDoCarrinho();
}
