module.exports = async function(id)
{
	await QUERY('DELETE FROM active_users where user_id = ?', [id]);
	wss.clients.forEach((ws_)=> 
	 	{ ws_.send(JSON.stringify({ action: 3, user_id : id })); })
	console.log('- user with id ' + id);
}