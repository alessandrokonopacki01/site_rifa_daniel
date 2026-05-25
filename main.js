let numeroEscolhidoGlobal = 0;

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

    alert("Obrigado, " + nome + "! Seu número " + numeroEscolhidoGlobal + " foi pré-reservado. Agora faça o pagamento abaixo.");

    document.getElementById("dados-pagamento").style.display = "block";
}