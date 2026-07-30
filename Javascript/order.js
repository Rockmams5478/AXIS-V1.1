document.getElementById("orderForm").addEventListener("submit", function(e) { 
    
    e.preventDefault(); 
    
    const formData = new FormData(this); 
    
    const customer = Object.fromEntries(formData); 
    
    const itemsList = cart.map(item =>
        `${item.product} | Size: ${item.size} | Color: ${item.color} | R${item.price * item.quantity} | Item Amount: ${item.quantity}`
    ).join("\n");

    const subtotal = cart.reduce(
        (sum, item) => sum + (item.price * item.quantity),
        0
    );

    const deliveryMethod = document.querySelector(
        'input[name="delivery"]:checked'
    );

    const shipping =
        deliveryMethod &&
        deliveryMethod.value === "delivery"
            ? 250
            : 0;

    const shipment =
    deliveryMethod && deliveryMethod.value === "delivery"
        ? "Delivery"
        : "Pickup at AXIS HQ";

    const total = subtotal + shipping;

    const orderId = "#AXIS ORD-" + Math.floor(Math.random() * 1000) + "-" + Date.now(); 



    emailjs.send("service_wlxbcf7", "template_in3x94n", { 
    
        customer_name: customer.name, 
        customer_email: customer.email, 
        phone: customer.phone,
        zipcode: customer.zipcode, 
        town: customer.town, 
        address: customer.address, 
        order_items: itemsList, 
        subtotal: subtotal, 
        total_price: total, 
        order_id: orderId, 
        shipping_price: shipping,
        shipment: shipment

    }) 
    
.then(function() {
    return emailjs.send("service_wlxbcf7", "template_mbq0iuh", { 
    
        customer_name: customer.name, 
        customer_email: customer.email, 
        zipcode: customer.zipcode, 
        town: customer.town, 
        address: customer.address, 
        order_items: itemsList, 
        subtotal: subtotal, 
        total_price: total, 
        order_id: orderId,
        shipping_price: shipping,
        shipment: shipment 
    
    }); 


}) 
    
    .then(function() { 
    
        try { 
    
        alert("Order sent successfully! Check Out For a Email"); 
    
        cart = [];
        localStorage.setItem("cart", JSON.stringify(cart));
    
        if (typeof updateCartCounter === "function") { 
    
            updateCartCounter(); 

        }  
    
        if (typeof displayCart === "function") {     
    
            displayCart(); 

        } 

        let form = document.getElementById("orderForm"); 

    
            if (form) { 
                form.reset(); 
        } 

        setTimeout(function() { location.reload(); 

            }, 
                2000); 
    
        } 

        catch (err) { 
    
            console.error("Error inside then:", err); 

        } 

    }) 
    
    
        .catch(function(error) { 
        console.error('Failed ...', error); 
        alert("Failed to send order. Please Try again"); 

    }); 

});

console.log("Email sender working");