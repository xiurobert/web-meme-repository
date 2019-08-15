function execSignup() {

    if ($("#password").val() !== $("#confirmPassword").val()) {
        $("#somethingNoMatch").modal();
    } else {
        $.ajax({
            url: "/auth/signup",
            method: "PUT",
            data: {
                username: $("#username").val(),
                password: $("#password").val(),
                confirmPassword: $("#confirmPassword").val()
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
