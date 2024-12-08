/*
 -Add drag and drop functionality - DONE
 -Add check button - DONE
 -Improve drag and drop: - DONE
    +Allow for dropping on the same cell without disruptions/multiples - DONE
    +If dropped on a cell with data, return data to original position -DONE
    +Add answer table drag and drop functionality - DONE
 -Add final message displays - DONE
 -Additional features...
*/

//Some variables
var t1 = $("#table1");
var t2 = $("#table2");
var t1Rows = $("#table1 tr");
var t2Cells = $("#table2 tr td");
var nums = [1, 2, 3, 4, 5, 6, 7, 8, 9];
var checkBtn = $("#check").attr("disabled", "true"); //Disable initially
var resetBtn = $(".reset");
t2Cells.each((i, cell) => {
    cell.id = "drop" + i;
})
function fillNums() { //Fill table 1 with numbers
    //Randomize nums
    nums.reverse().forEach((notUsed, i) => {
        let j = Math.floor(Math.random() * (i + 1));
        [nums[i], nums[j]] = [nums[j], nums[i]];
    })

    var rowIndex = 0;

    //Empty table 1
    t1Rows.empty()

    //Insert numbers in table 1
    nums.forEach((number, i) => {
        var td = $("<td>").attr("id", "drag" + i).attr("draggable", "true").text(number);
        $(t1Rows[rowIndex]).append(td);
        if ((i + 1) % 3 == 0) rowIndex++;
    })
}
function Reset(e) { //Reset everything, randomize initial table
    e.preventDefault();

    //Reset second table
    t2Cells.empty();
    t2Cells.removeClass();

    //Replace buttons
    $("#check").show().attr("disabled", "true");
    $("#reset").hide();
    $(".popup-container").hide();

    fillNums();
}
function Check(e) { //Check answer and give feedback accordingly
    e.preventDefault();
    var inputNums = "";
    t2Cells.each(function (i, cell) {

        inputNums += cell.textContent;

        //Change background color of correct and incorrect cells
        if ($(cell).text() != i + 1) $(cell).addClass("incorrect");
        else $(cell).addClass("correct");

    })

    //Show whehter answer was correct or not
    if (inputNums == "123456789") $(".correct-popup").parent().fadeIn(1000);
    else $(".incorrect-popup").parent().fadeIn(1000);

    checkBtn.hide();
    resetBtn.show();
}

//Fill table 1 initially
fillNums();

//Drag and drop functions
t1.on("dragstart", function (e) {
    e.originalEvent.dataTransfer.setData("text", e.target.id);
    e.target.style.opacity = 0.5;
})

t1.on("dragend", function(e) {
    e.preventDefault();
    e.target.style.opacity = 1;
})
t2.on("dragend", function(e) {
    e.preventDefault();
    e.target.style.opacity = 1;
})
t2.on("dragstart", function (e) {
    e.originalEvent.dataTransfer.setData("text", e.target.id);
    e.target.style.opacity = 0.5;
})

t2.on("dragenter", function (e) {
    e.preventDefault();
    if (e.target.tagName == "TD")
        e.target.style.opacity = 0.5;
})

t2.on("dragover", function(e) {
    e.preventDefault();
})

t2.on("dragleave", function (e) {
    e.preventDefault();
    e.target.style.opacity = 1;
})

t2.on("drop", function (e) {
    e.preventDefault();
    e.stopPropagation();
    if (e.target.tagName != "TD") return;
    //Get dragged cell and its number 
    var id = e.originalEvent.dataTransfer.getData("text");
    var td = $("#" + id);
    var number = td.text();

    if (e.target.textContent) { //if target is not empty
        var temp = e.target.textContent;
        e.target.textContent = number;
        td.text(temp);
    }
    else {
        e.target.textContent = number;
        td.text("");
        e.target.setAttribute("draggable", "true");
        td.removeAttr("draggable");
    }

    //Reset opacities
    td.css("opacity", 1);
    e.target.style.opacity = 1;

    //Make check button available when table 2 is filled
    if (!$("#table1").text().trim()) checkBtn.removeAttr("disabled");
    else checkBtn.attr("disabled", "true");

})

//Bind functions to buttons
checkBtn.click(Check)

resetBtn.click(Reset);


