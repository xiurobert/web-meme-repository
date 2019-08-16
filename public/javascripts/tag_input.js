var dtag_tags = [];
$(document).ready(function() {
    var sel = $(".tag-input");

    var c2a = sel.parent();
    if (sel.parent().hasClass("input-group")){
        c2a = c2a.parent();
    }

    c2a.append('<div class="dtag-input-tags"></div>');

    sel.on('keyup',function(e) {
        if (e.which === 13 || e.which === 32 || e.which === 188) {
            e.preventDefault();
            var val = sel.val();
            sel.val('');
            if (val.includes(",")) {
                val = val.replace(",", "")
            }

            if (dtag_tags.includes(val)) {
                return;
            }
            $(".dtag-input-tags").append('<span class="dtag-input-tag">' + val + '<span class="dtag-deltag">&times;</span></span>');

            dtag_tags.push(val);
        }

        if (e.which === 8) {
            dtag_tags.pop();
            $(".dtag-input-tags").children().last().remove();
        }

    });

});

