let notice = require('./notice');

module.exports = async function(data)
{
	if(!data.req_id) { log('req_id'); return; }
	if(!data.proj_id) { log('proj_id'); return; }
	
	let [projinfo] = await QUERY('SELECT * FROM project WHERE id = ?', [data.proj_id]);
	let kind_activity = projinfo.kind_activity;
	let projname = projinfo.name;

	let user = undefined;  

	if(kind_activity == 1)
	{
		let [reqinfo] = await QUERY('SELECT * FROM builder_invest where id = ?', [data.req_id]); 
		if(!reqinfo) { log('reqinfo'); return; }
		user = reqinfo._user;
	}
	else
	{
		let [reqinfo] = await QUERY('SELECT * FROM project_invest where id = ?', [data.req_id]);
		if(!reqinfo) { log('reqinfo'); return; }
		user = reqinfo.user_id;
	}

	let content = projname  +' : ваша заявка отклонена';

	let note =
	{
		owner: user,
		content, 
		type: 0,
		proj_id: data.proj_id,
		action: data.action
	}
	notice(note);

}

function log(u)
{
	console.log( 'ERROR: ' + u + ' is undefined')
}