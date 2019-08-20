
function searchMeme() {
    window.location.href = "/meme/search?q=" + encodeURIComponent($("input[type=search]").val())
}