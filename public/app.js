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
                    '</div></div></div>')
                
            }
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
                    $("#modalTitle").text(data.title)
                    $("#save-note").attr("data-id", thisId);
                    $("#note-text").attr("data-id", thisId);

                    //console.log(data);
                    //If there's a note in the article
                    if (data.note) {
                        //console.log(data.note)
                        // Place the title of the note in the title input
                        $("#titleinput").html(data.note.title);
                        // Place the body of the note in the body textarea
                        $("#bodyinput").html(data.note.body);
                            
                        $("#note-text").attr("data-id", thisId).text("Your note was added at " + data.note.timestamp)
                    }
                });
        } else if (buttonid === "save-note") {
            // Grab the id associated with the article from the submit button
            var saveId = $(this).attr("data-id");
            console.log(saveId)
            
            //Run a POST request to change the note, using what's entered in the inputs
            $.ajax({
                method: "POST",
                url: "/articles/" + saveId,
                data: {
                    // Value taken from title input
                    title: $("#titleinput").val(),
                    // Value taken from note textarea
                    body: $("#bodyinput").val(),
                    timestamp: Date.now()
                }
            })
                // With that done
                .done(function (data) {
                    // Log the response
                    //console.log(data.title + data.body);
                    $("#note-text").attr("data-id", thisId).text("Your Note Was Saved")

                    
                    
                });

            // Also, remove the values entered in the input and textarea for note entry
            //$("#titleinput").val("");
            //$("#bodyinput").val("");
        }      
    });
});

