/* =========================================
   THE PART I NEVER TOLD YOU
   DIGITAL BOOK READER
========================================= */


/* =========================================
   ELEMENTS
========================================= */

const cover = document.getElementById("cover");
const reader = document.getElementById("reader");

const startReading = document.getElementById("startReading");
const backToCover = document.getElementById("backToCover");

const book = document.getElementById("book");

const previousPage = document.getElementById("previousPage");
const nextPage = document.getElementById("nextPage");

const bottomPrevious = document.getElementById("bottomPrevious");
const bottomNext = document.getElementById("bottomNext");

const pageNumber = document.getElementById("pageNumber");
const totalPages = document.getElementById("totalPages");

const progressBar = document.getElementById("progressBar");

const chapterStatus = document.getElementById("chapterStatus");

const themeToggle = document.getElementById("themeToggle");

const zoomIn = document.getElementById("zoomIn");
const zoomOut = document.getElementById("zoomOut");
const zoomValue = document.getElementById("zoomValue");

const viewMode = document.getElementById("viewMode");

const openMenu = document.getElementById("openMenu");
const closeMenu = document.getElementById("closeMenu");

const chapterMenu = document.getElementById("chapterMenu");
const chapterList = document.getElementById("chapterList");

const storyData = document.getElementById("storyData");


/* =========================================
   VARIABLES
========================================= */

let pages = [];

let currentPage = 0;

let zoom = 100;

let spreadMode = false;

let chapters = [];


/* =========================================
   GET STORY
========================================= */

function getStory() {

    chapters = [...storyData.querySelectorAll(".chapter")];

}


/* =========================================
   CREATE CHAPTER LIST
========================================= */

function createChapterList() {

    chapterList.innerHTML = "";

    chapters.forEach((chapter, index) => {

        const button = document.createElement("button");

        button.className = "chapter-item";

        button.innerHTML = `
            <small>CHAPTER ${chapter.dataset.chapter}</small>
            <strong>${chapter.dataset.title}</strong>
        `;

        button.addEventListener("click", () => {

            const targetPage = pages.findIndex(
                page => page.dataset.chapter === chapter.dataset.chapter
            );

            if (targetPage !== -1) {

                currentPage = targetPage;

                showPage();

                chapterMenu.classList.remove("open");

            }

        });

        chapterList.appendChild(button);

    });

}


/* =========================================
   CREATE PAGES
========================================= */

function createPages() {

    book.innerHTML = "";

    pages = [];

    chapters.forEach((chapter) => {

        /*
         * CHAPTER OPENING PAGE
         */

        const opening = document.createElement("div");

        opening.className = "book-page";

        opening.dataset.chapter = chapter.dataset.chapter;

        opening.innerHTML = `

            <div class="page-content">

                <div class="chapter-opening">

                    <div class="chapter-number">
                        CHAPTER ${chapter.dataset.chapter}
                    </div>

                    <h1>
                        ${chapter.dataset.title}
                    </h1>

                    ${
                        chapter.dataset.date
                        ?
                        `<div class="opening-date">
                            ${chapter.dataset.date}
                        </div>`
                        :
                        ""
                    }

                </div>

            </div>
        `;

        book.appendChild(opening);

        pages.push(opening);


        /*
         * STORY PAGE
         *
         * Instead of automatically cutting
         * paragraphs in half, each chapter
         * remains a complete document.
         */

        const contentPage = document.createElement("div");

        contentPage.className = "book-page";

        contentPage.dataset.chapter =
            chapter.dataset.chapter;

        const content = document.createElement("div");

        content.className = "page-content";


        /*
         * Copy chapter content
         */

        [...chapter.children].forEach(element => {

            content.appendChild(
                element.cloneNode(true)
            );

        });


        contentPage.appendChild(content);

        book.appendChild(contentPage);

        pages.push(contentPage);

    });


    /*
     * FINAL PAGE
     */

    const finalPage = document.createElement("div");

    finalPage.className = "book-page";

    finalPage.innerHTML = `

        <div class="page-content">

            <div class="chapter-opening">

                <div class="chapter-number">
                    END
                </div>

                <h1>
                    Thank you for reading.
                </h1>

                <p style="
                    margin-top:30px;
                    max-width:500px;
                    text-align:center;
                    color:#888;
                ">
                    Some stories are written with words.
                    Others are written with memories.
                </p>

                <p style="
                    margin-top:35px;
                    font-style:italic;
                    color:#555;
                ">
                    — The part I never told you
                </p>

            </div>

        </div>

    `;

    book.appendChild(finalPage);

    pages.push(finalPage);


    totalPages.textContent = pages.length;


    showPage();

}


/* =========================================
   SHOW PAGE
========================================= */

