

$(document).ready(function() {
    $(".fa-github").click(function() {
        window.location.href = "https://github.com/xiurobert/web-meme-repository"
    });


});
window.onload = function() {
    var loadTime = window.performance.timing.domContentLoadedEventEnd- window.performance.timing.navigationStart;
    $(".loadTime").html(loadTime);
};