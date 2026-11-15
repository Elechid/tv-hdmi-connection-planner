export function hdmi(count,list,earc,ps,xbox) {
  const ids=list ? list.split(/[,，]+/).map(x=>Number(x.trim())) : [];
  if (earc>count || ids.some(x=>!Number.isInteger(x)||x<1||x>count) || new Set(ids).size!==ids.length) throw new RangeError();
  const ports=ids.filter(x=>x!==earc).sort((a,b)=>a-b);
  const pick=on=>!on ? ['Skipped','未選擇'] : ports.length ? 'HDMI '+ports.shift() : ['No suitable port left','沒有合適端口'];
  return ['HDMI '+earc,pick(ps),pick(xbox),ports.length];
}
