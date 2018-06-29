module.exports = async function(data)
{
//Один к одному
	if(!data.users)
	{
		if(data.user_id)
		{
			await QUERY("INSERT INTO notification (user_id, content, type, is_read, project_id) VALUES (?,?,?,?,?)", 
			[data.user_id, data.myContent, data.type, 1, data.proj_id]);
		}

		let insert = await QUERY("INSERT INTO notification (user_id, content, type, is_read, project_id) VALUES (?,?,?,?,?)", 
			[data.owner, data.content, data.type, 0, data.proj_id]);

		let toSend = { action: data.action, content: data.content, noteId: insert.insertId }

		wss.clients.forEach((ws) => 
		{
			if (ws.userid == data.owner) 
			{
				ws.send(JSON.stringify(toSend));
				sendLog(toSend, ws.userid);
			}
		});
	}
//Куча
	else
	{
		let users = data.users;
		for(let i = 0; i<users.length; i++)
		{
			let insert = await QUERY("INSERT INTO notification (user_id, content, type, is_read, project_id) VALUES (?,?,?,?,?)", 
			[users[i].id, data.content, data.type, 0, data.proj_id]);

			let toSend = { action: data.action, content: data.content, noteId: insert.insertId }

			wss.clients.forEach((ws)=>
				{
					if(ws.userid == users[i].id)
					{
						ws.send(JSON.stringify(toSend));
						sendLog(toSend, ws.userid);
					}
				});
		}
	}
} 

function sendLog(data, id)
{
	console.log('-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-')
	console.log('Sended for user: ' + id)
	console.log(data)
}