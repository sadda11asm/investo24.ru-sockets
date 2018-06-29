let WebSocket = require('ws');
let cookieParser = require('cookie-parser')({secret: 'secret'});

global.config = require('./config/config');
global.wss = new WebSocket.Server({ port: config.port });
global.QUERY = require('./DB/query');

let Action0 = require('./actions/0');
let Action1 = require('./actions/1');
let Action2 = require('./actions/2');
let Action3 = require('./actions/3');
let Action4 = require('./actions/4');
let Action5 = require('./actions/5');
let Action6 = require('./actions/6');
let Action7 = require('./actions/7');
let Action8 = require('./actions/8');
let Action9 = require('./actions/9');

wss.on('connection', async function (ws, req) 
{	
//Данные
	ws.on('message', async function(data)
		{
			data = JSON.parse(data);
			data.user_id = ws.userid;

			log(data);

			if(!data.action) console.log('ERROR: action is undefined');
			else
			{
				switch(data.action)
				{
					case 1: await Action1(data); break;
					case 2: await Action2(data); break;
					case 4: await Action4(data); break;
					case 5: await Action5(data); break;
					case 6: await Action6(data); break;
					case 7: await Action7(data); break;
					case 8: await Action8(data); break;
					case 9: await Action9(data); break;
				}
			}

		});

//Подключение
 	cookieParser(req, null, async function() 
	 	{
	   		ws.userid = req.cookies['userId'];
	   		await Action0(ws.userid);

	   		wss.clients.forEach((ws_)=> 
		    { ws_.send(JSON.stringify({action: 0, user_id : ws.userid})); });
	    });

//Отключение
 	ws.on('close', async function(message) 
	 	{
	 		await Action3(ws.userid);

		 	wss.clients.forEach((ws_)=> 
		 	{ ws_.send(JSON.stringify({ action: 3, user_id : ws.userid })); })
	    });
});

function log(data)
{
	console.log('---------------------------------------------------------------');
	console.log(data);
}

console.log('Запуск выполнен!');