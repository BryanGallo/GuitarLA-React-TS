import { useState, useEffect, useMemo } from "react";
import { db } from "../data/db.js";
import { Guitar, CartItem, GuitarID } from "../types/index.js";
export const useCart = () => {
    const initialState = (): CartItem[] => {
        const state = localStorage.getItem("cart");
        return state ? JSON.parse(state) : [];
    };
    //si le asigno db al state guitarras sin usar useEffect no tenemos que indicar a TS el type
    // const [guitarras, setGuitarras] = useState(db);
    const [guitarras, setGuitarras] = useState<Guitar[]>([]);
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

    function addtoCart(item: Guitar) {
        //Validando si la guitarra ya esta agregada
        const exist = cart.findIndex((c) => c.id === item.id);
        console.log(exist);
        if (exist === -1) {
            const newItem: CartItem = { ...item, quantity: 1 };
            setCart([...cart, newItem]);
        } else {
            if (cart[exist].quantity < MAX_ITEMS) {
                const updateCart = [...cart];
                updateCart[exist].quantity++;
                setCart(updateCart);
            }
        }
    }

    function removeCart(id: GuitarID) {
        const prevCart = cart.filter((item) => item.id !== id);
        setCart(prevCart);
    }

    function increaseQuantity(id: GuitarID) {
        const updateCart = cart.map((item) => {
            if (item.id === id && item.quantity < MAX_ITEMS) {
                const up = { ...item, quantity: item.quantity + 1 };
                return up;
            }
            return item;
        });
        setCart(updateCart);
    }

    function decreaseQuantity(id: Guitar["id"]) {
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
