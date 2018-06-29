module.exports = async function(data)
{
	if(!data.user_id) 		{ log('user_id'); 	return; }
	if(data.type == null) 	{ log('type'); 		return; }
	if(!data.content) 		{ log('content'); 	return; }
	if(!data.chat_id) 		{ log('chat_id'); 	return; }

	await QUERY('INSERT INTO message(sender_id, chat_id, content, type) VALUES (?,?,?,?)',
		[data.user_id, data.chat_id, data.content, data.type]);

	let [userInfo] = await QUERY( config.userInfo, [data.user_id]);
	
	data.user_ava = userInfo.avatar;
	data.senderName = userInfo.fio;
	data.date = new Date();


	let users = await QUERY('select user from chat_members where chat = ?', [data.chat_id]);

	for(let i = 0; i<users.length; i++)
	{
		wss.clients.forEach((ws) => 
			{
                if(ws.userid == users[i].user) 
                	ws.send(JSON.stringify(data));
        	});
	}
}


function log(u)
{
	console.log( 'ERROR: ' + u + ' is undefined')
}