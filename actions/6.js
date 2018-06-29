let notice = require('./notice');

module.exports = async function(data)
{
	if(!data.user_id) { log('user_id'); return; }
	if(!data.doc_id) { log('doc_id'); return; }

	let [userInfo] = await QUERY(config.userInfo, data.user_id);
	if(!userInfo) { log('userInfo'); return; }

	let fio = userInfo.fio;

	let [projinfo] = await QUERY(`SELECT * FROM project as p join common_documents as d on  p.id = d._project where d.id = ?`, [data.doc_id]);
	if(!projinfo) { log('projinfo'); return; }

	let projname = projinfo.name;

	let owner = undefined;
	if(projinfo.user_id == data.user_id)
	{
		let [docinfo] = await QUERY('SELECT * FROM common_documents where id = ?', [data.doc_id]);
		owner = docinfo._user;
	}
	else
	{
		owner = projinfo.user_id;
	}

	let content = 'Партнер <a href = "/">' + fio + '</a> подписал документ по проекту <a href = "/">' +projname+'</a>';
	let myContent = "Вы подписали документ по проекту <a href = '/' >"+ projname + "</a>";

	let note =
	{
		user_id: data.user_id,
		owner,
		content, 
		myContent,
		type: 1,
		proj_id: projinfo.id,
		action: data.action
	}
	notice(note);
}

function log(u)
{
	console.log( 'ERROR: ' + u + ' is undefined')
}