let numeroEscolhidoGlobal = 0;

const LINK_DO_GOOGLE = "https://script.google.com/macros/s/AKfycbx1LqTnf5sCTtp9i7CszCOiz-cPRT6JIOLIiD27gwJH6YWbbJY6fzQvahWEtE6bUTEQ/exec";

function criarNumeros() { 
    let caixa = document.getElementById("caixa-numeros");
    caixa.innerHTML = "";

    for (let i = 1; i <= 50; i++) {
        caixa.innerHTML += "<button class='botao-numero' onclick='escolherNumero(" + i + ")'>" + i + "</button>";
    }
}

function escolherNumero(numero) {
    let botaoClicado = event.target;
    
    botaoClicado.style.backgroundColor = "#08cf23";
    botaoClicado.style.color = "white";
    
    numeroEscolhidoGlobal = numero; 
    
    document.getElementById("numero-selecionado").innerText = numero;
    document.getElementById("nome-cliente").value = "";
    document.getElementById("pix-cliente").value = "";
    document.getElementById("dados-pagamento").style.display = "none";
    
    document.getElementById("painel-cadastro").style.display = "block";
}

function confirmarReserva() {
    let nome = document.getElementById("nome-cliente").value;
    let pix = document.getElementById("pix-cliente").value;

    if (nome == "" || pix == "") {
        alert("Por favor, preencha o seu Nome e a sua Chave Pix para continuar!");
        return;
    }

    // --- MÁGICA DA PLANILHA AQUI ---
    // Prepara os dados para enviar pro Google
    let dadosParaEnviar = {
        numero: numeroEscolhidoGlobal,
        nome: nome,
        pix: pix
    };

    // Envia os dados de forma invisível para a sua planilha
    fetch(LINK_DO_GOOGLE, {
        method: "POST",
        body: JSON.stringify(dadosParaEnviar)
    })
    .then(resposta => {
        alert("Obrigado, " + nome + "! Seu número " + numeroEscolhidoGlobal + " foi salvo na nossa lista. Agora faça o pagamento abaixo.");
        document.getElementById("dados-pagamento").style.display = "block";
    })
    .catch(erro => {
        alert("Ops, houve um erro ao salvar. Tente novamente.");
        console.error(erro);
    });
}