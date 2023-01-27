export const getFormattedDate = (date) => {
    let year = date.getFullYear();
    let month = (1 + date.getMonth()).toString().padStart(2, "0");
    let day = date.getDate().toString().padStart(2, "0");

    return month + "-" + day + "-" + year;
};

export const toDateAdd = (date) => {
    const date1 = new Date(date);
    let a = date1.getTimezoneOffset() * 60000;
    let b = new Date(date1.getTime() + a);
    return b;
};

export const formatterForCurrency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

export const frontEndSearch = (fields, searchString) => {
    const formattedSearchString = searchString.toLocaleLowerCase();
    let finalfields = fields?.filter((n) => n);
    for (const text of finalfields) {
        const formattedText = text.toLowerCase();
        if (formattedText.includes(formattedSearchString)) return true;
    }

    return false;
};

export const classNames = (...classes) => {
    return classes.filter(Boolean).join(" ");
};
