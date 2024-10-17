document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM fully loaded and parsed');

    const primaryButton = document.querySelector('.btn-primary');
    const bottomButton = document.querySelector('.btn-bottom');

    function savePreviousPage() {
        const currentPage = window.location.href.split('?')[0];
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
        return localStorage.getItem('previousPage') || '/';
    }

    function goBack(event) {
        event.preventDefault();
        const previousPage = getPreviousPage();
        window.location.href = previousPage;
    }

    savePreviousPage();

    if (primaryButton) {
        primaryButton.addEventListener('click', goBack);
    }

    if (bottomButton) {
        bottomButton.addEventListener('click', goBack);
    }

    // Animated statistics
    const statItems = document.querySelectorAll('.stat-item h3');
    console.log('Found stat items:', statItems.length);

    if (typeof countUp === 'undefined') {
        console.error('countUp is not defined. Make sure you have included the CountUp.js library.');
    } else {
        console.log('countUp is available');
    }

    statItems.forEach((item, index) => {
        console.log(`Processing item ${index}:`, item.textContent);
        const targetValue = parseInt(item.textContent.replace(/,/g, ''));
        console.log(`Target value for item ${index}:`, targetValue);

        try {
            const options = {
                useEasing: true,
                useGrouping: true,
                separator: ',',
                decimal: '.'
            };

            const countUpAnim = new countUp.CountUp(item, targetValue, options);

            if (!countUpAnim.error) {
                console.log(`Starting animation for item ${index}`);
                countUpAnim.start();
            } else {
                console.error(`Error creating CountUp for item ${index}:`, countUpAnim.error);
            }
        } catch (error) {
            console.error(`Error processing item ${index}:`, error);
        }
    });
});