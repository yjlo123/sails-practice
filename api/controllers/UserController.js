/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	
	index: function(req, res, next){
		User.find(function foundUsers (err, users){
			if(err) return next(err);
			res.view({
				users: users
			});
		});
	},
	
	edit: function(req, res, next) {
		User.findOne(req.param('id'), function foundUser(err, user){
			if(err) return next(err);
			if(!user) return next();
			
			res.view({
				user: user
			});
		});
	},
	
	show: function(req, res, next){
		User.findOne(req.param('id'), function foundUser (err, user){
			if(err) return next(err);
			if(!user) return next('User doesn\'t exist.');
			return res.view('user/show', {
					user: user
				});
		});
	},
	
	update: function(req, res, next){
		User.update(req.param('id'), req.params.all(), function userUpdated(err){
			if(err) return res.redirect('/user/edit' + req.param('id'));
		
			res.redirect('/user/show/' + req.param('id'));
		});
	},
	
	destroy: function (req, res, next){
		User.findOne(req.param('id'), function foundUser(err, user){
			if(err) return next(err);
			if(!user) return next('User doesn\'t exist.');
			
			User.destroy(req.param('id'), function userDestroy(err){
				if(err) return next(err);
			});
			res.redirect('/user');
		});
	},
	
	login: function(req, res){
		User.findOne({
			email: req.param('email')
		}, function foundUser(err, user){
			if (err) return res.negotiate(err);
			if (!user) return res.notFound();
			
			require('machinepack-passwords').checkPassword({
				passwordAttempt: req.param('password'),
				encryptedPassword: user.encryptedPassword
			}).exec({
				error: function (err){
					return res.negotiate(err);
				},
				
				incorrect: function(){
					return res.notFound();
				},
				
				success: function(){
					req.session.me = user.id;
					return res.ok();
				}
			});
		});
	},
	
	
	signup: function(req, res){
		var Passwords = require('machinepack-passwords');
		// Encrypt a string using the BCrypt algorithm.
		Passwords.encryptPassword({
			password: req.param('password'),
			difficulty: 10,
		}).exec({
			// An unexpected error occurred.
			error: function (err){
				return red.negotiate(err);
			},
			// OK.
			success: function (encryptedPassword){
				User.create({
					name: req.param('name'),
					email: req.param('email'),
					encryptedPassword: encryptedPassword,
					lastLoggedIn: new Date()
				}, function userCreated(err, newUser){
					if(err){
						//console.log("err: ", err);
						//console.log("err.invalidAttributes: ", err.invalidAttributes);
						
						if(err.invalidAttributes && err.invalidAttributes.email && err.invalidAttributes.email[0]
							&& err.invalidAttributes.email[0].rule === 'unique'){
								return res.emailAddressInUse();
							}
						
						return res.negotiate(err);
					}
					
					// log user in
					req.session.me = newUser.id;
					
					// send back the id of the new user
					return res.json({
						id: newUser.id
					});
				});
			}
		});
	},
	
	logout: function(req, res){
		User.findOne(req.session.me, function foundUser(err, user){
			if(err) return res.netotiate(err);
			
			if(!user){
				sails.log.verbose('Session refers to a user who no longer exists.');
				return res.backToHomePage();
			}
			
			req.session.me = null;
			
			return res.backToHomePage();
		});
	}
};

