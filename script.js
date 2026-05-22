// --- 1. CONFIGURAÇÕES E ESTADOS INICIAIS ---
let crescimento = 0;   // Vai de 0 a 100%
let saude = 100;       // Vai de 0 a 100%
let aguaGasta = 0;     // Contador de sustentabilidade (litros)
let intervaloSimulador;

// Elementos da Interface (DOM)
const sliderTemp = document.getElementById('temp');
const sliderSolo = document.getElementById('solo');
const valTemp = document.getElementById('val-temp');
const valSolo = document.getElementById('val-solo');

const barraCrescimento = document.getElementById('barra-crescimento');
const barraSaude = document.getElementById('barra-saude');
const txtAgua = document.getElementById('agua-gasta');
const txtStatus = document.getElementById('status-mensagem');
const imgPlanta = document.getElementById('imagem-planta');

// --- 2. ATUALIZAÇÃO DOS SLIDERS NA TELA ---
sliderTemp.addEventListener('input', (e) => {
    valTemp.textContent = `${e.target.value}°C`;
});

sliderSolo.addEventListener('input', (e) => {
    valSolo.textContent = `${e.target.value}%`;
});

// --- 3. LÓGICA DO SIMULADOR (O CORAÇÃO DO SCRIPT) ---
function processarCiclo() {
    // Pegar os valores atuais que o aluno definiu nos controles
    const tempAtual = parseInt(sliderTemp.value);
    const soloAtual = parseInt(sliderSolo.value);

    // Contabiliza o gasto de água baseado na umidade do solo escolhida
    if (soloAtual > 0) {
        // Quanto mais alta a umidade do solo, mais água virtual está gastando
        aguaGasta += (soloAtual * 0.1); 
        txtAgua.textContent = aguaGasta.toFixed(1);
    }

    // Regras de Negócio / Condições Ideais para a Hortelã
    const tempIdeal = (tempAtual >= 18 && tempAtual <= 25);
    const soloIdeal = (soloAtual >= 70 && soloAtual <= 85);

    // Verificação das condições
    if (tempIdeal && soloIdeal) {
        // Cenário Perfeito: Planta cresce e saúde melhora (ou se mantém)
        crescimento += 5;
        saude = Math.min(100, saude + 2);
        txtStatus.textContent = "Condições ideais! A hortelã está crescendo forte. 🌱";
        txtStatus.style.color = "#2e7d32";
    } else {
        // Cenário Ruim: Planta sofre estresse
        saude -= 8;
        txtStatus.style.color = "#c62828";

        // Avisos específicos de sustentabilidade/manejo
        if (soloAtual > 85) {
            txtStatus.textContent = "Alerta: Solo encharcado! Risco de apodrecer as raízes e desperdício de água. 💧❌";
        } else if (soloAtual < 70) {
            txtStatus.textContent = "Alerta: Solo muito seco! A hortelã está sofrendo por falta de água. 🏜️";
        } else if (!tempIdeal) {
            txtStatus.textContent = "Alerta: Temperatura fora do ideal para a hortelã (18°C - 25°C). 🌡️";
        }
    }

    // Limitar os valores entre 0 e 100
    crescimento = Math.min(100, Math.max(0, crescimento));
    saude = Math.min(100, Math.max(0, saude));

    // Atualizar as barras visuais
    barraCrescimento.style.width = `${crescimento}%`;
    barraCrescimento.textContent = `${crescimento}%`;
    barraSaude.style.width = `${saude}%`;
    barraSaude.textContent = `${saude}%`;

    // Mudar os estágios visuais da planta
    atualizarEstagioPlanta();

    // Verificar fim de jogo (Vitória ou Derrota)
    verificarFinal();
}

// --- 4. ATUALIZAÇÃO VISUAL DA PLANTA ---
function atualizarEstagioPlanta() {
    if (saude <= 0) {
        imgPlanta.textContent = "💀 Planta Morta (Tente novamente)";
        clearInterval(intervaloSimulador);
    } else if (crescimento >= 100) {
        imgPlanta.textContent = "🎉 Hortelã Pronta para Colheita! Perfeito!";
        clearInterval(intervaloSimulador);
    } else if (crescimento > 70) {
        imgPlanta.textContent = "🌿 Planta Adulta (Quase pronta)";
    } else if (crescimento > 30) {
        imgPlanta.textContent = "🌱 Broto Crescendo";
    } else {
        imgPlanta.textContent = "🫘 Semente na Terra";
    }
}

function verificarFinal() {
    if (crescimento >= 100) {
        txtStatus.innerHTML = `<strong>Sucesso Sustentável!</strong> Você colheu a hortelã gastando ${aguaGasta.toFixed(1)}L de água.`;
    }
    if (saude <= 0) {
        txtStatus.innerHTML = `<strong>A planta não resistiu.</strong> Ajuste os parâmetros para buscar o equilíbrio ecológico.`;
    }
}

// --- 5. INICIALIZAÇÃO O SIMULADOR ---
// Executa a função 'processarCiclo' a cada 2 segundos (2000 milissegundos)
intervaloSimulador = setInterval(processarCiclo, 2000);