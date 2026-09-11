async function getAllChapters() {
  const response = await fetch("data/chapters.json");
  const jsonChapters = await response.json();

  const localChapters = JSON.parse(
    localStorage.getItem("velvetchapters-chapters") || "[]"
  ).map(chapter => ({
    ...chapter,
    isLocal: true
  }));

  return [...jsonChapters, ...localChapters]
    .sort((a, b) => Number(a.number ?? a.id) - Number(b.number ?? b.id));
}

async function loadChapter() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  const chapters = await getAllChapters();

  const index = chapters.findIndex(
    chapter => String(chapter.id) === String(id)
  );

  const chapter = chapters[index];

  if (!chapter) {
    document.querySelector("#reader").innerHTML =
      "<h1>Chapitre introuvable</h1>";
    return;
  }

  document.title = `${chapter.title} — VelvetChapters`;

  const editLink = document.querySelector("#edit-chapter-link");

  if (chapter.isLocal) {
    editLink.href =
      `editor.html?id=${encodeURIComponent(chapter.id)}`;
  } else {
    editLink.style.display = "none";
  }

  document.querySelector("#reader").innerHTML = `
    <p class="eyebrow">
      Chapitre ${chapter.number ?? chapter.id}
    </p>

    ${chapter.isLocal ? `
      <span class="local-badge">
        Local uniquement — non publié
      </span>
    ` : ""}

    <h1>${chapter.title}</h1>

    <p class="chapter-date">
      ${chapter.date || ""}
    </p>

    ${chapter.content
      .map(paragraph => `<p>${paragraph}</p>`)
      .join("")}
  `;

  const prev = document.querySelector("#prev-chapter");
  const next = document.querySelector("#next-chapter");

  prev.disabled = index <= 0;
  next.disabled = index >= chapters.length - 1;

  prev.addEventListener("click", () => {
    if (index > 0) {
      window.location.href =
        `reader.html?id=${encodeURIComponent(
          chapters[index - 1].id
        )}`;
    }
  });

  next.addEventListener("click", () => {
    if (index < chapters.length - 1) {
      window.location.href =
        `reader.html?id=${encodeURIComponent(
          chapters[index + 1].id
        )}`;
    }
  });
}

loadChapter();