let iconCart = document.querySelector('.cart-icon');
let body = document.querySelector('body');
let ListProductHTML = document.querySelector('.ListProduct');
let ListCartHTML = document.querySelector('.cartBar');
let iconCartSpan = document.querySelector('.cart-icon span');
let searchInput = document.querySelector('#searchInput');
let totalButton = document.querySelector('#Total');

let ListProducts = [];
let carts = [];





totalButton.addEventListener('click', ()=> {
   body.classList.toggle('showCart')
});





const addDataToHTML = (products = ListProducts) => {
    ListProductHTML.innerHTML = '';
    if(products.length > 0){
        products.forEach(product => {
            let newProduct = document.createElement('div');
            newProduct.classList.add('item');
            newProduct.dataset.id = product.id;
            newProduct.innerHTML = `
            <img class="image" src="${product.image}">
                <h2 class="name">${product.name}</h2>
                <div class="price">₦${product.price}</div>
                <button class="addtocart">Add To Cart</button>`;
                ListProductHTML.appendChild(newProduct);
        });
    }else{
        ListProductHTML.innerHTML = '<p>No products found.</p>';
    }
}

searchInput.addEventListener('input', () => {
    let keyword = searchInput.value.toLowerCase();

    let filteredProducts = ListProducts.filter(product => product.name.toLowerCase().includes(keyword));

    addDataToHTML(filteredProducts);

});

const header = document.getElementById("header");
const footer = document.getElementById("footer");

const observer = new IntersectionObserver(
    ([entry])=>{
        if (entry.isIntersecting){
            header.classList.add("unstick");
        }else{
            header.classList.remove("unstick");
        }
    },
    {
        root: null,
        threshold: 0,
    }
);
observer.observe(footer);


ListProductHTML.addEventListener('click', (event) => {
    let positionClick = event.target;
    if(positionClick.classList.contains('addtocart')){
       let product_id = positionClick.parentElement.dataset.id;
       addCart(product_id);
    }
})

const addCart = (product_id) => {
    let positionThisProductInCart = carts.findIndex((value) => value.product_id == product_id);
    if(carts.length <= 0){
        carts = [{
            product_id: product_id,
            quantity: 1
        }]
    }else if(positionThisProductInCart < 0){
        carts.push({
            product_id: product_id,
            quantity: 1
        });
    }else{
        carts[positionThisProductInCart].quantity = carts[positionThisProductInCart].quantity + 1;
    }
    addCartToHTML();
    addCartToMemory();

    body.classList.add('showCart');
}
const sidebar = document.querySelector('.sidebar');
sidebar.addEventListener('click', (e)=>{
    e.stopPropagation();
});

document.addEventListener('click', (e)=>{
    if(
        !body.classList.contains('showCart'))return;
        
        if (e.target.closest('.sidebar'))return;

        if (e.target.closest('.addtocart'))return;

    body.classList.remove('showCart');
})

const addCartToMemory = () => {
    localStorage.setItem('cart', JSON.stringify(carts));
}

const addCartToHTML = () => {
    ListCartHTML.innerHTML = '';
    let totalQuantity = 0;
    let totalPrice = 0;
    if(carts.length > 0){
        carts.forEach(cart => {
            let productInfo = ListProducts.find(p => p.id == cart.product_id);
            totalQuantity += cart.quantity;
            totalPrice += productInfo.price * cart.quantity;
            let newCart = document.createElement('div');
            newCart.classList.add('item');
            newCart.dataset.id = cart.product_id;
            newCart.innerHTML = `<img src="${productInfo.image}">
                <div class="name">${productInfo.name}</div>
                <div class="price">₦${productInfo.price * cart.quantity}</div>
                <div class="quantity">
                <span class="minus">-</span>
                <span>${cart.quantity}</span>
                <span class="plus">+</span>
                </div>`;
        ListCartHTML.appendChild(newCart);
        })
    }
    iconCartSpan.innerText = totalQuantity;

    
    totalButton.innerText = `Total: ₦ ${totalPrice.toFixed(2)}`;


}
ListCartHTML.addEventListener('click', (event) => {
    let positionClick = event.target;
    if(positionClick.classList.contains('minus') || positionClick.classList.contains('plus')){
      let product_id = positionClick.parentElement.parentElement.dataset.id;
      let type = 'minus';
      if(positionClick.classList.contains('plus')){
        type = 'plus';
      }
      changeQuantity(product_id, type);
    }
    
})
const changeQuantity = (product_id, type) => {
    let positionItemInCart = carts.findIndex((value) => value.product_id == product_id);
    if(positionItemInCart >= 0){
        switch (type) {
            case 'plus':
                carts[positionItemInCart].quantity = carts[positionItemInCart].quantity + 1;
                break;
        
            default:
                let valueChange = carts[positionItemInCart].quantity - 1;
                if(valueChange > 0){
                    carts[positionItemInCart].quantity = valueChange;
                }else{
                    carts.splice(positionItemInCart, 1);
                }
                break;
        }
    }
    addCartToMemory();
    addCartToHTML();
}

function whatsapp(){
    if(carts.length === 0){
        alert("Your cart is empty!");
        return;
    }
    let message = "*Checkout Details*\n\n";
    let totalPrice = 0;

    carts.forEach(cartItem => {
        let product = ListProducts.find(p => p.id == cartItem.product_id);

        if(product){
            let itemTotal = product.price * cartItem.quantity;
            totalPrice += itemTotal;

            message += `- ${product.name}
            Quantity: ${cartItem.quantity}
            price: ₦${itemTotal}\n\n`;
        }
    });

    message += `______________________\n`;
    message += `TOTAL: ₦${totalPrice.toFixed(2)}\n\n`;
    message += "Please confirm my order.";

    let phoneNumber = "2349067103251";
    let encodedMessage = encodeURIComponent(message);

    let whatsappURL = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(whatsappURL, "_blank");
}

const initApp = () => {
  fetch('products.json')
  .then(response => response.json())
  .then(data => {
    ListProducts = data;
    addDataToHTML();

    if(localStorage.getItem('cart')){
        carts = JSON.parse(localStorage.getItem('cart'));
        addCartToHTML();
    }
  })
}
initApp();
