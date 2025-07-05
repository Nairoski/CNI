window.addEventListener("DOMContentLoaded", () => {
  const lista = document.getElementById("notas");
  const filtroTrimestre = document.getElementById("trimestre");
  const filtroDisciplina = document.getElementById("disciplina");

  const regex = /^notas_(.+)_tri(\d+)$/;

  function renderNotas() {
    lista.innerHTML = ""; // limpa a lista

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      const match = key.match(regex);

      if (match) {
        const disciplina = match[1];
        const trimestre = match[2];
        const valor = localStorage.getItem(key);

        const filtroDisc = filtroDisciplina.value;
        const filtroTri = filtroTrimestre.value;

        // Filtragem
        const disciplinaOk = filtroDisc === "none" || filtroDisc === disciplina;
        const trimestreOk = filtroTri === "0" || filtroTri === trimestre;

        if (disciplinaOk && trimestreOk) {
          let notasFormatadas;
          try {
            const obj = JSON.parse(valor);
            notasFormatadas = Object.entries(obj).map(([k, v]) => `${k}: ${v}`).join(' - ');
          } catch (e) {
            notasFormatadas = valor; // se não for JSON
          }

          const li = document.createElement("li");
          li.innerHTML = `
          <div class="_notas">
                <div>
                    <p>
                        <span>${disciplina}</span> - <span>${trimestre}º Trimestre</span>
                    </p>
                    <p>
                        ${notasFormatadas}
                    </p>
                </div>
            </div>
          `;
          lista.appendChild(li);
        }
      }
    }
  }

  // Evento de filtro
  filtroTrimestre.addEventListener("change", renderNotas);
  filtroDisciplina.addEventListener("change", renderNotas);

  // Render inicial
  renderNotas();
});
