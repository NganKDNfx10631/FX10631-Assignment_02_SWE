var menuOpened = false;
var menuComponent, iconComponent;

function expand() {
    if (menuOpened === false) {
        $(menuComponent).css('transform', 'scale(3)');
        $(iconComponent).css('transform', 'rotate(45deg)');
        menuOpened = true;
    } else {
        $(menuComponent).css('transform', 'scale(0)');
        $(iconComponent).css('transform', 'rotate(0deg)');
        menuOpened = false;
    }
}

function initMenuComponents() {
    return false; // off popup

    if ($("#floatFunixMenu").length === 0) {
        // Add Icon
        let head = document.head || document.getElementsByTagName('head')[0],
            style = document.createElement('link');
        style.rel = 'stylesheet';
        style.setAttribute(
            "href",
            "https://use.fontawesome.com/releases/v5.7.1/css/all.css"
        );
        head.appendChild(style);
        let menuHTML = '<div id="floatFunixMenu"> <div id="toggle"> <img id="plus" src="https://firebasestorage.googleapis.com/v0/b/funix-subtitle.appspot.com/o/funix-icon.png?alt=media&token=d87f1917-86c3-4359-b771-6c8768627e1c" alt=""> </div> <div id="menu"> <a id="report" class="FunixTooltip"> <span class="fa fa-flag" aria-hidden="true"></span> <span class="FunixTooltiptext">Report some issue!</span> </a> <a class="FunixTooltip"  href="https://lms.funix.edu.vn" target="_blank"> <span class="fas fa-graduation-cap" aria-hidden="true"></span> <span class="FunixTooltiptext">Go to LMS</span> </a> <a class="FunixTooltip"  href="https://www.messenger.com/t/hannah.funix" target="_blank"> <span class="far fa-comment-dots aria-hidden="true"></span> <span class="FunixTooltiptext">Ask mentor</span> </a> </div> </div>';
        $("body").append(menuHTML);

        // Get element
        menuComponent = $("#floatFunixMenu  #menu")[0];
        iconComponent = $("#floatFunixMenu  #plus")[0];

        dragElement(document.getElementById("floatFunixMenu"));
        addEvent();
    }
}

function addEvent() {
    $(iconComponent).dblclick(function (event) {
        expand();
    });
    $("#floatFunixMenu a#report").click(function (event) {
        reportIssue();
    });
}

function dragElement(elmnt) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    if (document.getElementById(elmnt.id + "header")) {
        // if present, the header is where you move the DIV from:
        document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
    } else {
        // otherwise, move the DIV from anywhere inside the DIV:
        elmnt.onmousedown = dragMouseDown;
    }

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        // get the mouse cursor position at startup:
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // set the element's new position:
        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        // stop moving when mouse button is released:
        document.onmouseup = null;
        document.onmousemove = null;
    }
}
