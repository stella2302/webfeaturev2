"use strict";

///////////////////////////////////////////
// GLOBAL CONSTANTS ///////////////////////

const SCROLL_SENSITIVITY = 20;
const UP_KEYS = [37, 38];
const DOWN_KEYS = [39, 40];

///////////////////////////////////////////
// PUBLIC ACCESSORS ///////////////////////

function getCurrentPage() {
    // returns current pagenumber
    return currentPage;
}

function getTotalPages() {
    // returns total pagenumber
    return getPages().length;
}


///////////////////////////////////////////
// PUBLIC MUTATORS ////////////////////////

function disableScroll() {
    scrollEnabled = false;
}

function enableScroll() {
    scrollEnabled = true;
}

function scrollTo(page) {
    if (!(page < getTotalPages())) {
        return false;
    }
    currentPage = page;
    scroll();
    updateScrollBar();
    return true;
}

///////////////////////////////////////////
// INITIAL EXECUTION SEQUENCE /////////////

document.addEventListener("DOMContentLoaded", init);
var midAnimation = false; // used for scroll animation
var currentPage = 0;
var touchY = 0;
var scrollEnabled = true;
setup(); // removes overflow and margin/padding

// SETUP PAGE SETTINGS
function setup() {
    // SET HTML/BODY PADDING TO ZERO
    let elements = [];
    elements.push(select("body"));
    elements.push(select("html"));
    elements.forEach(removeSpace);
    // REMOVE OVERFLOW;
    select("html").style.overflow = "hidden";
}

// INITIALIZES HANDLERS, PAGE SIZE AND SCROLLBAR
function init() {
    setPageSize();
    makeScrollBar();
    document.addEventListener("resize", setPageSize);
    document.addEventListener("wheel", handleScroll);
    document.addEventListener("touchstart", handleTouch);
    document.addEventListener("keydown", handleKey);
}


///////////////////////////////////////////
// EVEN HANDLERS //////////////////////////

function handleScroll(evt) {
    evt.stopImmediatePropagation();
    if (!(midAnimation)) {
        if (evt.deltaY > SCROLL_SENSITIVITY) {
            scrollDown();
        } else if (evt.deltaY < -SCROLL_SENSITIVITY) {
            scrollUp();
        }
    }
}

function handleTouch(evt) {
    evt.stopImmediatePropagation();
    touchY = evt.touches[0].screenY;
    document.addEventListener("touchmove", detectSwipe);
}

function detectSwipe(evt) {
    evt.stopImmediatePropagation();
    if (!(midAnimation)) {
        if (touchY < evt.touches[0].screenY) {
            scrollUp();
        } else if (touchY > evt.touches[0].screenY) {
            scrollDown();
        }
        document.removeEventListener("touchmove", detectSwipe);
        touchY = 0;
    }
}

function handleKey(evt) {
    if (!(midAnimation)) {
        if (UP_KEYS.includes(evt.which)) {
            scrollUp();
        } else if (DOWN_KEYS.includes(evt.which)) {
            scrollDown();
        }
    }
}


// SET ALL PAGES TO 100X100
function setPageSize() {
    let i = 0;
    getPages().forEach(function (e) {
        e.style.width = "100vw";
        e.style.height = "100vh";
        e.style.position = "absolute";
        e.style.top = i * 100 + "vh";
        e.style.overflow = "hidden";
        e.style.backgroundcolor = "transparent";
        e.style.transition = "transform .75s cubic-bezier(.85,.14,.37,.98)";
        i++;
    });
}


///////////////////////////////////////////
// SCROLLING FUNCTIONALITY ////////////////

function scrollDown() {
    if (isValid("down")) {
        currentPage++;
        scroll();
    }
}

function scrollUp() {
    if (isValid("up")) {
        currentPage--;
        scroll();
    }
}

function scroll() {
    midAnimation = true;
    updateScrollBar();
    getPages().forEach(function (e) {
        e.style.transform = "translateY(-" + currentPage * 100 + "vh)";
    });
    setTimeout(function () {
        midAnimation = false;
    }, 800);
}

function isValid(direction) {
    if (!scrollEnabled) {
        return;
    }
    switch (direction) {
        case "down":
            return currentPage + 1 < getPages().length;
        case "up":
            return currentPage - 1 >= 0;
    }
}


///////////////////////////////////////////
// SCROLLBAR  /////////////////////////////

function makeScrollBar() {
    // Make scrollbar container
    let bar = document.createElement("div");
    bar.setAttribute("class", "fpsScrollbar");
    document.body.appendChild(bar);

    // Make scrollbar nodes
    for (let i = 0; i < getPages().length; i++) {
        let node = document.createElement("div");
        node.setAttribute("class", "fpsScrollNode no" + (i + 1));
        bar.appendChild(node);
    }
    updateScrollBar();
}

function updateScrollBar() {
    selectAll(".fpsScrollNode").forEach(e => {
        e.classList.remove("active");
    });
    select(".fpsScrollNode.no" + (currentPage + 1)).classList.add("active");
    select("#fixedBackground").classList = "bg" + (currentPage + 1);
}


///////////////////////////////////////////
// DEFAULT SCROLLBAR  /////////////////////

function abracaScrollbar() {
    let style = document.createElement("style");
    style.innerHTML = " 				\
		.fpsScrollbar{ 				\
			position: fixed; 		\
			height: 100vh; 	 		\
			display: flex; 			\
			left: 0; 			\
			flex-direction: column; 	\
			justify-content: center;	\
		}					\
		.fpsScrollNode{				\
			height: 10px;			\
			width: 10px;			\
			background-color: #918375;	\
			transition: all .4s ease-in;	\
			margin: 5px;			\
		}					\
		.fpsScrollNode.active{			\
			width: 30px;			\
			background-color: black;	\
		}					\
	";
    document.body.appendChild(style);
}


///////////////////////////////////////////
// UTILITY ////////////////////////////////

function getPages() {
    return selectAll(".fpsPage");
}

function select(str) {
    return document.querySelector(str);
}

function selectAll(str) {
    return document.querySelectorAll(str);
}

function removeSpace(obj) {
    obj.style.padding = 0;
    obj.style.margin = 0;
}
