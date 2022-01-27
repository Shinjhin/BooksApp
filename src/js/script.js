/* global Handlebars, utils, dataSource */ // eslint-disable-line no-unused-vars
{
  'use strict';

  const data = dataSource.books;
  let favoriteBooks = [];

  const select = {
    templateOf: {
      book: '#template-book',
    },
    items: {
      booksList: '.books-list',
      bookImage: '.book__image',
      bookFilters: '.filters',
    }
  };

  const templates = {
    book: Handlebars.compile(document.querySelector(select.templateOf.book).innerHTML),
  };

  class BooksList {
    constructor() {
      const thisBook = this;

      thisBook.renderBook();
      thisBook.initActions();
      thisBook.filterBooks();
      thisBook.determineRatingBgc();
    }

    renderBook() {
      const thisBook = this;
  
      for(let book of data) {
        const ratingBgc = thisBook.determineRatingBgc(book.rating);
        const ratingWidth = book.rating * 10;
        let element = {
          id: book.id,
          name: book.name,
          price: book.price,
          image: book.image,
          rating: book.rating,
          ratingWidth: ratingWidth,
          ratingBgc: ratingBgc,
        };
        const generatedHTML = templates.book(element);
        const generatedDOM = utils.createDOMFromHTML(generatedHTML);
        const bookContainer = document.querySelector(select.items.booksList);
        bookContainer.appendChild(generatedDOM);
      }
    }

    determineRatingBgc(rating) {
      let background;
      if(rating < 6) {
        background = 'linear-gradient(to bottom, #fefcea 0%, #f1da36 100%)';
      } else if(rating > 6 && rating <= 8){
        background = 'linear-gradient(to bottom, #b4df5b 0%,#b4df5b 100%)';
      } else if (rating > 8 && rating <= 9){
        background = 'linear-gradient(to bottom, #299a0b 0%, #299a0b 100%)';
      }
      else if (rating > 9){
        background = 'linear-gradient(to bottom, #ff0084 0%,#ff0084 100%)';
      }
      return background;
    }

    initActions() {
      const bookImg = document.querySelector(select.items.booksList);
  
      bookImg.addEventListener('dblclick', function(event) {
        event.preventDefault();
        const image = event.target.offsetParent;
        const bookId = image.getAttribute('data-id');
        if(!favoriteBooks.includes(bookId)) {
          image.classList.add('favorite');
          favoriteBooks.push(bookId);
        } else {
          image.classList.remove('favorite');
          favoriteBooks.pop(bookId); 
        }
      });
    }  

    filterBooks() {
      const bookFilter = document.querySelector(select.items.bookFilters);

      const filters = [];
      bookFilter.addEventListener('click', function(callback){
        const clickedElement = callback.target;
        if(clickedElement.type === ('checkbox') && clickedElement.name === ('filter')) {
          console.log('con', clickedElement.value);
          if(clickedElement.checked == true) {
            filters.push(clickedElement.value);
          } else {
            const index = filters.indexOf(clickedElement.value);
            filters.splice(index, 1);
          }
        }
        console.log('tab', filters);

        for(const book of data) {
          let shouldBeHidden = false;

          for(const filter of filters) {
            if(!book.details[filter] === true) {
              shouldBeHidden = true;
              break;
            }
          }
          if(shouldBeHidden === true) {
            document.querySelector('.book__image[data-id="' + book.id + '"]').classList.add('hidden');
          } else {
            document.querySelector('.book__image[data-id="' + book.id + '"]').classList.remove('hidden');
          }
        }
      });
    }
  }
  const app = new BooksList;
  app; 
}  