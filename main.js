let numerosEscolhidosGlobal = []; 
let numerosJaReservados = []; 
// NOVA: Controla se o usuário já clicou no botão para ver os números
let podeExibirNumeros = false; 

const firebaseConfig = {
    apiKey: "AIzaSyBqa9iW7CbFCB9_zUyewz39VBOT8VXBMJE",
    authDomain: "rifa-c3b6a.firebaseapp.com",
    databaseURL: "https://rifa-c3b6a-default-rtdb.firebaseio.com",
    projectId: "rifa-c3b6a",
    storageBucket: "rifa-c3b6a.firebasestorage.app",
    messagingSenderId: "780073569218",
    appId: "1:780073569218:web:80002a5e3c05a6803e245b",
    measurementId: "G-LPK09JQ8RF"
};

firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Escuta o banco de dados em tempo real
database.ref('reservas').on('value', (snapshot) => {
    numerosJaReservados = [];
    const dados = snapshot.val();
    
    if (dados) {
        for (let id in dados) { 
            let nums = dados[id].numeros.toString().split(", ");
            nums.forEach(n => numerosJaReservados.push(parseInt(n)));
        }
    }
    
    // SÓ desenha na tela se o usuário já tiver clicado no botão antes
    if (podeExibirNumeros) {
        criarNumeros();
    }
});

// NOVA FUNÇÃO: Chamada pelo clique do botão principal
function permitirExibicao() {
    podeExibirNumeros = true;
    criarNumeros(); // renderiza os números imediatamente
}

function criarNumeros() { 
    let caixa = document.getElementById("caixa-numeros");
    caixa.innerHTML = "";

    for (let i = 1; i <= 50; i++) {
        if (numerosJaReservados.includes(i)) {
            caixa.innerHTML += "<button id='btn-" + i + "' class='botao-numero' style='background-color: #3e3e42; color: #75757a; border-color: #3e3e42; cursor: not-allowed;' disabled>" + i + "</button>";
        } else {
            // Mantém a cor verde caso o número já estivesse selecionado na sessão atual
            if (numerosEscolhidosGlobal.includes(i)) {
                caixa.innerHTML += "<button id='btn-" + i + "' class='botao-numero' style='background-color: #08cf23; color: white;' onclick='escolherNumero(" + i + ")'>" + i + "</button>";
            } else {
                caixa.innerHTML += "<button id='btn-" + i + "' class='botao-numero' onclick='escolherNumero(" + i + ")'>" + i + "</button>";
            }
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
    let nome = document.getElementById("nome-cliente").value.trim();
    let pix = document.getElementById("pix-cliente").value.trim();

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
        numerosEscolhidosGlobal = []; // Limpa seleção atual após sucesso
    })
    .catch((erro) => {
        alert("Erro ao salvar dados: " + erro);
    });
}