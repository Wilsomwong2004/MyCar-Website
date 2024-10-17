document.addEventListener('DOMContentLoaded', function () {
    const goBackButtons = document.querySelectorAll('.btn-primary, .btn-bottom');

    function savePreviousPage() {
        const currentPage = window.location.href.split('?')[0]; // Remove any existing parameters
        const previousPage = document.referrer;
        if (previousPage && !previousPage.includes(currentPage)) {
            localStorage.setItem('previousPage', previousPage);
            const newUrl = new URL(currentPage);
            newUrl.searchParams.set('from', encodeURIComponent(previousPage));
            window.history.replaceState({}, '', newUrl);
        }
    }

    function getPreviousPage() {
        const urlParams = new URLSearchParams(window.location.search);
        const fromParam = urlParams.get('from');
        if (fromParam) {
            return decodeURIComponent(fromParam);
        }
        return localStorage.getItem('previousPage') || '/'; // Fallback to home page
    }

    function goBack(event) {
        event.preventDefault();
        const previousPage = getPreviousPage();
        window.location.href = previousPage;
    }

    // Save the previous page when the page loads
    savePreviousPage();

    goBackButtons.forEach(button => {
        button.addEventListener('click', goBack);
    });

    if (goBackButtons.length === 0) {
        console.error('No Go Back buttons found!');
    }
});