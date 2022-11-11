import Cookies from 'js-cookie';

const setCookie = (name,token) => {
    return Cookies.set(name,token);
}

export default setCookie;;