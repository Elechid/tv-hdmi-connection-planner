import { hdmi } from './tools.mjs';

export const tools = {
  hdmi: {
    title: ['TV, console and eARC connection planner','電視、遊戲機及 eARC 接駁規劃器'],
    fields: [["Number of TV HDMI inputs", "電視 HDMI 輸入數", 4, 1, 1, 8], ["4K120 ports that also support VRR, e.g. 3,4", "同時支援 4K120 和 VRR 的端口，例如 3,4", "3,4"], ["eARC port number", "eARC 端口編號", 3, 1, 1, 8], ["Plan PS5 (1 yes, 0 no)", "接駁 PS5（1 是，0 否）", 1, 0, 1, 1], ["Plan Xbox (1 yes, 0 no)", "接駁 Xbox（1 是，0 否）", 1, 0, 1, 1]],
    labels: [["Soundbar eARC port", "Soundbar eARC 口"], ["PS5 4K120 + VRR port", "PS5 4K120＋VRR 口"], ["Xbox 4K120 + VRR port", "Xbox 4K120＋VRR 口"], ["Remaining 4K120 + VRR ports", "剩餘 4K120＋VRR 口"]],
    guide: "tv-connection-guide-hong-kong-hdmi-cables-earc-soundbars-consoles",
    intro: ["Example: if HDMI 3 and 4 support both 4K120 and VRR and HDMI 3 is eARC, the soundbar uses HDMI 3, PS5 uses HDMI 4 and Xbox has no remaining suitable direct port.", "例如 HDMI 3 和 4 同時支援 4K120 和 VRR，HDMI 3 是 eARC。Soundbar 接 HDMI 3，PS5 接 HDMI 4，便沒有另一個符合條件的口直駁 Xbox。"],
    calculate: hdmi,
    note: ['This setup reserves one eARC input for the soundbar. A negative result is a shortfall. Verify VRR per port, cable requirements and model settings. The calculation assumes direct TV connections.', '已預留一個 eARC 口接 Soundbar，負數代表端口不足。請逐口核實 VRR、線材及電視設定。此工具按裝置直接接電視計算。'],
  },
};
