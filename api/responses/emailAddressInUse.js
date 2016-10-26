module.exports = function emailAddressInUse(){
	var res = this.res;
	
	return res.send(400, 'Email address is already token by another user.');
};