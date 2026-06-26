/**
 * Downloads a file from a given URL and converts it to a local Blob.
 * This prevents userscript managers (like Tampermonkey) from automatically intercepting the file.
 *
 * @param {string} url - Direct link to the file.
 * @param {string} filename - The name to save the file as.
 */
async function downloadFileAsBlob(url, filename) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`HTTP Error: ${response.status}`);
  }

  const textData = await response.text();

  const blob = new Blob([textData], { type: "application/javascript" });
  const blobUrl = URL.createObjectURL(blob);

  const tempLink = document.createElement("a");
  tempLink.href = blobUrl;
  tempLink.download = filename;

  document.body.appendChild(tempLink);
  tempLink.click();
  document.body.removeChild(tempLink);

  URL.revokeObjectURL(blobUrl);
}

document.addEventListener("DOMContentLoaded", () => {
  const downloadBtn = document.getElementById("download-btn");

  if (downloadBtn) {
    downloadBtn.addEventListener("click", async (e) => {
      const btn = e.currentTarget;
      const originalText = btn.textContent;
      const url = btn.dataset.url;

      try {
        btn.textContent = "Загрузка...";
        btn.style.pointerEvents = "none";

        await downloadFileAsBlob(url, "CatWar_UwU.user.js");

        btn.textContent = "Успешно!";
      } catch (error) {
        console.error("Download error:", error);
        btn.textContent = "Ошибка загрузки";
        btn.classList.add("glass--error");
      } finally {
        setTimeout(() => {
          btn.textContent = originalText;
          btn.style.pointerEvents = "";
          btn.classList.remove("glass--error");
        }, 3000);
      }
    });
  }
});
