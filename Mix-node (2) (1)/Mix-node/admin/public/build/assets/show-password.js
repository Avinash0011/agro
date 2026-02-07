"use strict";

// for show password 
let createpassword = (type, ele) => {
    const inputElement = document.getElementById(type);
    if (!inputElement) {
        console.error(`Element with id ${type} not found.`);
        return;
    }

    inputElement.type = inputElement.type === "password" ? "text" : "password";
    const icon = ele.querySelector('i');
    if (icon) {
        if (icon.classList.contains("ri-eye-line")) {
            icon.classList.remove("ri-eye-line");
            icon.classList.add("ri-eye-off-line");
        } else {
            icon.classList.add("ri-eye-line");
            icon.classList.remove("ri-eye-off-line");
        }
    }
};
