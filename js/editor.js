const editingIdInput = document.querySelector("#editing-id");
const numberInput = document.querySelector("#chapter-number");
const titleInput = document.querySelector("#chapter-title");
const contentInput = document.querySelector("#chapter-content");
const status = document.querySelector("#editor-status");
const saveButton = document.querySelector("#save-chapter");
const cancelButton = document.querySelector("#cancel-edit");
const localList = document.querySelector("#local-chapter-list");
const modeLabel = document.querySelector("#editor-mode-label");
const editorTitle = document.querySelector("#editor-title");

function getLocalChapters() {
  return JSON.parse(localStorage.getItem("velvetchapters-chapters") || "[]");
}

function saveLocalChapters(chapters) {
  localStorage.setItem("velvetchapters-chapters", JSON.stringify(chapters));
}

function resetEditor() {
  editingIdInput.value = "";
  numberInput.value = "";
  titleInput.value = "";
  contentInput.value = "";
  modeLabel.textContent = "Nouveau chapitre";
  editorTitle.textContent = "Écrire";
  saveButton.textContent = "Sauvegarder le chapitre";
  cancelButton.hidden = true;
}

function renderLocalChapters() {
  const chapters = getLocalChapters()
    .sort((a, b) => Number(a.number ?? a.id) - Number(b.number ?? b.id));

  if (chapters.length === 0) {
    localList.innerHTML = '<p class="helper-text">Aucun chapitre local pour le moment.</p>';
    return;
  }

  localList.innerHTML = chapters.map(chapter => `
    <article class="local-chapter-item">
      <div>
        <p class="eyebrow">Chapitre ${chapter.number ?? chapter.id}</p>
        <h3>${chapter.title}</h3>
      </div>
      <div class="local-actions">
        <button type="button" class="edit-chapter" data-id="${chapter.id}">Modifier</button>
        <button type="button" class="delete-chapter secondary-button" data-id="${chapter.id}">Supprimer</button>
      </div>
    </article>
  `).join("");

  document.querySelectorAll(".edit-chapter").forEach(button => {
    button.addEventListener("click", () => startEdit(button.dataset.id));
  });

  document.querySelectorAll(".delete-chapter").forEach(button => {
    button.addEventListener("click", () => deleteChapter(button.dataset.id));
  });
}

function startEdit(id) {
  const chapters = getLocalChapters();
  const chapter = chapters.find(ch => String(ch.id) === String(id));

  if (!chapter) return;

  editingIdInput.value = chapter.id;

  // Pour les anciens chapitres créés avec l'ancienne version,
  // le numéro pouvait être stocké dans "id" (ex : 100).
  numberInput.value = chapter.number ?? chapter.id ?? "";
  titleInput.value = chapter.title ?? "";
  contentInput.value = Array.isArray(chapter.content)
    ? chapter.content.join("\n\n")
    : (chapter.content ?? "");

  modeLabel.textContent = "Modification";
  editorTitle.textContent = `Modifier le chapitre ${chapter.number ?? chapter.id}`;
  saveButton.textContent = "Enregistrer les modifications";
  cancelButton.hidden = false;
  status.textContent = "Tu peux maintenant corriger le numéro, le titre ou le texte.";

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function deleteChapter(id) {
  const chapters = getLocalChapters();
  const chapter = chapters.find(ch => String(ch.id) === String(id));
  if (!chapter) return;

  const ok = confirm(`Supprimer "${chapter.title}" ?`);
  if (!ok) return;

  const updated = chapters.filter(ch => String(ch.id) !== String(id));
  saveLocalChapters(updated);

  if (String(editingIdInput.value) === String(id)) {
    resetEditor();
  }

  status.textContent = "Chapitre supprimé.";
  renderLocalChapters();
}

saveButton.addEventListener("click", () => {
  const chapterNumber = Number(numberInput.value);
  const title = titleInput.value.trim();
  const content = contentInput.value.trim();
  const editingId = editingIdInput.value;

  if (!chapterNumber || !title || !content) {
    status.textContent = "Ajoute un numéro, un titre et du contenu.";
    return;
  }

  const chapters = getLocalChapters();

  const duplicateNumber = chapters.some(chapter =>
    Number(chapter.number ?? chapter.id) === chapterNumber &&
    String(chapter.id) !== String(editingId)
  );

  if (duplicateNumber) {
    status.textContent = `Le chapitre ${chapterNumber} existe déjà dans les chapitres locaux.`;
    return;
  }

  const contentParagraphs = content
    .split(/\n\s*\n/)
    .map(paragraph => paragraph.trim())
    .filter(Boolean);

  if (editingId) {
    const index = chapters.findIndex(chapter => String(chapter.id) === String(editingId));

    if (index === -1) {
      status.textContent = "Impossible de retrouver ce chapitre.";
      return;
    }

    chapters[index] = {
      ...chapters[index],
      number: chapterNumber,
      title,
      content: contentParagraphs,
      date: chapters[index].date || new Date().toISOString().slice(0, 10)
    };

    saveLocalChapters(chapters);
    status.textContent = `Chapitre ${chapterNumber} modifié.`;
  } else {
    const newChapter = {
      id: `local-${Date.now()}`,
      number: chapterNumber,
      title,
      date: new Date().toISOString().slice(0, 10),
      summary: "Chapitre créé depuis l’éditeur.",
      content: contentParagraphs
    };

    chapters.push(newChapter);
    saveLocalChapters(chapters);
    status.textContent = `Chapitre ${chapterNumber} sauvegardé. Il apparaît maintenant dans le sommaire.`;
  }

  resetEditor();
  renderLocalChapters();
});

cancelButton.addEventListener("click", () => {
  resetEditor();
  status.textContent = "Modification annulée.";
});

document.querySelector("#export-json").addEventListener("click", () => {
  const chapters = getLocalChapters();

  const blob = new Blob(
    [JSON.stringify(chapters, null, 2)],
    { type: "application/json" }
  );

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = "velvetchapters-chapitres-locaux.json";
  link.click();

  URL.revokeObjectURL(url);
  status.textContent = "Chapitres locaux exportés en JSON.";
});

renderLocalChapters();

const params = new URLSearchParams(window.location.search);
const chapterIdFromUrl = params.get("id");

if (chapterIdFromUrl) {
  startEdit(chapterIdFromUrl);
}