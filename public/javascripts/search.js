$(document).on('keypress', function(e) {
    if (e.which === 13 && $("input[type=search]").val()) {
        searchMeme();
    }
});

function searchMeme() {
    window.location.href = "/meme/search?q=" + encodeURIComponent($("input[type=search]").val())
}