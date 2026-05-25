let numerosEscolhidosGlobal = []; 
let numerosJaReservados = []; // Nova lista para bloquear cliques nos números já comprados

// COLOQUE AS SUAS CREDENCIAIS DO FIREBASE AQUI TAMBÉM!
const firebaseConfig = {
    apiKey: "AIzaSyCyR3RtUtKm-PkUaQpZ-rGNRQg7KWrSqak",
    authDomain: "rifa-do-daniel.firebaseapp.com",
    databaseURL: "https://rifa-do-daniel-default-rtdb.firebaseio.com", // Link do seu banco de dados
    projectId: "rifa-do-daniel",
    storageBucket: "rifa-do-daniel.firebasestorage.app",
    messagingSenderId: "668464647151",
    appId: "1:668464647151:web:3285467955304f24f4841a"
};

firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Roda automaticamente para ler os números travados do banco de dados
database.ref('reservas').on('value', (snapshot) => {
    numerosJaReservados = [];
    const dados = snapshot.val();
    
    if (dados) {
        for (let id in dados) { // CORRIGIDO: de 'em' para 'in'
            // Pega os números (ex: "3, 5") e divide de volta em uma lista de números reais
            let nums = dados[id].numeros.toString().split(", ");
            nums.forEach(n => numerosJaReservados.push(parseInt(n)));
        }
    }
    // Redesenha os botões na tela aplicando os travamentos atualizados
    criarNumeros();
});

function criarNumeros() { 
    let caixa = document.getElementById("caixa-numeros");
    caixa.innerHTML = "";

    for (let i = 1; i <= 50; i++) {
        // Verifica se o número já está comprado por alguém
        if (numerosJaReservados.includes(i)) {
            // Cria o botão travado (cinza escuro, sem clique e com estilo desativado)
            caixa.innerHTML += "<button id='btn-" + i + "' class='botao-numero' style='background-color: #3e3e42; color: #75757a; border-color: #3e3e42; cursor: not-allowed;' disabled>" + i + "</button>";
        } else {
            // Cria o botão livre normal
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

    let numerosTexto = numerosEscolhidosGlobal.join(", ");

    // SALVA DIRETO NO FIREBASE (Substituindo o antigo código do Google Planilhas)
    database.ref('reservas').push({
        numeros: numerosTexto,
        nome: nome,
        pix: pix
    })
    .then(() => {
        alert("Obrigado, " + nome + "! Seus números (" + numerosTexto + ") foram travados e reservados com sucesso!");
        document.getElementById("dados-pagamento").style.display = "block";
        numerosEscolhidosGlobal = []; // Limpa a seleção atual
    })
    .catch((erro) => {
        alert("Erro ao salvar dados: " + erro);
    });
}