import { createContext, useContext, useState, useEffect } from "react";
import apiAxios from "../services/apiAxios";


const AuthContext = createContext(null); //se crea un contexto, que se puede interpretar por
//ahora como un contenedor especial de React, que conteine componentes como Provider, Consumer,
//etc. Ahora, el contexto recibe un aprametro nulo porque todavia no hay datos

//se crea un componente AuthProvider, children es todo lo que esta adentro.
//AuthPorovider es un componente que se define
//la funcion AuthProvider deconstruye props con children, recibe ese parametro
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);//estado de user
    const [token, setToken] = useState(
        localStorage.getItem("token")
        //token es un elemento de seguridad criptografico
    );//busca un token guardado anteriormente en el localStorage, si existe
    //se inicia sesion, si no, el usuario no esta logeado
    const isAuth = !!token;//convierte el token en booleano, si existe true, si no, false

    //Configurar axios cuando hay token
    //axios.defaults: se aplica a todas las peticiones HTTP manejadas por axios
    useEffect(() => {
        if (token) {
            //axios.defaults.headers.common: El valor de todo header "Authorzation" en
            //cada peticion HTTP que se realice tendra el valor del token
            apiAxios.defaults.headers.common[
                "Authorization"
            ] = `Bearer ${token}`;
        } else {
            //sino, se borra el header Authorization
            delete apiAxios.defaults.headers.common["Authorization"];
        }
    }, [token]);//cada vez que se cambie token, se verificara
    
    const login = async (name, password) => {

        try{
            const response = await apiAxios.post(
                'api/login',
                { name, password }
            );

            const { token, user } = response.data;

            console.log(token, user);

            setToken(token);
            setUser(user);
            localStorage.setItem("token", token);
        }catch(error){
            throw error; // ← CLAVE
        }

    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem("token");
    };

    return (
        //AuthContex.Provider es un componente relacionado al contexto de Auth
        <AuthContext.Provider
        //value contiene los datos que el Contexto creado va a exponer gloablemente a todos
        //los componentes bajo el Provider
            value={{
                user,//user sera un dato expuesto en todo el componente App.js
                token,//token estara expuesto en todo el componente App.js
                isAuth,//isAuth sera un dato expuesto en App.js
                login,//metodo expuesto en App.js
                logout//metodo expuesto en App.js
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    //useContext es un hook de lectura de datos del contexto
    return useContext(AuthContext);
}