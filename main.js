let numerosEscolhidosGlobal = []; 
let numerosJaReservados = []; 

const firebaseConfig = {
    apiKey: "AIzaSyCyR3RtUtKm-PkUaQpZ-rGNRQg7KWrSqak",
    authDomain: "rifa-do-daniel.firebaseapp.com",
    databaseURL: "https://rifa-do-daniel-default-rtdb.firebaseio.com", 
    projectId: "rifa-do-daniel",
    storageBucket: "rifa-do-daniel.firebasestorage.app",
    messagingSenderId: "668464647151",
    appId: "1:668464647151:web:3285467955304f24f4841a"
};

firebase.initializeApp(firebaseConfig);
const database = firebase.database();

database.ref('reservas').on('value', (snapshot) => {
    numerosJaReservados = [];
    const dados = snapshot.val();
    
    if (dados) {
        for (let id in dados) { 
            let nums = dados[id].numeros.toString().split(", ");
            nums.forEach(n => numerosJaReservados.push(parseInt(n)));
        }
    }
    criarNumeros();
});

function criarNumeros() { 
    let caixa = document.getElementById("caixa-numeros");
    caixa.innerHTML = "";

    for (let i = 1; i <= 50; i++) {
        if (numerosJaReservados.includes(i)) {
            caixa.innerHTML += "<button id='btn-" + i + "' class='botao-numero' style='background-color: #3e3e42; color: #75757a; border-color: #3e3e42; cursor: not-allowed;' disabled>" + i + "</button>";
        } else {
            caixa.innerHTML += "<button id='btn-" + i + "' class='botao-numero' onclick='escolherNumero(" + i + ")'>" + i + "</button>";
        }
    }
}

function escolherNumero(numero) {
    let botaoClicado = document.getElementById("btn-" + numero);
    let posicao = numerosEscolhidosGlobal.indexOf(numero);

    if (posicao === -1) {
        numerosEscolhidosGlobal.push(numero);
        botaoClicado.style.backgroundColor = "#08cf23";
        botaoClicado.style.color = "white";
    } else {
        numerosEscolhidosGlobal.splice(posicao, 1);
        botaoClicado.style.backgroundColor = "#202024";
        botaoClicado.style.color = "#08cf23";
    }
    
    if (numerosEscolhidosGlobal.length > 0) {
        numerosEscolhidosGlobal.sort((a, b) => a - b);
        document.getElementById("numero-selecionado").innerText = numerosEscolhidosGlobal.join(", ");
        document.getElementById("dados-pagamento").style.display = "none";
        document.getElementById("painel-cadastro").style.display = "block";
    } else {
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

    if (numerosEscolhidosGlobal.length === 0) {
        alert("Por favor, selecione pelo menos um número antes de confirmar!");
        return;
    }

    let numerosTexto = numerosEscolhidosGlobal.join(", ");

    database.ref('reservas').push({
        numeros: numerosTexto,
        nome: nome,
        pix: pix
    })
    .then(() => {
        alert("Obrigado, " + nome + "! Seus números (" + numerosTexto + ") foram reservados com sucesso!");
        document.getElementById("dados-pagamento").style.display = "block";
    })
    .catch((erro) => {
        alert("Erro ao salvar dados: " + erro);
    });
}