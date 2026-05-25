// Agora é uma lista (Array) para guardar vários números ao mesmo tempo
let numerosEscolhidosGlobal = []; 

const LINK_DO_GOOGLE = "https://script.google.com/macros/s/AKfycbx1LqTnf5sCTtp9i7CszCOiz-cPRT6JIOLIiD27gwJH6YWbbJY6fzQvahWEtE6bUTEQ/exec"; // Lembre de manter o seu link aqui!

function criarNumeros() { 
    let caixa = document.getElementById("caixa-numeros");
    caixa.innerHTML = "";

    for (let i = 1; i <= 50; i++) {
        caixa.innerHTML += "<button id='btn-" + i + "' class='botao-numero' onclick='escolherNumero(" + i + ")'>" + i + "</button>";
    }
}

function escolherNumero(numero) {
    let botaoClicado = document.getElementById("btn-" + numero);
    
    // Verifica se o número já estava na lista (caso a pessoa queira desmarcar)
    let posicao = numerosEscolhidosGlobal.indexOf(numero);

    if (posicao === -1) {
        // Se NÃO estava na lista: adiciona o número e pinta de verde
        numerosEscolhidosGlobal.push(numero);
        botaoClicado.style.backgroundColor = "#08cf23";
        botaoClicado.style.color = "white";
    } else {
        // Se JÁ estava na lista: remove o número e volta para a cor original
        numerosEscolhidosGlobal.splice(posicao, 1);
        botaoClicado.style.backgroundColor = "#202024";
        botaoClicado.style.color = "#08cf23";
    }
    
    // Se a pessoa tiver pelo menos 1 número selecionado, mostra o painel de cadastro
    if (numerosEscolhidosGlobal.length > 0) {
        // Organiza os números em ordem crescente para mostrar na tela (ex: 2, 5, 12)
        numerosEscolhidosGlobal.sort((a, b) => a - b);
        document.getElementById("numero-selecionado").innerText = numerosEscolhidosGlobal.join(", ");
        
        // Esconde a área de pagamento antiga caso ela estivesse aberta
        document.getElementById("dados-pagamento").style.display = "none";
        document.getElementById("painel-cadastro").style.display = "block";
    } else {
        // Se não tiver nenhum número selecionado, esconde o painel
        document.getElementById("painel-cadastro").style.display = "none";
    }
}

function confirmarReserva() {
    let nome = document.getElementById("nome-cliente").value;
    let pix = document.getElementById("pix-cliente").value;

    if (nome == "" || pix == "") {
        alert("Por favor, preencha o seu Nome e a sua Chave Pix para continuar!");
        return;
    }

    // Transforma a lista de números em um texto bonito separado por vírgulas para a planilha
    let numerosTexto = numerosEscolhidosGlobal.join(", ");

    let dadosParaEnviar = {
        numero: numerosTexto, // Envia todos os números juntos (Ex: "3, 7, 10")
        nome: nome,
        pix: pix
    };

    fetch(LINK_DO_GOOGLE, {
        method: "POST",
        body: JSON.stringify(dadosParaEnviar)
    })
    .then(resposta => {
        alert("Obrigado, " + nome + "! Seus números (" + numerosTexto + ") foram salvos na nossa lista. Agora faça o pagamento abaixo.");
        document.getElementById("dados-pagamento").style.display = "block";
    })
    .catch(erro => {
        alert("Ops, houve um erro ao salvar. Tente novamente.");
        console.error(erro);
    });
}