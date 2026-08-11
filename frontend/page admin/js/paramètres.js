const logoInput = document.getElementById("schoolLogoInput");
if (logoInput) {
  logoInput.addEventListener("change", async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("logo", file);

    // TODO backend: POST /api/etablissements/logo (multipart/form-data)
    // const response = await fetch(`${API_BASE_URL}/etablissements/logo`, {
    //   method: "POST",
    //   body: formData,
    // });
    // const data = await response.json();
    // -> data.logo_url renvoyé par le backend après stockage (ex: S3, disque local)

    // Aperçu immédiat côté navigateur (avant confirmation backend)
    const preview = document.getElementById("schoolLogoPreview");
    preview.src = URL.createObjectURL(file);
    preview.style.display = "block";
  });
}
