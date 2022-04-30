import { card } from "../components/card.js";
import { tableRow } from "../components/table.js";
import { referenceList } from "../data/reference.js";
import { renderToDom } from "../utils/renderToDom.js";

// Reusable function to get the cards on the DOM
// .forEach()
const renderCards = (array) => {
  let refStuff = "";
    array.forEach((item)=>{     //loops through an array to get everything
    refStuff += card(item);
  });
  renderToDom("#cards", refStuff);
}
//add and update items in the cart
const toggleCart = (event) => {
  if (event.target.id.includes("fav-btn")) {
    const [, id] = event.target.id.split('--');    //in square braces use [, element] to pinpoint that element only. require two elements              

    const index = referenceList.findIndex(taco => taco.id === Number(id))  //Number () converts id from string to integer like parseInt()
    referenceList[index].inCart = !referenceList[index].inCart   //no strict equals on this to allow the cart to toggle and update
    cartTotal();
    renderCards(referenceList);
  }
}

// SEARCH
// .filter()
const search = (event) => {
  const eventLC = event.target.value.toLowerCase();
  const searchResult = referenceList.filter(taco => 
    taco.title.toLowerCase().includes(eventLC) || 
    taco.author.toLowerCase().includes(eventLC) || 
    taco.description.toLowerCase().includes(eventLC) 
 )  
renderCards(searchResult);  //renders cards to DOM after using conditions above in the function
}

// BUTTON FILTER
// .filter() & .reduce() &.sort() - chaining
const buttonFilter = (event) => {
  if(event.target.id.includes('free')) {
  const free = referenceList.filter(item => item.price <= 0);   //.filter method returns only what is filtered from the array in a new array based 
  renderCards(free);                                            //based on a condition
  }
  if(event.target.id.includes('cartFilter')) {
    const wishList = referenceList.filter(item => item.inCart);
    renderCards(wishList);
  }
  if(event.target.id.includes('books')) {
    const books = referenceList.filter(item => item.type.toLowerCase() === 'book');
    renderCards(books);
  }
  if(event.target.id.includes('clearFilter')) {
    renderCards(referenceList);  
  }
  if(event.target.id.includes('cartList')) {
    cartList();
  }

  if(event.target.id.includes('productList')) {
    let table = `<table class="table table-dark table-striped" style="width: 600px">
    <thead>
      <tr>
        <th scope="col">Title</th>
        <th scope="col">Type</th>
        <th scope="col">Price</th>
      </tr>
    </thead>
    <tbody>
    `;

    //LOOK UP localeCompare()
    productList().sort((a, b) => a.type.localeCompare(b.type)).forEach(item => {
      table += tableRow(item);
    });

    table += `</tbody></table>`

    renderToDom('#cards', table);
  }  
}

// CALCULATE CART TOTAL
// .reduce() & .some()
const cartTotal = () => {
  const cart = referenceList.filter(taco => taco.inCart);
  const total = cart.reduce((a, b) => a + b.price, 0);
  const free = cart.some(taco => taco.price <= 0); 
document.querySelector("#cartTotal").innerHTML = total.toFixed(2);

if(free){
  document.querySelector("#includes-free").innerHTML = 'INCLUDES FREE ITEMS';
} else {
  document.querySelector("#includes-free").innerHTML = ' ';
  }
}

// RESHAPE DATA TO RENDER TO DOM
// .map()
const productList = () => {
  return referenceList.map(item => ({     ///map returns a new array and manipulates data based on our determination
    title: item.title, 
    price: item.price, 
    type: item.type
  }))
}
//[{ title: "SAMPLE TITLE", price: 45.00, type: "SAMPLE TYPE" }]

const startApp = () => {
  // PUT ALL CARDS ON THE DOM
  renderCards(referenceList)

  // PUT CART TOTAL ON DOM
  cartTotal();

  // SELECT THE CARD DIV
  document.querySelector('#cards').addEventListener('click', toggleCart);

  // SELECT THE SEARCH INPUT
  document.querySelector('#searchInput').addEventListener('keyup', search);

  // SELECT BUTTON ROW DIV
  document.querySelector('#btnRow').addEventListener('click', buttonFilter);
}
startApp();
