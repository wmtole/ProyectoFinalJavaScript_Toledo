const booksList = document.querySelector('.js-books');
const addButtons = booksList.querySelectorAll('button');
const cart = document.querySelector('.js-cart');
const paymentForm = document.querySelector('.js-payment');
const totalPrice = document.querySelector('.js-cart-total');
const cartDrawer = document.querySelector('.js-cart-drawer');
const openCart = document.querySelector('.js-open-cart');
const closeCart = document.querySelector('.js-close-cart');
const cartCounterElement = document.querySelector('.js-cart-counter');
let cartCounter = 0;
let totalPriceCounter = 0;

async function fetchBooks() {
    const response = await fetch('./js/books.json');
    const books = await response.json();

    return books;
}

async function renderBooks() {
    const books = await fetchBooks();
    books.forEach(book => {
        const wrapper = document.createElement('div');
        const image = document.createElement('img');
        const title = document.createElement('h3');
        const price = document.createElement('span');
        const button = document.createElement('button');

        wrapper.classList.add('s-book-list__book')
        image.src = book.image;
        title.innerText = book.title;
        price.innerText = `$${book.price}`;
        button.innerText = 'Agregar';
        button.setAttribute('data-id', book.id);
        button.addEventListener('click', addBookToCart)

        wrapper.append(image);
        wrapper.append(title);
        wrapper.append(price);
        wrapper.append(button);
        booksList.append(wrapper);
    })
}

renderBooks();

function addBookToCart({
    target
}) {
    const title = target.previousElementSibling.previousElementSibling.innerText;
    const price = target.previousElementSibling.innerText.replace('$', '');
    const book = {
        id: target.getAttribute('data-id'),
        quantity: 1,
        title,
        price: parseInt(price),
    };
    const savedBook = setLocalStorageItem(book);
    renderCart(savedBook);
    cartCounter += 1;
    cartCounterElement.innerText = cartCounter;

    totalPriceCounter += parseInt(price);
    totalPrice.innerText = totalPriceCounter;
}

function removeBook({
    id
}) {
    const storageBooks = localStorage.getItem('books');
    parsedBooks = JSON.parse(storageBooks);
    const index = parsedBooks.findIndex((parsedBook) => parsedBook.id === id);
    parsedBooks.splice(index, 1);
    localStorage.setItem('books', JSON.stringify(parsedBooks));
}

function setLocalStorageItem(book) {
    const books = localStorage.getItem('books');
    if (books) {
        parsedBooks = JSON.parse(books);

        const storedBookIndex = parsedBooks.findIndex((parsedBook) => parsedBook.id === book.id);
        if (storedBookIndex > -1) {
            parsedBooks[storedBookIndex].quantity += 1;
            localStorage.setItem('books', JSON.stringify(parsedBooks));
            return parsedBooks[storedBookIndex];
        } else {
            parsedBooks.push(book)
            localStorage.setItem('books', JSON.stringify(parsedBooks));
            return book;
        }
    } else {
        const bookList = [];
        bookList.push(book);
        localStorage.setItem('books', JSON.stringify(bookList));
        return book;
    }
}


function renderCart(book) {
    const {
        title,
        quantity,
        price,
        id
    } = book;

    const existingLi = document.getElementById(book.id);
    if (existingLi) {
        existingLi.firstElementChild.innerHTML = `${title}: <span>${quantity}</span><br><span>$${price}</span>`;
    } else {
        const li = document.createElement('li');
        const span = document.createElement('span');
        span.innerHTML = `${title}: <span>${quantity}</span><br><span>$${price}</span>`;
        li.append(span);
        li.id = id;

        const removeButton = document.createElement('button');
        removeButton.innerText = 'Borrar';

        li.append(removeButton);

        cart.append(li);

        removeButton.addEventListener('click', () => {
            removeBook(book);
            li.remove();
            quantityValue = parseInt(span.querySelector('span').innerText);
            cartCounter -= quantityValue;
            cartCounterElement.innerText = cartCounter;
            totalPriceCounter -= quantityValue * price;
            totalPrice.innerText = totalPriceCounter;
        })
    }
}

const storageBooks = localStorage.getItem('books');

if (storageBooks) {
    const listOfBooks = JSON.parse(storageBooks);
    for (const book of listOfBooks) {
        renderCart(book);

        cartCounter += book.quantity;
        cartCounterElement.innerText = cartCounter;
        totalPriceCounter += book.quantity * book.price;
        totalPrice.innerText = totalPriceCounter;
    };
}

openCart.addEventListener('click', () => {
    cartDrawer.classList.add('s-cart--open');
})

closeCart.addEventListener('click', () => {
    cartDrawer.classList.remove('s-cart--open');
})

paymentForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const storageBooks = JSON.parse(localStorage.getItem('books'));
    if (storageBooks && storageBooks.length > 0) {
        localStorage.clear('books');
        const items = cart.querySelectorAll('li');
        items.forEach(item => item.remove());
        cartDrawer.classList.remove('s-cart--open');
        cartCounter = 0;
        cartCounterElement.innerText = cartCounter;
        totalPriceCounter = 0;
        totalPrice.innerText = totalPriceCounter;

        Swal.fire({
            title: 'Pago Completado!',
            text: 'Se enviaran los libros a su domicilio',
            icon: 'success',
            confirmButtonText: 'Ok'
        })
    } else {
        Swal.fire({
            title: 'No hay libros en el carrito!',
            text: 'Agregue libros al carrito para comprarlos',
            icon: 'error',
            confirmButtonText: 'Ok'
        })
    }
    const list = document.getElementById("list");

    const ProductList = "./books.json";

    fetch(ProductList)
        .then(respuesta => respuesta.json())
        .then(datos => {
            datos.forEach(product => {
                list.innerHTML += `<h3>title: ${product.title} </h3>
            <strong>price: ${product.price}</strong> 
            <strong>id: ${product.id}</strong>`
            })
        })
})