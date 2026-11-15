import { hdmi } from './tools.mjs';

export const tools = {
  hdmi: {
    title: ['TV, console and eARC connection planner','電視、遊戲機及 eARC 接駁規劃器'],
    fields: [
      ['Total HDMI inputs','HDMI 輸入總數',4,1,1],
      ['HDMI inputs supporting 4K120','支援 4K120 的 HDMI 口數',2,0,1],
      ['Does eARC occupy a 4K120 input? (1 yes, 0 no)','eARC 是否佔用 4K120 口？（1 是，0 否）',1,0,1,1],
      ['Consoles needing a 4K120 input','需要 4K120 口的主機數量',2,0,1],
      ['Other HDMI devices excluding soundbar','其他 HDMI 裝置數量（Soundbar 除外）',0,0,1],
    ],
    labels: [['4K120 inputs remaining','剩餘 4K120 口'],['Total HDMI inputs remaining','剩餘 HDMI 口總數']],
    calculate: hdmi,
    note: ['This setup reserves one eARC input for the soundbar. A negative result is a shortfall. Verify VRR per port, cable requirements and model settings. The calculation assumes direct TV connections.', '已預留一個 eARC 口接 Soundbar，負數代表端口不足。請逐口核實 VRR、線材及電視設定。此工具按裝置直接接電視計算。'],
  },
};
