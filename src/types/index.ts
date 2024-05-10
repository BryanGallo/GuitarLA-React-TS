export type Guitar = {
    id: number;
    name: string;
    image: string;
    description: string;
    price: number;
};
export type CartItem = Guitar & {
    quantity: number;
};

// export interface GuitarProps extends Guitar{
//     quantity: number;
// }
//Poedmos usar Pick que trae solo lo que requerimos el padre
// export type GuitarID = Pick<Guitar, "id">;
//O podemos usar algo que se conoce como Lookup pero solo podemos extraer un valor del padre no varios como con Pick
//Tambien podemos usar el Lookup directamente en useCart Linea 60
export type GuitarID= Guitar['id']
