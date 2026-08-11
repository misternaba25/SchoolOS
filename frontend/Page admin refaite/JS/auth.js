/**
 * auth.js
 * ------------------------------------------------------------------
 * Gère le formulaire de connexion (login.html) et la déconnexion
 * (bouton "Déconnexion" de la sidebar, voir data-action="logout").
 *
 * NOTE BACKEND :
 *  - POST /api/auth/login  body: { email, password }
 *    -> doit renvoyer au minimum { token: "..." } (ou mettre en place
 *       des cookies de session, selon la stratégie choisie)
 *  - POST /api/auth/logout -> invalide le token/la session côté serveur
 * ------------------------------------------------------------------
 */

const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const errorEl = document.getElementById("loginError");
    const submitBtn = document.getElementById("loginSubmitBtn");
    errorEl.style.display = "none";
    submitBtn.disabled = true;
    submitBtn.textContent = "Connexion...";

    const { email, password } = Object.fromEntries(new FormData(loginForm).entries());

    try {
      const result = await apiPost(API_ENDPOINTS.auth.login, { email, password });
      if (result && result.token) {
        localStorage.setItem("schoolos_token", result.token);
      }
      window.location.href = "index.html";
    } catch (err) {
      errorEl.textContent = err.message || "Email ou mot de passe incorrect.";
      errorEl.style.display = "block";
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Se connecter";
    }
  });
}

async function logout() {
  try {
    await apiPost(API_ENDPOINTS.auth.logout, {});
  } catch (err) {
    console.warn("[auth] logout API indisponible, déconnexion locale uniquement:", err.message);
  } finally {
    localStorage.removeItem("schoolos_token");
    const onRootPage = document.body.dataset.root === "true";
    window.location.href = onRootPage ? "login.html" : "../login.html";
  }
}
