import { useState, useEffect, useMemo } from "react";
import { db } from "../data/db.js";
export const useCart = () => {
    const initialState = () => {
        const state = localStorage.getItem("cart");
        return state ? JSON.parse(state) : [];
    };
    const [guitarras, setGuitarras] = useState([]);
    const [cart, setCart] = useState(initialState);

    const MAX_ITEMS = 5;
    const MIN_ITEMS = 1;

    useEffect(() => {
        setGuitarras(db);
    }, []);

    useEffect(() => {
        function saveLocalStorage() {
            localStorage.setItem("cart", JSON.stringify(cart));
        }
        saveLocalStorage();
    }, [cart]);

    function addtoCart(item) {
        //Validando si la guitarra ya esta agregada
        const exist = cart.findIndex((c) => c.id === item.id);
        console.log(exist);
        if (exist === -1) {
            item.quantity = 1;
            setCart([...cart, item]);
            //otra opcion tomando en cuenta ya sabe que hay en el state desde que se lo declara va a estar asociada con el state de cart (aqui prevCart toma el valor de cart )
            // setCart((prevCart)=>[...prevCart,item])
        } else {
            if (cart[exist].quantity < MAX_ITEMS) {
                const updateCart = [...cart];
                updateCart[exist].quantity++;
                setCart(updateCart);
            }
        }
        console.log(item.quantity);
    }

    function removeCart(id) {
        const prevCart = cart.filter((item) => item.id !== id);
        setCart(prevCart);
    }

    function increaseQuantity(id) {
        const updateCart = cart.map((item) => {
            if (item.id === id && item.quantity < MAX_ITEMS) {
                const up = { ...item, quantity: item.quantity + 1 };
                return up;
            }
            return item;
        });
        setCart(updateCart);
    }

    function decreaseQuantity(id) {
        console.log(id);
        const updateCart = cart.map((item) => {
            if (item.id === id && item.quantity > MIN_ITEMS) {
                return {
                    ...item,
                    quantity: item.quantity - 1,
                };
            }
            return item;
        });
        setCart(updateCart);
    }

    function cleanCart() {
        setCart([]);
    }

    //Usando UseMemo y con este hook es para el performance par que no haga render hasta que cambie algo que te paso en el arreglo de dependencias en este caso cart
    const isEmpty = useMemo(() => cart.length === 0, [cart]);
    // const isEmpty = () => cart.length === 0;
    const cartTotal = () =>
        //calculando el total del carrito
        cart.reduce((total, item) => total + item.quantity * item.price, 0);
    //sin stateDerivado
    // const cartTotal = cart.reduce(
    //     (total, guitar) => total + guitar.price * guitar.quantity,
    //     0
    // );

    return {
        cart,
        removeCart,
        increaseQuantity,
        decreaseQuantity,
        cleanCart,
        guitarras,
        addtoCart,
        isEmpty,
        cartTotal,
    };
};
