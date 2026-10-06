/* =====================================================
   GREENLIFE LOGIN
===================================================== */

const loginForm = document.getElementById("loginForm");

const emailInput = document.getElementById("loginEmail");
const passwordInput = document.getElementById("loginPassword");

const emailError = document.getElementById("emailError");
const passwordError = document.getElementById("passwordError");

const loginMessage = document.getElementById("loginMessage");

const rememberMe = document.getElementById("rememberMe");


/* =====================================================
   CHECK IF ALREADY LOGGED IN
===================================================== */

document.addEventListener("DOMContentLoaded", function () {

    if (localStorage.getItem("greenlifeLoggedIn") === "true") {

        window.location.href = "index.html";

    }

});


/* =====================================================
   SHOW / HIDE PASSWORD
===================================================== */

function togglePassword() {

    if (passwordInput.type === "password") {

        passwordInput.type = "text";

    } else {

        passwordInput.type = "password";

    }

}


/* =====================================================
   VALIDATE EMAIL
===================================================== */

function validEmail(email) {

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

}


/* =====================================================
   LOGIN
===================================================== */

loginForm.addEventListener("submit", function (event) {

    event.preventDefault();


    /* CLEAR OLD ERRORS */

    emailError.textContent = "";
    passwordError.textContent = "";

    emailInput.classList.remove("input-error");
    passwordInput.classList.remove("input-error");

    loginMessage.textContent = "";
    loginMessage.className = "login-message";


    const email =
        emailInput.value.trim().toLowerCase();

    const password =
        passwordInput.value;


    let valid = true;


    /* =================================================
       EMAIL VALIDATION
    ================================================= */

    if (email === "") {

        emailError.textContent =
            "Please enter your email address.";

        emailInput.classList.add("input-error");

        valid = false;

    } else if (!validEmail(email)) {

        emailError.textContent =
            "Please enter a valid email address.";

        emailInput.classList.add("input-error");

        valid = false;

    }


    /* =================================================
       PASSWORD VALIDATION
    ================================================= */

    if (password === "") {

        passwordError.textContent =
            "Please enter your password.";

        passwordInput.classList.add("input-error");

        valid = false;

    } else if (password.length < 6) {

        passwordError.textContent =
            "Password must contain at least 6 characters.";

        passwordInput.classList.add("input-error");

        valid = false;

    }


    if (!valid) return;


    /* =================================================
       GET REGISTERED USERS
    ================================================= */

    const users = JSON.parse(
        localStorage.getItem("greenlifeUsers") || "[]"
    );


    /* =================================================
       FIND USER
    ================================================= */

    const user = users.find(function (u) {

        return (
            String(u.email || "").toLowerCase() === email &&
            String(u.password || "") === password
        );

    });


    /* =================================================
       LOGIN FAILED
    ================================================= */

    if (!user) {

        loginMessage.textContent =
            "Invalid email or password.";

        loginMessage.classList.add("login-fail");

        return;

    }


    /* =================================================
       LOGIN SUCCESS
    ================================================= */

    localStorage.setItem(
        "greenlifeLoggedIn",
        "true"
    );

    localStorage.setItem(
        "greenlifeCurrentUser",
        user.email
    );

    localStorage.setItem(
        "greenlifeCurrentUserName",
        user.name || "GreenLife User"
    );

    localStorage.setItem(
        "greenlifeCurrentUserId",
        user.id || ""
    );


    /* =================================================
       REMEMBER ME
    ================================================= */

    if (rememberMe && rememberMe.checked) {

        localStorage.setItem(
            "greenlifeRememberMe",
            "true"
        );

    } else {

        localStorage.removeItem(
            "greenlifeRememberMe"
        );

    }


    /* =================================================
       PENDING CART
    ================================================= */

    const pendingCart =
        localStorage.getItem("greenlifePendingCart");


    if (pendingCart) {

        /*
           We don't delete the pending item yet.

           It will be added to the user's cart
           when we update the cart system.
        */

        loginMessage.textContent =
            "Login successful! Redirecting...";

    } else {

        loginMessage.textContent =
            "Login successful! Welcome back.";

    }


    loginMessage.classList.add(
        "login-success"
    );


    /* =================================================
       GO TO HOME
    ================================================= */

    setTimeout(function () {

        window.location.href = "index.html";

    }, 800);

});


/* =====================================================
   FORGOT PASSWORD
===================================================== */

function forgotPassword(event) {

    event.preventDefault();


    const email = prompt(
        "Enter your registered email address:"
    );


    if (!email) return;


    const users = JSON.parse(
        localStorage.getItem("greenlifeUsers") || "[]"
    );


    const user = users.find(function (u) {

        return String(u.email || "").toLowerCase() ===
            email.trim().toLowerCase();

    });


    if (!user) {

        alert(
            "No account found with this email."
        );

        return;

    }


    alert(
        "Password reset would normally be sent to your email.\n\nFor this college demo, please contact the administrator to reset the password."
    );

}