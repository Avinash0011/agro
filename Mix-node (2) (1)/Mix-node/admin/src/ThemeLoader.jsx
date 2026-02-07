import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ThemeLoader = ({ children }) => {
    const location = useLocation();
    const path = location.pathname;

    // Helper to load CSS
    const loadCSS = (href) => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        link.className = 'dynamic-resource'; 
        document.head.appendChild(link);
    };

    // Helper to load Scripts
    const loadJS = (src, defer = false) => {
        const script = document.createElement('script');
        script.src = src;
        script.async = false;
        if (defer) script.defer = true;
        script.className = 'dynamic-resource';
        document.body.appendChild(script);
    };

    // Helper to change Favicon
    const changeFavicon = (href) => {
        let link = document.querySelector("link[rel~='icon']");
        if (!link) {
            link = document.createElement('link');
            link.rel = 'icon';
            document.head.appendChild(link);
        }
        link.href = href;
    };

    useEffect(() => {
        const isAdmin = path.startsWith('/admin') || path.startsWith('/login') || path.startsWith('/register');

        // 1. Clear all previously loaded dynamic resources
        const resources = document.querySelectorAll('.dynamic-resource');
        resources.forEach(res => res.remove());

        if (isAdmin) {
            // --- ADMIN & AUTH MODE ---
            document.body.setAttribute('data-nav-layout', 'vertical');
            document.body.setAttribute('data-theme-mode', 'light');
            
            changeFavicon('/website_assets/img/favicon.ico');
            // CSS
            loadCSS('/build/assets/libs/bootstrap/css/bootstrap.min.css');
            loadCSS('/build/assets/icon-fonts/icons.css');
            loadCSS('/build/assets/style.css');
            loadCSS('/build/assets/app-fce3f544.css');
            loadCSS('/build/assets/libs/node-waves/waves.min.css');
            loadCSS('/build/assets/libs/simplebar/simplebar.min.css');
            loadCSS('/build/assets/libs/flatpickr/flatpickr.min.css');
            loadCSS('/build/assets/libs/%40simonwep/pickr/themes/nano.min.css');
            loadCSS('/build/assets/libs/choices.js/public/assets/styles/choices.min.css');
            loadCSS('/build/assets/libs/swiper/swiper-bundle.min.css');

            // JS (Order matters for dependencies)
            loadJS('https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js');
            loadJS('/build/assets/main.js');
            loadJS('/build/assets/libs/choices.js/public/assets/scripts/choices.min.js');
            loadJS('/build/assets/libs/bootstrap/js/bootstrap.bundle.min.js');
            loadJS('/build/assets/libs/swiper/swiper-bundle.min.js');

        } else {
            // --- WEBSITE MODE ---
            document.body.removeAttribute('data-nav-layout');
            changeFavicon('/website_assets/img/favicon.ico');

            // CSS
            loadCSS('/website_assets/css/bootstrap.min.css');
            loadCSS('/website_assets/css/animate.min.css');
            loadCSS('/website_assets/css/magnific-popup.css');
            loadCSS('/website_assets/fontawesome/css/all.min.css');
            loadCSS('/website_assets/font-flaticon/flaticon.css');
            loadCSS('/website_assets/css/dripicons.css');
            loadCSS('/website_assets/css/slick.css');
            loadCSS('/website_assets/css/meanmenu.css');
            loadCSS('/website_assets/css/default.css');
            loadCSS('/website_assets/css/style.css');
            loadCSS('/website_assets/css/responsive.css');

            // JS
            loadJS('https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js');
        }

    }, [path]);

    return children;
};

export default ThemeLoader;