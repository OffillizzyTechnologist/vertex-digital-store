
/* =====================================
   VERTEX DIGITAL STORE
   OTP VERIFICATION
===================================== */

// SUPABASE

const supabase = window.supabaseClient;


// ELEMENTOS

const verificationForm = document.getElementById("verificationForm");

const codeInputs = document.querySelectorAll(".code-input");

const userEmail = document.getElementById("userEmail");

const verifyButton = document.getElementById("verifyButton");

const resendButton = document.getElementById("resendCode");

const cancelButton = document.getElementById("cancelButton");

const authMessage = document.getElementById("authMessage");


// EMAIL GUARDADO DURANTE O REGISTO

const email = sessionStorage.getItem("vertex_pending_email");


// MOSTRAR MENSAGENS

function showMessage(message, type = "info") {

    authMessage.textContent = message;

    authMessage.className = `auth-message show ${type}`;

}


// LIMPAR MENSAGENS

function clearMessage() {

    authMessage.textContent = "";

    authMessage.className = "auth-message";

}


// VERIFICAR EMAIL

if (!email) {

    showMessage(
        "Não encontramos um email pendente de verificação. Volta à página de registo.",
        "error"
    );

    verifyButton.disabled = true;

    resendButton.disabled = true;

} else {

    userEmail.textContent = email;

}


// VERIFICAR LIGAÇÃO SUPABASE

if (!supabase) {

    showMessage(
        "Não foi possível estabelecer ligação ao servidor.",
        "error"
    );

    verifyButton.disabled = true;

    resendButton.disabled = true;

}


// =====================================
// 1. NAVEGAÇÃO ENTRE CAMPOS
// =====================================

codeInputs.forEach((input, index) => {

    input.addEventListener("input", () => {

        input.value = input.value.replace(/\D/g, "").slice(0, 1);

        if (input.value && index < codeInputs.length - 1) {

            codeInputs[index + 1].focus();

        }

        clearMessage();

    });


    input.addEventListener("keydown", (event) => {

        if (
            event.key === "Backspace" &&
            !input.value &&
            index > 0
        ) {

            codeInputs[index - 1].focus();

        }

    });

});


// =====================================
// 2. COLAR CÓDIGO COMPLETO
// =====================================

codeInputs.forEach((input, index) => {

    input.addEventListener("paste", (event) => {

        event.preventDefault();

        const pastedText = event.clipboardData
            .getData("text")
            .replace(/\D/g, "")
            .slice(0, 6);

        pastedText.split("").forEach((digit, i) => {

            if (codeInputs[i]) {

                codeInputs[i].value = digit;

            }

        });

        const nextEmpty = Array.from(codeInputs).find(
            field => !field.value
        );

        if (nextEmpty) {

            nextEmpty.focus();

        } else {

            codeInputs[5].focus();

        }

    });

});


// =====================================
// 3. VERIFICAR CÓDIGO OTP
// =====================================

verificationForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    clearMessage();

    if (!email || !supabase) return;


    const token = Array.from(codeInputs)
        .map(input => input.value)
        .join("");


    if (token.length !== 6) {

        showMessage(
            "Introduz os seis dígitos do código de verificação.",
            "error"
        );

        return;

    }


    verifyButton.disabled = true;

    verifyButton.textContent = "A verificar...";


    try {

        const { data, error } = await supabase.auth.verifyOtp({

            email: email,

            token: token,

            type: "signup"

        });


        if (error) throw error;


        showMessage(
            "Email confirmado com sucesso! A tua conta VERTEX está activa.",
            "success"
        );


        sessionStorage.removeItem("vertex_pending_email");


        setTimeout(() => {

            window.location.href = "auth.html";

        }, 2000);


    } catch (error) {

        console.error("Erro na verificação:", error);

        showMessage(
            "Código inválido ou expirado. Verifica os dígitos e tenta novamente.",
            "error"
        );


        codeInputs.forEach(input => {

            input.value = "";

        });

        codeInputs[0].focus();


    } finally {

        verifyButton.disabled = false;

        verifyButton.textContent = "Verificar";

    }

});


// =====================================
// 4. REENVIAR CÓDIGO
// =====================================

resendButton.addEventListener("click", async () => {

    clearMessage();

    if (!email || !supabase) return;


    resendButton.disabled = true;

    resendButton.textContent = "A enviar...";


    try {

        const { error } = await supabase.auth.resend({

            type: "signup",

            email: email

        });


        if (error) throw error;


        showMessage(
            "Se o endereço estiver elegível para receber um novo código, o Supabase enviará uma nova mensagem.",
            "success"
        );


    } catch (error) {

        console.error("Erro ao reenviar código:", error);

        showMessage(
            "Não foi possível reenviar o código. Aguarda um pouco e tenta novamente.",
            "error"
        );


    } finally {

        resendButton.disabled = false;

        resendButton.textContent = "Reenviar código";

    }

});


// =====================================
// 5. CANCELAR
// =====================================

cancelButton.addEventListener("click", () => {

    window.location.href = "auth.html";

});


console.log("VERTEX OTP VERIFICATION LOADED");
