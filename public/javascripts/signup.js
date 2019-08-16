function execSignup() {
    var email = $("#email").val();
    var username = $("#username").val();
    var pw = $("#password").val();
    var confirmPw = $("#confirmPassword").val();

    if (!email || !username || !pw || !confirmPw) {
        $("#inputsBlank").modal();
        return;
    }

    if (!validateEmail(email)) {
        $("#emailError").modal();
        return;
    }

    if (pw !== confirmPw) {
        $("#somethingNoMatch").modal();
        return;
    }

    $.ajax({
        url: "/auth/signup",
        method: "PUT",
        data: {
            email: email,
            username: username,
            password: pw,
            confirmPassword: confirmPw
        },
        success: function(result) {
            if (result.includes("already exists")) {
                $("#duplicateUser").modal();
            } else if (result.includes("match")) {
                $("#somethingNoMatch").modal();
            } else {
                $(".alert").removeAttr("hidden");
                window.location.href = "/z/dash";
            }
        }
    })

}
// Definitely not copied
function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

function runOnEnter(e) {
    if (e.keyCode === 13) {
        execSignup();
    }
}
