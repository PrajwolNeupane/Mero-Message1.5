import Cookies from 'js-cookie';

const getCookie = (name) =>{
    return Cookies.get(name);
}

export default getCookie;