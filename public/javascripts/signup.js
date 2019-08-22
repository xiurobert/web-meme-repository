function execSignup() {
    var submitBtn = $("input[type='submit']");

    submitBtn.attr("disabled", true);
    submitBtn.val("Signing up...");

    function revertSubmitBtn() {
        submitBtn.removeAttr("disabled");
        submitBtn.val("Sign up");
    }

    var email = $("#email").val();
    var username = $("#username").val();
    var pw = $("#password").val();
    var confirmPw = $("#confirmPassword").val();

    if (!email || !username || !pw || !confirmPw) {
        $("#inputsBlank").modal();
        revertSubmitBtn();
        return;
    }

    if (!validateEmail(email)) {
        $("#emailError").modal();
        revertSubmitBtn();
        return;
    }

    if (pw !== confirmPw) {
        $("#somethingNoMatch").modal();
        revertSubmitBtn();
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
            if (result.includes("Successfully")) {
                $(".alert").removeAttr("hidden");
                window.location.href = "/z/dash";
            }
        },
        error: function(xhr) {
            revertSubmitBtn();
            $("#ajaxError .modal-body").html(xhr.responseText);
            $("#ajaxError").modal();
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
