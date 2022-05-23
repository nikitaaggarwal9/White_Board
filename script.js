let optionCont = document.querySelector(".options-cont");
let toolsCont = document.querySelector(".tools-cont");
let pencilIcon = document.querySelector(".pencil");
let eraserIcon = document.querySelector(".eraser");
let stickyIcon = document.querySelector(".sticky-note")
let uploadIcon = document.querySelector(".upload")
let pencilToolCont = document.querySelector(".pencil-tool-cont");
let eraserToolCont = document.querySelector(".eraser-tool-cont");
let optionFlag = false;
let pencilFlag = false;
let eraserFlag = false;

optionCont.addEventListener("click", (e) => {
    optionFlag = !optionFlag;

    if (optionFlag) openTools();
    else closeTools();
})

function openTools() {
    let iconElem = optionCont.children[0];
    iconElem.classList.add("fa-times");
    iconElem.classList.remove("fa-bars");
    toolsCont.style.display = "flex";
}

function closeTools() {
    let iconElem = optionCont.children[0];
    iconElem.classList.add("fa-bars");
    iconElem.classList.remove("fa-times");
    toolsCont.style.display = "none";
    setDefaultUI();
}

pencilIcon.addEventListener("dblclick", (e) => {
    pencilFlag = !pencilFlag;

    if (pencilFlag) pencilToolCont.style.display = "flex";
    else pencilToolCont.style.display = "none";
})

eraserIcon.addEventListener("dblclick", (e) => {
    eraserFlag = !eraserFlag;

    if (eraserFlag) eraserToolCont.style.display = "flex";
    else eraserToolCont.style.display = "none";
})


uploadIcon.addEventListener("click", (e) => {
    setDefaultUI(uploadIcon);
    // opening file explorer
    let input = document.createElement("input");
    input.setAttribute("type", "file");
    input.click();

    input.addEventListener("change", (e) => {
        let file = input.files[0];
        let url = URL.createObjectURL(file);

        let stickyTemplateHTML = `
        <div class="header-cont">
            <div class="minimize"></div>
            <div class="remove"></div>
        </div>
        <div class="note-cont">
            <img class="img" src="${url}" />
        </div>
        `;

        createSticky(stickyTemplateHTML);
    })
})


stickyIcon.addEventListener("click", (e) => {
    setDefaultUI(stickyIcon);
    let stickyTemplateHTML = `
    <div class="header-cont">
        <div class="minimize"></div>
        <div class="remove"></div>
    </div>
    <div class="note-cont">
        <textarea spellcheck="false"></textarea>
    </div>
    `;
    createSticky(stickyTemplateHTML);
})


function createSticky(stickyTemplateHTML) {
    let stickyCont = document.createElement("div");
    stickyCont.setAttribute("class", "sticky-cont");
    stickyCont.innerHTML = stickyTemplateHTML;

    document.body.appendChild(stickyCont);

    let minimize = stickyCont.querySelector(".minimize");
    let remove = stickyCont.querySelector(".remove");
    stickyContActions(minimize, remove, stickyCont);

    stickyCont.onmousedown = function (event) {
        // alert("remove clicked from mousedown");
        if(!event.target.classList.contains("minimize") && !event.target.classList.contains("remove"))
        dragAndDrop(stickyCont, event);
    };

    stickyCont.ondragstart = function () {
        return false;
    };
}


function stickyContActions(minimize, remove, element) {
    remove.addEventListener("click", (e) => {
        // console.log("remove clicked");
        // alert("remove clicked");
        element.remove();
    })
    minimize.addEventListener("click", (e) => {
        let noteCont = element.querySelector(".note-cont");
        // console.log(noteCont);
        // alert("minimize clicked");
        let display = getComputedStyle(noteCont).getPropertyValue("display");
        if (display === "none") noteCont.style.display = "block";
        else noteCont.style.display = "none";
    })
}


function dragAndDrop(element, event) {
    let shiftX = event.clientX - element.getBoundingClientRect().left;
        let shiftY = event.clientY - element.getBoundingClientRect().top;

        element.style.position = 'absolute';
        element.style.zIndex = 1000;
        document.body.append(element);

        moveAt(event.pageX, event.pageY);

        // moves the ball at (pageX, pageY) coordinates
        // taking initial shifts into account
        function moveAt(pageX, pageY) {
            element.style.left = pageX - shiftX + 'px';
            element.style.top = pageY - shiftY + 'px';
        }

        function onMouseMove(event) {
            moveAt(event.pageX, event.pageY);
        }

        // move the ball on mousemove
        document.addEventListener('mousemove', onMouseMove);

        // drop the ball, remove unneeded handlers
        element.onmouseup = function () {
            document.removeEventListener('mousemove', onMouseMove);
            element.onmouseup = null;
        };
}


function setDefaultUI(element) {
    if(element != pencilIcon && pencilFlag) {
        pencilFlag = !pencilFlag;
        pencilToolCont.style.display = "none";
    }

    if(element != eraserIcon && eraserFlag) {
        eraserFlag = !eraserFlag;
        eraserToolCont.style.display = "none";
    }

    let allIcons = toolsCont.querySelectorAll("img");
    allIcons.forEach(icon => {
        icon.classList.remove("default");
    })
    element.classList.add("default");
}