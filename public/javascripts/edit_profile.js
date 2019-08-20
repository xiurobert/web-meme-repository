orig_email = $("#email").val();
orig_username = $("#username").val();

$(document).ready(function() {
    $("#editProfile").hide();
    $("#successfulUpdate").hide();
    $("#dbError").hide();
    $("#emailError").hide();
});
function editEmail() {
    $("#email").prop('disabled', function(i, v) { return !v; });
}

function editUsername() {
    $("#username").prop('disabled', function(i, v) { return !v; });
}

$(document).on('keyup', function () {
    if ($("#email").val() !== orig_email || $("#username").val() !== orig_username) {
        $("#editProfile").show();
    } else {
        $("#editProfile").hide();
    }
});

$("#editProfile").click(function() {
    $.ajax({
        url: "/z/my_profile/update",
        method: "PUT",
        data: {
            email: $("#email").val(),
            username: $("#username").val()
        },
        success: function(res) {
            if (res.includes("update successful")) {
                $("#successfulUpdate").show();
                setTimeout(function() {
                    window.location.reload(true);
                }, 500);
            } else if (res.includes("Email is invalid!")) {
                $("#emailError").show();
            } else {
                $("#dbError").show();

            }
        }
    })
});