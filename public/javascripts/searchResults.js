$(document).ready(function() {
    $("#noResultsMsg").hide();
    if (!$(".meme-result").length) {
        $("#noResultsMsg").removeAttr("hidden");
        $("#noResultsMsg").show();
    }
});