module.exports = function backToHomePage(statusCode){
	var req = this.req;
	var res = this.res;
	
	// All done either send back an empty response w/ just the status code
	// (e.g. for AJAX requests)
	if(req.wantsJSON){
		return res.send(statusCode||200);
	}
	
	return res.redirect('/');
}