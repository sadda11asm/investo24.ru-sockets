module.exports = async function(id)
{
	let active = await QUERY('SELECT user_id FROM active_users WHERE user_id = ?', [id]);
	if(active.length == 0)
	{
		await QUERY('INSERT INTO active_users (user_id) values (?)', [id]);
		console.log('+ user with id ' + id);
	}
}