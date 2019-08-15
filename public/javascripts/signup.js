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
                alert(result);
            },
            statusCode: {
                400: function() {

                }
            }
        })
    }

}
