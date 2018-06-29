let notice = require('./notice');

module.exports = async function(data)
{
	if(!data.user_id) { log('user_id'); return; }
	if(!data.proj_id) { log('proj_id'); return; }

	let [userInfo] = await QUERY(config.userInfo, [data.user_id]);
	if(!userInfo) { log('userInfo'); return; }
	
	let fio = userInfo.fio;

	let [projinfo] = await QUERY('SELECT * FROM project where id = ?', [data.proj_id]);
	if(!projinfo) { log('projinfo'); return; }

	let projname = projinfo.name;
	let owner = projinfo.user_id;

	let content = "Пользователь <a href = '/' >"+ fio + "</a> отправил вам заявку на инсестирование проекта проект <a href = '/' >"+ projname + "</a>";
	let myContent = "Вы отправили заявку на инвестирование проекта <a href = '/' >"+ projname + "</a>";

	let note =
	{
		user_id: data.user_id,
		owner,
		content, 
		myContent,
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