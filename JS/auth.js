
/* ==========================================
   VERTEX DIGITAL STORE
   SISTEMA DE AUTENTICACAO
   SUPABASE AUTH
========================================== */


// ==========================================
// 1. ELEMENTOS
// ==========================================

const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");

const showSignup = document.getElementById("showSignup");
const showLogin = document.getElementById("showLogin");

const welcomeTitle = document.getElementById("welcomeTitle");
const welcomeDescription = document.getElementById("welcomeDescription");

const authMessage = document.getElementById("authMessage");


// ==========================================
// 2. MOSTRAR MENSAGENS
// ==========================================

function showMessage(message, type = "info") {

    authMessage.textContent = message;

    authMessage.className = `auth-message show ${type}`;

}


function clearMessage() {

    authMessage.textContent = "";

    authMessage.className = "auth-message";

}


// ==========================================
// 3. ALTERNAR PARA REGISTO
// ==========================================

showSignup.addEventListener("click", () => {

    clearMessage();

    loginForm.classList.remove("active");

    signupForm.classList.add("active");

    welcomeTitle.textContent = "JUNTA-TE À VERTEX";

    welcomeDescription.textContent =
        "Cria a tua conta e faz parte de um mundo de conhecimento, inovação e oportunidades digitais.";

});


// ==========================================
// 4. ALTERNAR PARA LOGIN
// ==========================================

showLogin.addEventListener("click", () => {

    clearMessage();

    signupForm.classList.remove("active");

    loginForm.classList.add("active");

    welcomeTitle.textContent = "BEM-VINDO DE VOLTA";

    welcomeDescription.textContent =
        "A tua jornada digital começa aqui. Inicia sessão para aceder à tua conta.";

});


// ==========================================
// 5. MOSTRAR / OCULTAR PALAVRA-PASSE
// ==========================================

document.querySelectorAll(".password-toggle").forEach(button => {

    button.addEventListener("click", () => {

        const input = document.getElementById(
            button.dataset.target
        );

        const isPassword = input.type === "password";

        input.type = isPassword ? "text" : "password";

        button.textContent = isPassword ? "OCULTAR" : "MOSTRAR";

        button.setAttribute(
            "aria-label",
            isPassword ? "Ocultar palavra-passe" : "Mostrar palavra-passe"
        );

    });

});


// ==========================================
// 6. VERIFICAR LIGACAO SUPABASE
// ==========================================

function getSupabase() {

    if (!window.supabaseClient) {

        showMessage(
            "Não foi possível estabelecer ligação ao servidor. Actualiza a página e tenta novamente.",
            "error"
        );

        return null;

    }

    return window.supabaseClient;

}

// ==========================================
// 7. REGISTO REAL DE UTILIZADORES - OTP
// ==========================================

const createAccountForm = document.getElementById("createAccountForm");

createAccountForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    clearMessage();

    const form = event.currentTarget;
    const submitButton = form.querySelector(".submit-button");

    const name = document.getElementById("fullName").value.trim();
    const email = document.getElementById("signupEmail").value.trim();
    const password = document.getElementById("signupPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const terms = document.getElementById("acceptTerms").checked;

    // VALIDAR NOME

    if (name.length < 2) {
        showMessage("Introduz o teu nome completo.", "error");
        return;
    }

    // VALIDAR PALAVRA-PASSE

    if (password.length < 8) {
        showMessage(
            "A palavra-passe deve ter pelo menos 8 caracteres.",
            "error"
        );
        return;
    }

    // CONFIRMAR PALAVRA-PASSE

    if (password !== confirmPassword) {
        showMessage("As palavras-passe não coincidem.", "error");
        return;
    }

    // ACEITAR TERMOS

    if (!terms) {
        showMessage(
            "Deves aceitar os termos e condições para continuar.",
            "error"
        );
        return;
    }

    // VERIFICAR SUPABASE

    const supabase = getSupabase();

    if (!supabase) return;

    submitButton.disabled = true;
    submitButton.textContent = "A criar conta...";

    try {

        // CRIAR CONTA

        const { data, error } = await supabase.auth.signUp({

            email: email,

            password: password,

            options: {
                data: {
                    full_name: name
                }
            }

        });

        if (error) throw error;

        // CONTA AGUARDA CONFIRMAÇÃO OTP

        if (data.user && !data.session) {

            sessionStorage.setItem(
                "vertex_pending_email",
                email
            );

            window.location.href = "verify-email.html";

            return;
        }

        // CONTA CRIADA COM SESSÃO ACTIVA

        if (data.user && data.session) {

            showMessage(
                "Conta criada com sucesso! Bem-vindo à VERTEX.",
                "success"
            );

            form.reset();

            return;
        }

        showMessage(
            "Não foi possível concluir o registo. Tenta novamente.",
            "error"
        );

    }

    catch (error) {

        console.error("Erro no registo VERTEX:", error);

        const errorMessage = error.message.toLowerCase();

        if (
            errorMessage.includes("already registered") ||
            errorMessage.includes("already been registered")
        ) {

            showMessage(
                "Este endereço de email já está registado. Experimenta iniciar sessão.",
                "error"
            );

        }

        else if (errorMessage.includes("password")) {

            showMessage(
                "A palavra-passe não cumpre os requisitos de segurança.",
                "error"
            );

        }

        else if (errorMessage.includes("rate limit")) {

            showMessage(
                "Atingiste o limite de tentativas. Aguarda um pouco e tenta novamente.",
                "error"
            );

        }

        else {

            showMessage(
                "Ocorreu um erro: " + error.message,
                "error"
            );

        }

    }

    finally {

        submitButton.disabled = false;

        submitButton.innerHTML = 'Criar conta <span>→</span>';

    }

});


    // Validar palavra-passe

    if (password.length < 8) {

        showMessage(
            "A palavra-passe deve ter pelo menos 8 caracteres.",
            "error"
        );

        return;

    }


    // Confirmar palavra-passe

    if (password !== confirmPassword) {

        showMessage(
            "As palavras-passe não coincidem.",
            "error"
        );

        return;

    }


    // Aceitar termos

    if (!terms) {

        showMessage(
            "Deves aceitar os termos e condições para continuar.",
            "error"
        );

        return;

    }


    // Verificar Supabase

    const supabase = getSupabase();

    if (!supabase) return;


    // Iniciar carregamento

    submitButton.disabled = true;

    submitButton.innerHTML = "A criar conta...";


    try {

        // Criar utilizador no Supabase

        const { data, error } = await supabase.auth.signUp({

            email: email,

            password: password,

            options: {

                data: {

                    full_name: name

                },

                emailRedirectTo: `${window.location.origin}/auth.html`

            }

        });


        if (error) {

            throw error;

        }


        // Verificar resultado

        if (data.user && !data.session) {

    sessionStorage.setItem("vertex_pending_email", email);

   window.location.href = "verify-email.html";

    return;

}

else if (data.user && data.session) {

    showMessage(
        "A tua conta foi criada com sucesso! Já tens uma sessão activa.",
        "success"
    );

    form.reset();

        }

        else {

            showMessage(
                "Não foi possível concluir o registo. Tenta novamente.",
                "error"
            );

        }


    } catch (error) {

        console.error("Erro no registo VERTEX:", error);

        const errorMessage = error.message.toLowerCase();

        if (
            errorMessage.includes("already registered") ||
            errorMessage.includes("already been registered")
        ) {

            showMessage(
                "Este endereço de email já está registado. Experimenta iniciar sessão.",
                "error"
            );

        }

        else if (errorMessage.includes("password")) {

            showMessage(
                "A palavra-passe não cumpre os requisitos de segurança.",
                "error"
            );

        }

        else if (errorMessage.includes("rate limit")) {

            showMessage(
                "Atingiste o limite de tentativas. Aguarda um pouco e tenta novamente.",
                "error"
            );

        }

        else {

            showMessage(
                "Ocorreu um erro: " + error.message,
                "error"
            );

        }

    }

    finally {

        submitButton.disabled = false;

        submitButton.innerHTML = 'Criar conta <span>→</span>';

    }

