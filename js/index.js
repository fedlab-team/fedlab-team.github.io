(function (window) {
    var header = document.querySelector('.fedlab-header'),
        headerH = header.clientHeight;

    window.addEventListener('scroll', function () {
        let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;

        if (scrollTop > 0) {
            header.className.indexOf(' white') < 0 && (header.className += ' white');
        } else if (scrollTop === 0) {
            header.className = header.className.replace(/\swhite/, '');
        }

        if (scrollTop > headerH) {
            header.className.indexOf(' hide') < 0 && (header.className += ' hide');
        } else {
            header.className = header.className.replace(/\shide/, '');
        }
    })
})(window);