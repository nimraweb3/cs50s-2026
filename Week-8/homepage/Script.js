document.addEventListener('DOMContentLoaded', function() {

    // Auto-update footer year on every page
    let yearSpan = document.querySelector('#year');
    if (yearSpan) {
        yearSpan.innerHTML = new Date().getFullYear();
    }

    // Reveal button on homepage
    let revealBtn = document.querySelector('#revealBtn');
    if (revealBtn) {
        revealBtn.addEventListener('click', function() {
            document.querySelector('#revealText').innerHTML =
                'Smart contracts, trading tools, and everything in between!';
        });
    }

    // Contact form validation and alert
    let contactForm = document.querySelector('#contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault();
            document.querySelector('#formAlert').classList.remove('d-none');
            contactForm.reset();
        });
    }

});