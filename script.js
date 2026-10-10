// Контакты Анастасии — заполнить перед запуском
const CONTACTS = {
  telegram: "RoshMirosh", // username без @, например "anastasia_psy"
  whatsapp: "", // номер только цифрами, например "995555123456"
};

const links = {
  telegram: (text) =>
    CONTACTS.telegram
      ? `https://t.me/${CONTACTS.telegram}${text ? `?text=${encodeURIComponent(text)}` : ""}`
      : null,
  whatsapp: (text) =>
    CONTACTS.whatsapp
      ? `https://wa.me/${CONTACTS.whatsapp}${text ? `?text=${encodeURIComponent(text)}` : ""}`
      : null,
};

// Plain contact links (footer, booking)
document.querySelectorAll("[data-contact]").forEach((a) => {
  const href = links[a.dataset.contact]?.("");
  if (href) {
    a.href = href;
    a.target = "_blank";
    a.rel = "noopener";
  } else if (a.closest("li")) {
    a.closest("li").hidden = true;
  }
});

// Self-check: selected statements become a ready first message
const boxes = [...document.querySelectorAll(".check input[type=checkbox]")];
const result = document.querySelector(".check-result");
const empty = result.querySelector(".check-empty");
const filled = result.querySelector(".check-filled");
const preview = result.querySelector(".check-preview");
const copyBtn = result.querySelector("[data-copy]");

function buildMessage() {
  const picked = boxes.filter((b) => b.checked).map((b) => b.value);
  if (!picked.length) return "";
  return `Здравствуйте, Анастасия! Хочу записаться на консультацию. Меня беспокоит:\n— ${picked.join("\n— ")}`;
}

function update() {
  const text = buildMessage();
  const has = Boolean(text);
  empty.hidden = has;
  filled.hidden = !has;
  result.classList.toggle("is-filled", has);
  if (!has) return;
  preview.textContent = text;
  result.querySelectorAll("[data-send]").forEach((a) => {
    const href = links[a.dataset.send](text);
    a.hidden = !href;
    if (href) a.href = href;
  });
}

boxes.forEach((b) => b.addEventListener("change", update));

copyBtn.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(buildMessage());
    copyBtn.textContent = "Текст скопирован";
  } catch {
    copyBtn.textContent = "Не получилось скопировать, выделите текст вручную";
  }
  setTimeout(() => (copyBtn.textContent = "Скопировать текст"), 2500);
});

update();

// Certificates open full-size in a native dialog
const viewer = document.querySelector(".doc-viewer");
const viewerImg = viewer.querySelector("img");
document.querySelectorAll("[data-doc]").forEach((btn) => {
  btn.addEventListener("click", () => {
    viewerImg.src = btn.dataset.doc;
    viewerImg.alt = btn.closest(".doc").querySelector(".doc-name").textContent;
    viewer.showModal();
  });
});
viewer.addEventListener("click", (e) => {
  if (e.target === viewer) viewer.close();
});