function showPage() {

    pages.forEach((page, index) => {

        page.classList.toggle(
            "active",
            index === currentPage
        );

    });


    pageNumber.textContent =
        currentPage + 1;


    /*
     * Progress
     */

    const progress =
        ((currentPage + 1) / pages.length) * 100;

    progressBar.style.width =
        progress + "%";


    /*
     * Navigation buttons
     */

    previousPage.disabled =
        currentPage === 0;

    bottomPrevious.disabled =
        currentPage === 0;


    nextPage.disabled =
        currentPage === pages.length - 1;

    bottomNext.disabled =
        currentPage === pages.length - 1;


    /*
     * Chapter status
     */

    const page = pages[currentPage];

    if (page.dataset.chapter) {

        chapterStatus.textContent =
            "Chapter " + page.dataset.chapter;

    } else {

        chapterStatus.textContent =
            "The End";

    }


    /*
     * Highlight chapter in menu
     */

    const items =
        chapterList.querySelectorAll(".chapter-item");

    items.forEach(item => {

        item.classList.remove("active");

    });

    const activeChapter =
        page.dataset.chapter;

    if (activeChapter) {

        const chapterIndex =
            chapters.findIndex(
                chapter =>
                chapter.dataset.chapter === activeChapter
            );

        if (chapterIndex !== -1) {

            items[chapterIndex]
                ?.classList.add("active");

        }

    }

}


/* =========================================
   NEXT PAGE
========================================= */

function goNext() {

    if (currentPage < pages.length - 1) {

        currentPage++;

        showPage();

    }

}


/* =========================================
   PREVIOUS PAGE
========================================= */

function goPrevious() {

    if (currentPage > 0) {

        currentPage--;

        showPage();

    }

}


/* =========================================
   START READING
========================================= */

startReading.addEventListener("click", () => {

    cover.style.display = "none";

    reader.classList.add("active");

    document.body.style.overflow = "hidden";

    currentPage = 0;

    showPage();

});


/* =========================================
   BACK TO COVER
========================================= */

backToCover.addEventListener("click", () => {

    reader.classList.remove("active");

    cover.style.display = "flex";

    currentPage = 0;

});


/* =========================================
   BUTTONS
========================================= */

nextPage.addEventListener(
    "click",
    goNext
);

bottomNext.addEventListener(
    "click",
    goNext
);

previousPage.addEventListener(
    "click",
    goPrevious
);

bottomPrevious.addEventListener(
    "click",
    goPrevious
);


/* =========================================
   KEYBOARD
========================================= */

document.addEventListener("keydown", (event) => {

    if (!reader.classList.contains("active")) {
        return;
    }

    if (event.key === "ArrowRight") {

        goNext();

    }

    if (event.key === "ArrowLeft") {

        goPrevious();

    }

    if (event.key === "Escape") {

        chapterMenu.classList.remove("open");

    }

});


/* =========================================
   TOUCH / SWIPE
========================================= */

let touchStartX = 0;

let touchEndX = 0;

book.addEventListener("touchstart", (event) => {

    touchStartX =
        event.changedTouches[0].screenX;

});


book.addEventListener("touchend", (event) => {

    touchEndX =
        event.changedTouches[0].screenX;

    const difference =
        touchStartX - touchEndX;

    if (Math.abs(difference) < 50) {
        return;
    }

    if (difference > 0) {

        goNext();

    } else {

        goPrevious();

    }

});


/* =========================================
   CLICK LEFT / RIGHT
========================================= */

book.addEventListener("click", (event) => {

    const rect =
        book.getBoundingClientRect();

    const clickX =
        event.clientX - rect.left;

    if (clickX < rect.width * .3) {

        goPrevious();

    }

    else if (clickX > rect.width * .7) {

        goNext();

    }

});


/* =========================================
   DARK / LIGHT MODE
========================================= */

themeToggle.addEventListener("click", () => {

    document.body.classList.toggle(
        "light-reader"
    );


    if (
        document.body.classList.contains(
            "light-reader"
        )
    ) {

        themeToggle.textContent = "☀";

    } else {

        themeToggle.textContent = "☾";

    }

});


/* =========================================
   ZOOM
========================================= */

function updateZoom() {

    book.classList.remove(
        "zoom-90",
        "zoom-100",
        "zoom-110",
        "zoom-120"
    );


    if (zoom === 90) {

        book.classList.add("zoom-90");

    }

    if (zoom === 100) {

        book.classList.add("zoom-100");

    }

    if (zoom === 110) {

        book.classList.add("zoom-110");

    }

    if (zoom === 120) {

        book.classList.add("zoom-120");

    }


    zoomValue.textContent =
        zoom + "%";

}


zoomIn.addEventListener("click", () => {

    if (zoom < 120) {

        zoom += 10;

        updateZoom();

    }

});


zoomOut.addEventListener("click", () => {

    if (zoom > 90) {

        zoom -= 10;

        updateZoom();

    }

});


/* =========================================
   VIEW MODE
========================================= */

viewMode.addEventListener("click", () => {

    spreadMode = !spreadMode;

    /*
     * Currently keeps one-page reading
     * because it is much better on mobile.
     *
     * Can be expanded into a real
     * two-page Word-style spread.
     */

    if (spreadMode) {

        viewMode.textContent = "▣";

        book.style.width =
            "min(1000px, 92vw)";

    } else {

        viewMode.textContent = "⬚";

        book.style.width =
            "min(850px, 90vw)";

    }

});


/* =========================================
   CONTENTS MENU
========================================= */

openMenu.addEventListener("click", () => {

    chapterMenu.classList.add("open");

});


closeMenu.addEventListener("click", () => {

    chapterMenu.classList.remove("open");

});


/* =========================================
   INITIALIZE
========================================= */

getStory();

createPages();

createChapterList();

updateZoom();