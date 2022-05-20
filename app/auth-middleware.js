const {User, AuthToken} = require('../database/models');

module.exports = async function (req, res, next) {
	// Look for an authorization header or auth_token in the cookies
	const token
    = req.cookies.auth_token || req.headers.authorization;

	// If a token is found we will try to find it's associated user
	// If there is one, we attach it to the req object so any
	// following middleware or routing logic will have access to
	// the authenticated user.
	if (token) {
		// Look for an auth token that matches the cookie or header
		const authToken = await AuthToken.find(
			{where: {token}, include: User},
		);

		// If there is an auth token found, we attach it's associated
		// user to the req object so we can use it in our routes
		if (authToken) {
			req.user = authToken.User;
		}
	}

	next();
};