;

// ==========================================
// 8. LOGIN (AINDA POR IMPLEMENTAR)
// ==========================================

document.getElementById("signInForm").addEventListener("submit", async (event) => {

    event.preventDefault();

    clearMessage();

    const email = document.getElementById("loginEmail").value.trim();

    const password = document.getElementById("loginPassword").value;

    const supabase = getSupabase();

    if (!supabase) return;

    const submitButton = event.currentTarget.querySelector(".submit-button");

    submitButton.disabled = true;

    submitButton.textContent = "A iniciar sessão...";

    try {

        const { data, error } = await supabase.auth.signInWithPassword({

            email: email,

            password: password

        });

        if (error) throw error;

        showMessage(
            "Sessão iniciada com sucesso! Bem-vindo à VERTEX.",
            "success"
        );

        console.log("Utilizador autenticado:", data.user.id);

        // O redireccionamento será implementado
        // depois de criarmos a área do utilizador.

    }

    catch (error) {

        console.error("Erro no login:", error);

        if (error.message.toLowerCase().includes("invalid login credentials")) {

            showMessage(
                "Email ou palavra-passe incorrectos.",
                "error"
            );

        }

        else if (error.message.toLowerCase().includes("email not confirmed")) {

            showMessage(
                "Confirma primeiro o teu endereço de email.",
                "error"
            );

        }

        else {

            showMessage(
                "Não foi possível iniciar sessão: " + error.message,
                "error"
            );

        }

    }

    finally {

        submitButton.disabled = false;

        submitButton.innerHTML = 'Iniciar sessão <span>→</span>';

    }

});


// ==========================================
// 9. AUTENTICACAO SOCIAL
// ==========================================

document.querySelectorAll(".social-button").forEach(button => {

    button.addEventListener("click", async () => {

        const provider = button.dataset.provider;

        const supabase = getSupabase();

        if (!supabase) return;

        const supportedProviders = ["Google", "Facebook", "GitHub"];

        if (!supportedProviders.includes(provider)) return;

        try {

            const { error } = await supabase.auth.signInWithOAuth({

                provider: provider.toLowerCase(),

                options: {

                    redirectTo: window.location.origin + "/auth.html"

                }

            });

            if (error) throw error;

        }

        catch (error) {

            console.error("Erro na autenticação social:", error);

            showMessage(
                "Não foi possível iniciar a autenticação com " + provider + ". Verifica a configuração do fornecedor no Supabase.",
                "error"
            );

        }

    });

});


// ==========================================
// 10. RECUPERACAO DE PALAVRA-PASSE
// ==========================================

document.getElementById("forgotPassword").addEventListener("click", async (event) => {

    event.preventDefault();

    clearMessage();

    const email = document.getElementById("loginEmail").value.trim();

    if (!email) {

        showMessage(
            "Introduz primeiro o teu email no campo de email.",
            "info"
        );

        return;

    }

    const supabase = getSupabase();

    if (!supabase) return;

    try {

        const { error } = await supabase.auth.resetPasswordForEmail(email, {

            redirectTo: window.location.origin + "/auth.html"

        });

        if (error) throw error;

        showMessage(
            "Se o endereço estiver registado, receberás um email com as instruções para recuperar a palavra-passe.",
            "success"
        );

    }

    catch (error) {

        console.error("Erro na recuperação:", error);

        showMessage(
            "Não foi possível solicitar a recuperação. Tenta novamente.",
            "error"
        );

    }

});


console.log("VERTEX AUTHENTICATION SYSTEM LOADED");
