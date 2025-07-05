const disciplinas = ["matematica", "portugues", "historia", "ciencias"];
const campos = ["escrita", "pratica", "participacao", "simulado"];
const maximos = { escrita: 3, pratica: 2, participacao: 2, simulado: 3 };

window.addEventListener("DOMContentLoaded", () => {
    campos.forEach((campo) => {
        document.getElementById(campo).addEventListener("input", atualizarTotal);
    });

    document.getElementById("notaForm").addEventListener("submit", function (event) {
        event.preventDefault();
        const disciplina = document.getElementById("disciplina").value;
        const trimestre = document.getElementById("trimestre").value;
        if (!validarNotas()) return;
        salvarNotas(disciplina, trimestre);
        mostrarMensagem(`Notas salvas para ${capitalize(disciplina)} - ${trimestre}º trimestre!`);
    });

    document.getElementById("disciplina").addEventListener("change", function () {
        const trimestre = document.getElementById("trimestre").value;
        carregarNotas(this.value);
    });

    document.getElementById("trimestre").addEventListener("change", function () {
        const disciplina = document.getElementById("disciplina").value;
        carregarNotas(disciplina, this.value)
    })

    window.editarNotas = function (disciplina, trimestre) {
        document.getElementById("disciplina").value = disciplina;
        document.getElementById("trimestre").value = trimestre;
        carregarNotas(disciplina, trimestre);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    window.apagarNotas = function (disciplina, trimestre) {
        if (confirm(`Deseja realmente apagar as notas de ${capitalize(disciplina)} - ${trimestre}º trimestre?`)) {
            const chave = getChaveNota(disciplina, trimestre);
            localStorage.removeItem(chave);
            atualizarHistorico();
            mostrarMensagem(`Notas apagadas para ${capitalize(disciplina)} - ${trimestre}º trimestre.`);
            if (
                document.getElementById("disciplina").value === disciplina &&
                document.getElementById("trimestre").value === trimestre
            ) {
                carregarNotas(disciplina, trimestre)
            }
        }
    };

    window.limparTodasNotas = function () {
        if (confirm("Deseja realmente apagar TODAS as notas?")) {
            disciplinas.forEach((disciplina) => {
                [1, 2, 3].forEach((trimestre) => {
                    const chave = getChaveNota(disciplina, trimestre);
                    localStorage.removeItem(chave);
                });
            });

            atualizarHistorico();
            mostrarMensagem("Todas as notas foram apagadas.");

            const disciplina = document.getElementById("disciplina").value;
            const trimestre = document.getElementById("trimestre").value;
            carregarNotas(disciplina, trimestre);
        }
    };

    window.onload = function () {
        const disciplina = document.getElementById("disciplina").value;
        const trimestre = document.getElementById("trimestre").value;
        carregarNotas(disciplina, trimestre);
        atualizarHistorico();
    };


})

function getChaveNota(disciplina, trimestre) {
    return `notas_${disciplina}_tri${trimestre}`;
}

function atualizarTotal() {
  const escrita = parseFloat(document.getElementById("escrita").value) || 0;
  const pratica = parseFloat(document.getElementById("pratica").value) || 0;
  const participacao = parseFloat(document.getElementById("participacao").value) || 0;
  const simulado = parseFloat(document.getElementById("simulado").value) || 0;
  const total = escrita + pratica + participacao + simulado;
  const falta = Math.max(0, 7 - total);
  document.getElementById("total").textContent = `Total: ${total.toFixed(1)} / 10 - Faltam ${falta.toFixed(1)} pontos`;
}

function salvarNotas(disciplina, trimestre) {
  const notas = {};
  campos.forEach((campo) => {
    notas[campo] = document.getElementById(campo).value;
  });
  const chave = getChaveNota(disciplina, trimestre);
  localStorage.setItem(chave, JSON.stringify(notas));
  atualizarHistorico();
}

function carregarNotas(disciplina, trimestre) {
  const chave = getChaveNota(disciplina, trimestre);
  const notasSalvas = localStorage.getItem(chave);
  if (notasSalvas) {
    const notas = JSON.parse(notasSalvas);
    campos.forEach((campo) => {
      document.getElementById(campo).value = notas[campo] || "";
    });
  } else {
    campos.forEach((campo) => {
      document.getElementById(campo).value = "";
    });
  }
  atualizarTotal();
}

function atualizarHistorico() {
    const ul = document.getElementById("historicoBody");
    ul.innerHTML = "";
    disciplinas.forEach((disciplina) => {
        [1, 2, 3].forEach((trimestre) => {
            const chave = getChaveNota(disciplina, trimestre);
            const notasSalvas = localStorage.getItem(chave);
            if (notasSalvas) {
                const notas = JSON.parse(notasSalvas);
                const total =
                    (parseFloat(notas.escrita) || 0) +
                    (parseFloat(notas.pratica) || 0) +
                    (parseFloat(notas.participacao) || 0) +
                    (parseFloat(notas.simulado) || 0);
                const falta = Math.max(0, 7 - total);

                const li = document.createElement("li");
                li.innerHTML = `
                    <strong>${capitalize(disciplina)} - ${trimestre}º trimestre</strong><br>
                    Escrita: ${notas.escrita || "-"}, 
                    Prática: ${notas.pratica || "-"}, 
                    Participação: ${notas.participacao || "-"}, 
                    Simulado: ${notas.simulado || "-"}<br>
                    Total: ${total.toFixed(1)} / 10 — Faltam ${falta.toFixed(1)} pontos
                    <br>
                    <button onclick="editarNotas('${disciplina}', ${trimestre})">Editar</button>
                    <button onclick="apagarNotas('${disciplina}', ${trimestre})">Apagar</button>
                `;
                ul.appendChild(li);
            }
        });
    });

    if (ul.innerHTML === "") {
        ul.innerHTML = `<li>Nenhuma nota salva ainda.</li>`;
    }
}


function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}



function mostrarMensagem(msg) {
  const section = document.getElementById("msg");
  section.textContent = msg;
  setTimeout(() => {
    section.textContent = "";
  }, 2500);
}

function validarNotas() {
  for (let campo of campos) {
    const valor = parseFloat(document.getElementById(campo).value);
    if (isNaN(valor) || valor < 0 || valor > maximos[campo]) {
      mostrarMensagem(`O valor de "${capitalize(campo)}" deve ser entre 0 e ${maximos[campo]}`);
      return false;
    }
  }
  return true;
}
