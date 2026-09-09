async function getAllChapters() {
  const response = await fetch("data/chapters.json");
  const jsonChapters = await response.json();

  const localChapters = JSON.parse(
    localStorage.getItem("velvetchapters-chapters") || "[]"
  );

  return [...jsonChapters, ...localChapters]
    .sort((a, b) => Number(a.number ?? a.id) - Number(b.number ?? b.id));
}

async function loadChapters() {
  const list = document.querySelector("#chapter-list");

  try {
    const chapters = await getAllChapters();

    if (chapters.length === 0) {
      list.innerHTML = "<p>Aucun chapitre pour le moment.</p>";
      return;
    }

    list.innerHTML = chapters.map(chapter => `
      <a class="chapter-card" href="reader.html?id=${encodeURIComponent(chapter.id)}">
        <p class="eyebrow">Chapitre ${chapter.number ?? chapter.id}</p>
        <h3>${chapter.title}</h3>
        <p>${chapter.summary || "Lire le chapitre"}</p>
      </a>
    `).join("");
  } catch (error) {
    list.innerHTML = "<p>Impossible de charger les chapitres.</p>";
    console.error(error);
  }
}

loadChapters();
