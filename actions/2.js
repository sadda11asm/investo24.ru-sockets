module.exports = async function(data)
{
	await QUERY('UPDATE message SET is_read = 1 WHERE chat_id = ? AND sender_id <> ? AND is_read = 0', [data.chat_id, data.user_id]);
}