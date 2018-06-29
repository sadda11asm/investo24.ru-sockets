let mysql = require('mysql2/promise');

module.exports = async function(query, data)
{
	let con = await mysql.createConnection(config.server);
	try
	{
		let res;
		if(data) res = await con.query(query, data);
		else res = await con.query(query);
		return res[0];
	}
	catch(err)
	{
		console.log('ERROR: ' + err);
		return err;
	}
	finally
	{
		con.end();
	}
}