import {WebSocketServer,WebSocket} from 'ws';
const port=Number(process.env.PORT||process.env.NOTFLIX_CONTROL_PORT||8787);const token=process.env.NOTFLIX_CONTROL_TOKEN||'';const wss=new WebSocketServer({port});
function broadcast(sender,payload){for(const client of wss.clients){if(client!==sender&&client.readyState===WebSocket.OPEN&&client.authorized)client.send(payload);}}
wss.on('connection',(socket,request)=>{const url=new URL(request.url,`http://${request.headers.host}`);socket.authorized=!token||url.searchParams.get('token')===token;if(!socket.authorized){socket.close(4001,'Unauthorized');return;}socket.send(JSON.stringify({type:'server-ready',payload:{at:Date.now()}}));socket.on('message',(data)=>{if(data.length>64000)return;let parsed;try{parsed=JSON.parse(data.toString());}catch{return;}if(!parsed?.type)return;broadcast(socket,JSON.stringify({...parsed,relayAt:Date.now()}));});});
console.log(`NOTFLIX control relay listening on ws://0.0.0.0:${port}`);
