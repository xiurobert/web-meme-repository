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


    if (memeFile.size > 200 * 1024 * 1024) {
        // Ban files larger than 200MiB
        alert("Your file is too big. It has to be less than 200MiB");
        return;
    }



}

function procFile(obj) {
    $('.custom-file-label').html(obj.files[0].name);
    customMemeFile = obj.files[0];
    customFilePreviewUrl = URL.createObjectURL(obj.files[0]);
    previewMeme(customFilePreviewUrl)
}