document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("registerForm");
    const message = document.getElementById("registerMessage");

    const password = document.getElementById("password");
    const confirmPassword = document.getElementById("confirmPassword");

    const togglePassword = document.getElementById("togglePassword");
    const toggleConfirmPassword =
        document.getElementById("toggleConfirmPassword");


    // SHOW / HIDE PASSWORD

    togglePassword.addEventListener("click", function () {

        password.type =
            password.type === "password" ? "text" : "password";

        this.textContent =
            password.type === "password" ? "Show" : "Hide";

    });


    toggleConfirmPassword.addEventListener("click", function () {

        confirmPassword.type =
            confirmPassword.type === "password" ? "text" : "password";

        this.textContent =
            confirmPassword.type === "password" ? "Show" : "Hide";

    });


    // REGISTER

    form.addEventListener("submit", function (event) {

        event.preventDefault();


        const name =
            document.getElementById("name").value.trim();

        const email =
            document.getElementById("email").value.trim().toLowerCase();

        const phone =
            document.getElementById("phone").value.trim();

        const passwordValue =
            password.value;

        const confirmPasswordValue =
            confirmPassword.value;


        message.textContent = "";
        message.style.color = "";


        // VALIDATION

        if (name.length < 2) {
            message.textContent = "Please enter your full name.";
            message.style.color = "red";
            return;
        }


        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            message.textContent = "Please enter a valid email address.";
            message.style.color = "red";
            return;
        }


        if (!/^[0-9]{10}$/.test(phone)) {
            message.textContent =
                "Please enter a valid 10-digit mobile number.";
            message.style.color = "red";
            return;
        }


        if (passwordValue.length < 6) {
            message.textContent =
                "Password must contain at least 6 characters.";
            message.style.color = "red";
            return;
        }


        if (passwordValue !== confirmPasswordValue) {
            message.textContent =
                "Passwords do not match.";
            message.style.color = "red";
            return;
        }


        // GET EXISTING USERS

        let users = JSON.parse(
            localStorage.getItem("greenlifeUsers") || "[]"
        );


        // CHECK DUPLICATE EMAIL

        const existingUser = users.find(function (user) {

            return String(user.email || "").toLowerCase() === email;

        });


        if (existingUser) {

            message.textContent =
                "This email is already registered. Please login.";

            message.style.color = "red";

            return;
        }


        // CREATE USER

        const newUser = {

            id: "USER" + Date.now(),

            name: name,

            email: email,

            phone: phone,

            password: passwordValue,

            address: "",

            createdAt: new Date().toISOString()

        };


        // SAVE USER

        users.push(newUser);

        localStorage.setItem(
            "greenlifeUsers",
            JSON.stringify(users)
        );


        // CONFIRM SUCCESS

        message.textContent =
            "Account created successfully! Opening login...";

        message.style.color = "green";


        // GO TO LOGIN

        setTimeout(function () {

            window.location.href = "login.html";

        }, 1200);

    });

});