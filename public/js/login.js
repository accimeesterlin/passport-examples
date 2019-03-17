$('form').on('submit', (event) => {
    event.preventDefault();
    const email = $('input[name="email"]').val().trim();
    const password = $('input[name="password"]').val().trim();

    $.ajax({
        url: '/login',
        method: 'POST',
        data: {
            email,
            password
        }
    })
        .then((data) => {
            window.location.href = '/profile';
        })
        .catch((error) => {
            window.location.href = '/signup';
        });
});