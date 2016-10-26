/**
 * PageController
 *
 * @description :: Server-side logic for managing pages
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	showHomePage: function(req, res){
		if (!req.session.me){
			return res.view('static/index');
		}
		
		User.findOne(req.session.me, function(err, user){
			if (err){
				return res.negotiate(err);
			}
			
			if (!user){
				sails.log.verbose('Session refers to a user who no longer exists.');
				return res.view('static/index');
			}
			
			return res.view('dashboard', {
				me: {
					id: user.id,
					name: user.name,
					email: user.email,
					isAdmin: !!user.admin
				}
			});
		});
	}
};

