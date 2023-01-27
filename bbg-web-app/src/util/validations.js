export const isValidEmail = (string) => {
    var regexEmail = /\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;

        if (regexEmail.test(string)) {
            return true;
        } else {
            return false;
        }
}

export const isValidPhone = (string) => {
     // eslint-disable-next-line
    var regexPhone = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im
    if (regexPhone.test(string)) {
        return true;
    } else {
        return false;
    }
}