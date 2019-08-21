var dtag_tags = [];

var sel = $(".tag-input");

$(document).ready(function() {

    var c2a = sel.parent();
    if (sel.parent().hasClass("input-group")){
        c2a.after('<div class="dtag-input-tags"></div>')
    } else {
        sel.append('<div class="dtag-input-tags"></div>');
    }


    function deleteLastTag() {
        dtag_tags.pop();
        $(".dtag-input-tags").children().last().remove();
    }

    sel.on('keyup',function(e) {
        if (e.which === 13 || e.which === 32 || e.which === 188) {
            e.preventDefault();
            var val = sel.val();
            val = val.trim();
            sel.val('');
            if (val.includes(",")) {
                val = val.replace(",", "")
            }

            if (val === "") {
                return;
            }

            if (dtag_tags.includes(val)) {
                return;
            }

            // Disallow spaces in tags to prevent element from being chopped into half
            if (val.includes(" ")) {
                return;
            }

            // Disallow tags from being too long
            if (val.length > 24 || dtag_tags.length > 16) {
                alert("Tag too long or too many tags!");
                return;
            }

            $(".dtag-input-tags").append(
                '<span class="dtag-input-tag">' +
                    '<span class="dtag-val">' + val + '</span>' +
                    '<span class="dtag-deltag">&nbsp; &times;</span>' +
                '</span>');

            dtag_tags.push(val);
        }

        if (e.which === 8) {
            if ($(e.target).val() === "") {
                e.preventDefault();
                deleteLastTag();
            }

        }

    });

    $(document).on('click',".dtag-deltag", function(event) {
        var valToPop = $(event.target).parent().find($(".dtag-val")).html();
        if (dtag_tags.indexOf(valToPop) !== -1) dtag_tags.splice(dtag_tags.indexOf(valToPop), 1);
        $(event.target).parent().remove();
    });




});

