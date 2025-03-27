let pageno = 1;

async function fillBookData() {
  const raw = await fetch(
    `https://api.freeapi.app/api/v1/public/books?page=${pageno}`
  );
  const initialData = await raw.json();

  console.log(initialData);
  const booksContainer = document.querySelector(".booksContainer");

  const arrData = initialData.data.data;
  arrData.forEach((element) => {
    const bkTitle = element.volumeInfo.title;
    const bkAuthor = element.volumeInfo.authors;
    const bkPublisher = element.volumeInfo.publisher;
    const bkPublishDate = element.volumeInfo.publishedDate;
    const bkThumbnailUrl = element.volumeInfo.imageLinks.thumbnail;
    const bkInfoLink = element.volumeInfo.infoLink;
    console.log(bkInfoLink);
    
    const div = document.createElement("div");
    div.classList.add("bookItem");
    div.setAttribute("data-title", bkTitle);
    div.setAttribute("data-author", bkAuthor);
    div.setAttribute("data-date", bkPublishDate);
    div.innerHTML = `
            <a href="${bkInfoLink}" target="_blank">
                <img class="bookThumbnail" src="${bkThumbnailUrl}">
                <p class="bookTitle">${bkTitle}</p>
                <p class="bookAuthor"><strong>Author: </strong>${bkAuthor}</p>
                <span class="bookPublisher"><strong>Publisher: </strong>${bkPublisher}</span>
                <span class="bookPublishedDate"><strong>Published Date: </strong>${bkPublishDate}</span>
            </a>    
            `;
    booksContainer.appendChild(div);
  });
}
fillBookData();

function toggleView(view) {
  const container = document.querySelector(".booksContainer");
  const gridViewBtn = document.getElementById("gridView");
  const listViewBtn = document.getElementById("listView");
  if (view === "grid") {
    container.classList.add("grid");
    container.classList.remove("list");
    gridViewBtn.classList.add("active");
    listViewBtn.classList.remove("active");

  } else {
    container.classList.add("list");
    container.classList.remove("grid");
    listViewBtn.classList.add("active");
    gridViewBtn.classList.remove("active");
  }
}

const bkSearchInput = document.getElementById("bookSearchInput");

function searchFilter() {
  const books = document.querySelectorAll(".bookItem");
  const searchValue = bkSearchInput.value.toLowerCase();
  console.log(searchValue);

  books.forEach((book) => {
    console.log(book);
    const bktitle = book.getAttribute("data-title");
    const authors = book.getAttribute("data-author");

    if (
      bktitle.toLowerCase().includes(searchValue) ||
      authors.toLowerCase().includes(searchValue)
    ) {
      book.style.display = "";
    } else {
      book.style.display = "none";
    }
  });
}

bkSearchInput.addEventListener("input", () => {
  searchFilter();
});

const sortSelect = document.getElementById("sort");
sortSelect.addEventListener("change", function () {
  sortBooks(this.value);
});

function sortBooks(filter) {
  const booksContainer = document.querySelector(".booksContainer");
  const books = Array.from(document.querySelectorAll(".bookItem"));
  if (filter == "title") {
    books.sort((bk1, bk2) => {
      const titleA = bk1.getAttribute("data-title").toLowerCase();
      const titleB = bk2.getAttribute("data-title").toLowerCase();
      return titleA.localeCompare(titleB); // Alphabetical order
    });
  } else if (filter == "date-a") {
    books.sort((bk1, bk2) => {
      const dateA = new Date(bk1.getAttribute("data-date"));
      const dateB = new Date(bk2.getAttribute("data-date"));
      return dateA - dateB; // Ascending order
    });
  } else if (filter == "date-d") {
    books.sort((bk1, bk2) => {
      const dateA = new Date(bk1.getAttribute("data-date"));
      const dateB = new Date(bk2.getAttribute("data-date"));
      return dateB - dateA; // Descending order
    });
  }
  booksContainer.innerHTML = "";
  books.forEach((book) => booksContainer.appendChild(book));
}

// Implementing Pagination - Infinite Scroll
function handleScroll() {
  // To check if user is at end of the page
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 10) {
    if(bkSearchInput.value)
      return;
    loadMoreBooks();
  }
}
window.addEventListener("scroll", handleScroll);

async function loadMoreBooks() {
  pageno++;
  fillBookData();
}

