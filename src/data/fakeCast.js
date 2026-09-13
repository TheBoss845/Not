const firstNames = [
  'Adrian','Mara','Theo','Nina','Caleb','Sloane','Miles','Tessa','Rowan','Elena','Julian','Cassidy',
  'Damon','Ivy','Elliot','Rhea','Noah','Maeve','Jonah','Lena','Felix','Cora','Grant','Willa',
  'Simon','Avery','Micah','Daphne','Owen','Celia','Bennett','June'
];

const lastNames = [
  'Vale','Mercer','Holloway','Quinn','Sterling','Voss','Marlowe','Keene','Rowe','Briar','Dane','Calloway',
  'Wren','Sutton','Blake','Reeve','Hart','Lowell','Frost','Ellis','West','Monroe','Hayes','Pryce',
  'Bellamy','Nash','Arden','Cross','Sinclair','Maddox','Reyes','Lark'
];

function hash(text=''){
  let value=2166136261;
  for(const char of text){value^=char.charCodeAt(0);value=Math.imul(value,16777619);}
  return value>>>0;
}

export function castFor(id='',count=3){
  const seed=hash(id);
  const cast=[];
  for(let i=0;i<count;i+=1){
    const first=firstNames[(seed+i*7+(seed>>>8))%firstNames.length];
    const last=lastNames[((seed>>>3)+i*11+(seed>>>16))%lastNames.length];
    let name=`${first} ${last}`;
    if(cast.includes(name))name=`${firstNames[(seed+i*13+5)%firstNames.length]} ${last}`;
    cast.push(name);
  }
  return cast;
}
