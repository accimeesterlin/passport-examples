module.exports = (app, passport) => {
    app.get('/', function (req, res) {
        res.render('home');
    });

    app.post('/signup', function(req, res) {
        passport.authenticate('local-signup', function(err, user, info) {
            if (err || !user) {
                return res.redirect('/signup');
            }
            return res.redirect(`/profile?email=${user.email}&id=${user.id}`);
        })(req, res);
    });

    app.post('/login', function(req, res) {
        passport.authenticate('local-signin', function(err, user, info) {
            if (err || !user) {
                return res.redirect('/login');
            }
            req.user = user;
            return res.redirect(`/profile?email=${user.email}&id=${user.id}`);
        })(req, res)
    });

    app.get('/login', function (req, res) {
        res.render('login');
    });

    app.get('/signup', function (req, res) {
        res.render('signup');
    });


    app.get('/profile', function (req, res) {
        const { email, id } = req.query;
        res.render('profile', {
            user: {
                email,
                id
            }
        });
    });
}