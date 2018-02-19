const port = process.env.PORT || 5000;
if(process.env.NODE_ENV === 'production'){
	module.exports = {
		mongoURI: 'mongodb://chat92:kar6670929497@ds233895.mlab.com:33895/chat-92',
		ioURI : 'https://obscure-refuge-74658.herokuapp.com:'+ port
}
}else{
	module.exports = {
		mongoURI: 'mongodb://127.0.0.1/chat',
		ioURI : 'http://localhost:'+ port
	}
}