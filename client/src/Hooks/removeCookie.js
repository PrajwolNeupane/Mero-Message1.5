import Cookies from 'js-cookie';

const removeCookie = (name) => {
    return Cookies.remove(name);
}

export default removeCookie;;