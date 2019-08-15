function execSignup() {
    var username = $("#username").val();
    var pw = $("#password").val();
    var confirmPw = $("#confirmPassword").val();

    if (pw !== confirmPw) {
        $("#somethingNoMatch").modal();
    } else {
        $.ajax({
            url: "/auth/signup",
            method: "PUT",
            data: {
                username: username,
                password: pw,
                confirmPassword: confirmPw
            },
            success: function(result, status, xhr) {
                if (result.includes("already exists")) {
                    $("#duplicateUser").modal()
                } else if (result.includes("match")) {
                    $("#somethingNoMatch").modal();
                }
            },
            statusCode: {
                400: function() {

                }
            }
        })
    }

}
