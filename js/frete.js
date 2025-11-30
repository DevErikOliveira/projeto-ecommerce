async function calcularFrete() {
  const cep = document.getElementById("input-cep").value.trim();

  if (!cep) {
    alert("Por favor, digite um CEP válido.");
    return;
  }

  try {
    const response = await fetch("https://erikteste1.app.n8n.cloud/webhook/03820723-f073-4036-a17b-b8dc7a9ade84", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // No navegador User-Agent é bloqueado:
        "X-User-Agent": "EcommerceDoErik/1.0(negocios.erik@gmail.com)"
      },
      body: JSON.stringify({
        cep: cep,
        products: JSON.parse(localStorage.getItem("carrinho")) || []
      })
    });

    const data = await response.json();
    console.log("Resposta do N8N:", data);

    // Aqui você pega o valor retornado pelo n8n e coloca na tela
    document.querySelector("#valor-frete .valor").textContent =
      `R$ ${data.frete.toFixed(2).replace(".", ",")}`;

  } catch (error) {
    console.error("Erro ao calcular frete:", error);
    alert("Erro ao calcular o frete.");
  }
}

document.getElementById("btn-calcular-frete").addEventListener("click", calcularFrete);
