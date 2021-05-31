function refreshCartItems() {
    let sum = 0;

    for (var key in localStorage) {
        if (key.startsWith("cart-"))
            sum += Number(localStorage.getItem(key));
    }

    document.getElementById("cart-items").innerText = sum;
}

refreshCartItems();
