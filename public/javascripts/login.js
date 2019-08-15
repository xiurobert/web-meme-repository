function execLogin() {
    var username = $("#username").val();
    var pw = $("#password").val();

    if (!username || !pw) {
        $("#blankInputs").modal();
    } else {
        $.ajax({
            url: "/auth/login",
            method: "POST",
            data: {
                username: username,
                password: pw
            },
            success: function (result) {
                if (result.includes("password wrong")) {
                    $("#noSuchUser").modal();
                } else if (result.includes("Authenticated")){
                    $(".alert").removeAttr("hidden");
                    window.location.href = "/z/dash"
                }
            }
        })
    }
}