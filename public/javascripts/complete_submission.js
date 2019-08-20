var submissionType = "link";

var customMemeFile;
var customFilePreviewUrl;

$(document).ready(function() {
    $("#submitMeme").hide();
    $(".memepreview").hide();

    var addLink = $("#attachLink");
    var addFile = $("#attachMedia");

    addLink.addClass("disabled");

    addFile.click(function() {
        clearPreview();
        submissionType = "file";
        addLink.removeClass("disabled");
        addFile.addClass("disabled");
        $("#memeLink").hide();
        $("#previewMeme").hide();
        $(".custom-file").removeAttr("hidden");
        $(".custom-file").show();
    });

    addLink.click(function() {
        clearPreview();
        submissionType = "link";
        addFile.removeClass("disabled");
        addLink.addClass("disabled");
        $("#memeLink").show();
        $("#previewMeme").show();
        $(".custom-file").hide();
    })


});

function clearPreview() {
    $(".memepreview").hide();
    $(".memepreview").attr("src", "");
    $("#submitMeme").hide();
    $("#memeLink").val("");
    $("#mediaFile").val("");
    customMemeFile = null;
    $('.custom-file-label').html("Upload your meme");

    $(".invalidUrl").hide();
    $(".emptyFile").hide();
}

function previewMeme(link) {
    var imgUrl = "";
    if (!link) {
        imgUrl = $("#memeLink").val();
    } else {
        imgUrl = link;
    }

    var img = new Image();
    img.src = imgUrl;

    img.onload = function () {

        $(".invalidUrl").hide();
        $(".memepreview").attr("src", imgUrl);
        $(".memepreview").show();
        $("#submitMeme").show();

    };

    img.onerror = function () {
        $(".invalidUrl").removeAttr("hidden");
        $(".invalidUrl").show();
        $(".memepreview").hide();
        $("#submitMeme").hide();
    };

}

function submitMeme() {
    var title = $("#title").val();
    var tags = dtag_tags;
    var desc = $("#description").val();

    var memeUrl = $("#memeLink").val();
    var memeFile = customMemeFile;

    if (!title || !tags) {
        $(".emptyFields").removeAttr("hidden");
        $(".emptyFields").show();
        return;
    } else {
        $(".emptyFields").hide();
    }

    if (submissionType === "link" && !memeUrl) {
        $(".emptyMemeLink").removeAttr("hidden");
        $(".emptyMemeLink").show();
        return;
    } else {
        $(".emptyMemeLink").hide();
    }

    if (submissionType === "file" && !memeFile) {
        $(".emptyFile").removeAttr("hidden");
        $(".emptyFile").show();
        return;
    } else {
        $(".emptyFile").hide();
    }

    ajaxMeme()

}

function procFile(obj) {
    $('.custom-file-label').html(obj.files[0].name);
    customMemeFile = obj.files[0];
    customFilePreviewUrl = URL.createObjectURL(obj.files[0]);
    previewMeme(customFilePreviewUrl)
}

function ajaxMeme() {

    if (!$("#title").val()) {
        alert("Title can't be blank");
        return;
    }

    if (submissionType === "link" && !$("#url").val()) {
        alert("URL can't be blank!");
        return;
    }

    if (submissionType === "file" && !customMemeFile) {
        alert("File can't be empty!");
        return;
    }
    $.ajax({
        method: "PUT",
        url: "/z/submitMeme/" + submissionType,
        contentType: "multipart/form-data",
        data: {
            title: $("#title").val(),
            tags: dtag_tags,
            desc: $("#description").val(),
            url: $("#attachLink").val(),
            file: customMemeFile
        },
        success: function(res) {
            alert(res)
        }
    })
}

function ajaxLinkMeme() {
    if (!$("#title").val()) {
        alert("Title can't be blank");
        return;
    }

    if (submissionType === "link" && !$("#memeLink").val()) {
        alert("URL can't be blank!");
        return;
    }

    if ($("#title").length > 128) {
        $(".titleTooLong").removeAttr("hidden");
        return;
    }

    if (dtag_tags.length > 32) {
        $(".tagsTooLong").removeAttr("hidden");
        return;
    }

    for (var i = 0; i < dtag_tags.length; i++) {
        if (dtag_tags[i].length > 24) {
            $(".tagsTooLong").removeAttr("hidden");
            return;
        }
    }

    if (url.includes("base64")) {
        $(".nob64").removeAttr("hidden");
        return;
    }


    $.ajax({
        method: "PUT",
        url: "/z/submitMemeLink",
        data: {
            title: $("#title").val(),
            tags: dtag_tags.join(),
            desc: $("#description").val(),
            url: $("#memeLink").val(),
        },
        success: function(res) {
            if (res.includes("200 Meme")) {
                window.location.href = "/meme/"+res.split(",")[1];
            } else {
                $(".ajaxReply").html(res);
                $(".ajaxReply").removeAttr("hidden");
            }
        }
    })
}