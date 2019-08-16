$(document).ready(function() {
    var addLink = $("#attachLink");
    var addFile = $("#attachMedia");

    addLink.addClass("disabled");

    addFile.click(function() {
        addLink.removeClass("disabled");
        addFile.addClass("disabled");
        $("#memeLink").hide();
        $(".custom-file").removeAttr("hidden");
        $(".custom-file").show();
    });

    addLink.click(function() {
        addFile.removeClass("disabled");
        addLink.addClass("disabled");
        $("#memeLink").show();
        $(".custom-file").hide();
    })


});
