$('form').on('submit', (event) => {
    event.preventDefault();
    const username = $('input[name="username"]').val().trim();
    const password = $('input[name="password"]').val().trim();
    const position = $('input[name="position"]').val().trim();
    const email = $('input[name="email"]').val().trim();

    $.ajax({
        url: '/signup',
        method: 'POST',
        data: {
            username,
            password,
            position,
            email
        }
    })
        .then((data) => {
            window.location.href = '/profile';
        })
        .catch((error) => {
            window.location.href = '/signup';
        });
})