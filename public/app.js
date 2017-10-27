$(document).ready(function () {
    console.log("ready!");
    // Grab the articles as a json
    $.getJSON("/articles", function (data) {
        // For each one
        for (var i = 0; i < data.length; i++) {
            // Display the apropos information on the page

            if (data[i].photo === undefined) {
                i++;
            } else {
                $(".row").append('<div class="col-sm-6 col-md-4" data-id="' + data[i]._id + '"><div class="thumbnail"><a class="lightbox" target="_blank" href="' +
                    data[i].link + '"><img src="' + data[i].photo + '" alt="' + data[i].title +
                    '"></a><div class="caption"><h3>' + data[i].pubDate + ": " + data[i].title + '</h3>' +
                    '<p>' + data[i].desc + '</p><br>' +
                    '<div class="top-buttons"><button type="button" class="btn btn-primary" id="add-note" value="' + data[i]._id + '" data-toggle="modal" data-target="#notesModal">View/Add Notes</button></div>' +
                    '</div></div></div><div class="modal fade" id= "notesModal" tabindex= "-1" role= "dialog" aria-labelledby="myModalLabel"><div class="modal-dialog" role="document"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>' +
                    '<h4 class="modal-title" id="modalTitle">' + data[i].title + '</h4></div><div class="modal-body">' +
                    '<form><div class="form-group"><label for="titleinput" class="control-label">Note Title:</label><input type="text" class="form-control" id="titleinput"></div><div class="form-group"><label for="bodyinput" class="control-label">Note Text:</label><textarea class="form-control" id="bodyinput"></textarea></div></form>'+
                    '<p id="note-text"></p><h4 id="note-title"></h4><p id="note-body"></p></div><div class="modal-footer"><button type="button" class="btn btn-default" data-dismiss="modal">Close</button><button type="button" class="btn btn-primary" id="save-note" data-id="' + data[i]._id + '">Save Note</button></div></div></div></div> '
                )
            }

            //   $("#articles").append("<section data-id='" + data[i]._id + "'>" +
            //       "<h3>" + data[i].pubDate + " " + data[i].title + "</h3>" +
            //       "<h4><a href= '" + data[i].link + "'> Souce: The Guardian</a></h4><br />" +
            //       "<p>" + data[i].desc + "</p><br />" +

            //       "<br /><img src='" + data[i].photo + "'/></section>");
        }
    });
    $(document).on('click', '.btn', function () {
        var buttonid = $(this).attr('id');
        console.log(buttonid)
        if (buttonid === "add-note") {
            // Empty the notes from the note section
            //$("#notes").empty();
            // Save the id from the p tag
            var thisId = $(this).attr("value");
            //console.log(thisId)

            $.ajax({
                method: "GET",
                url: "/articles/" + thisId
            })
                // With that done, add the note information to the page
                .done(function (data) {
                    console.log(data);
                    //If there's a note in the article
                    if (data.note) {
                        //console.log(data.note)
                        // Place the title of the note in the title input
                        $("h4 #note-title").text(data.note.title);
                        // Place the body of the note in the body textarea
                        $("p #note-body").text(data.note.body);
                    }
                });
        } else if (buttonid === "save-note") {
            // Grab the id associated with the article from the submit button
            var saveId = $(this).attr("data-id");
            console.log(saveId)
            $("form").hide();
            //Run a POST request to change the note, using what's entered in the inputs
            $.ajax({
                method: "POST",
                url: "/articles/" + saveId,
                data: {
                    // Value taken from title input
                    title: $("#titleinput").val(),
                    // Value taken from note textarea
                    body: $("#bodyinput").val()
                }
            })
                // With that done
                .done(function (data) {
                    // Log the response
                    console.log(data);
                    // Empty the notes section
                    
                    $("#note-text").text("Your note has been saved.");
                });

            // Also, remove the values entered in the input and textarea for note entry
            $("#titleinput").val("");
            $("#bodyinput").val("");
        }      
    });
});

