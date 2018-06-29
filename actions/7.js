let notice = require('./notice');

module.exports = async function(data)
{
	if(!data.user_id) { log('user_id'); return; }
	if(!data.proj_id) { log('proj_id'); return; }

	let users = await QUERY(`select id from investo23.users
						where id in (SELECT _user FROM investo23.builder_invest WHERE _project = ?) 
						or id in (SELECT user_id FROM investo23.project_subscription WHERE project_id = ?)
						or id in (SELECT user_id from investo23.project where id = ?)`, [data.proj_id, data.proj_id,data.proj_id]);

	let [projinfo] = await QUERY(`select * from project where id = ?`, data.proj_id);
	if(!projinfo) { log('projinfo'); return; }

	let projname = projinfo.name;

	let [stage_info] = await QUERY(`select * from builder_stage where id = ?`, data.stad_id);
	if(!stage_info) { log('stage_info'); return; }

	let alert = stage_info.alert;

	let content = projname + ':' + alert;

	let note =
	{
		users,
		content,
		type: 1, 
		proj_id: data.proj_id,
		action: data.action
	}
	notice(note);

}

function log(u)
{
	console.log( 'ERROR: ' + u + ' is undefined')
}