function execLogin() {
    var username = $("#username").val();
    var pw = $("#password").val();

    var submitBtnSelector = $("input[type='submit']");

    submitBtnSelector.val("Logging in...");
    submitBtnSelector.attr("disabled", true);


    if (!username || !pw) {
        $("#blankInputs").modal();
        submitBtnSelector.removeAttr("disabled");
        submitBtnSelector.val("Log in");
    } else {
        debugger;
        $.ajax({
            url: "/auth/login",
            method: "POST",
            data: {
                username: username,
                password: pw
            },
            success: function (result) {
                if (result.includes("Authenticated")){
                    $(".alert").removeAttr("hidden");
                    window.location.href = "/z/dash"
                }
            },
            error: function(xhr) {
                $("#ajaxError .modal-body").html(xhr.responseText);
                $("#ajaxError").modal();

                submitBtnSelector.removeAttr("disabled");
                submitBtnSelector.val("Log in");
            }
        })
    }
}

function runOnEnter(e) {
    if (e.keyCode === 13) {
        execLogin()
    }
}