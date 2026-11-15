import { tools } from './settings.mjs';

const byId = id => document.getElementById(id);
const query = new URLSearchParams(location.search);
const key = 'hdmi';
const selected = tools[key];
const form = document.querySelector('form');
const results = document.querySelector('.results');
const language = byId('language');
const lockMode = key === 'lock';
let locale = query.get('lang') === 'zh' ? 1 : 0;

const fields = selected.fields.map(([, , initial, min, step, max]) => {
  const label = document.createElement('label');
  const text = document.createElement('span');
  const input = document.createElement('input');
  input.required = true;
  input.value = initial;
  if (typeof initial === 'number') {
    input.type = 'number';
    input.min = min;
    input.step = step ?? 'any';
    input.max = max ?? 100000;
  } else {
    input.maxLength = 250;
  }
  label.append(text, input);
  form.append(label);
  return {text, input};
});

const cards = selected.labels.map(() => {
  const card = document.createElement('div');
  const text = document.createElement('span');
  const output = document.createElement('output');
  card.append(text, output);
  results.append(card);
  return {text, output};
});

function render() {
  let values = [];
  let invalid = !fields.every(({input}) => input.validity.valid && input.value.trim());
  if (!invalid) {
    try {
      values = selected.calculate(...fields.map(({input}) => input.type === 'number' ? input.valueAsNumber : input.value.trim()));
    } catch (error) {
      if (!(error instanceof RangeError)) throw error;
      invalid = true;
    }
  }
  byId('error').hidden = !invalid;
  byId('copy').disabled = invalid;
  byId('copy-status').textContent = '';
  const format = new Intl.NumberFormat(locale ? 'zh-Hant' : 'en', {maximumFractionDigits: 2});
  cards.forEach(({output}, index) => {
    const value = values[index];
    const unit = selected.labels[index][2];
    output.textContent = invalid ? '—' : typeof value === 'boolean'
      ? (value ? ['Yes','是'] : ['No','否'])[locale]
      : format.format(Math.abs(value) < 1e-9 ? 0 : value) + (unit ? ' ' + unit : '');
  });
  byId('measurements').value = invalid ? '' : values.map((value, i) => selected.fields[i][locale] + ' — ' + value).join('\n');
}

function localize() {
  document.documentElement.lang = locale ? 'zh-Hant' : 'en';
  document.title = selected.title[locale] + ' | Elechid 音立';
  language.textContent = locale ? 'English' : '繁體中文';
  language.lang = locale ? 'en' : 'zh-Hant';
  byId('title').textContent = selected.title[locale];
  byId('intro').textContent = ['Replace the example values with your own measurements.','請用你的實際規格或量度結果取代示例數字。'][locale];
  byId('note').textContent = selected.note[locale];
  byId('source').textContent = ['Source code','原始碼'][locale];
  byId('brand').href = 'https://elechid.com' + (locale ? '/' : '/en/');
  byId('error').textContent = ['Check all inputs and confirm the listed specifications agree.','請核對各欄輸入，並確認規格互相一致。'][locale];
  byId('checklist').hidden = !lockMode;
  byId('list-label').textContent = ['Measurement record','量度紀錄'][locale];
  byId('copy').textContent = ['Copy checklist','複製清單'][locale];
  fields.forEach(({text}, i) => { text.textContent = selected.fields[i][locale]; });
  cards.forEach(({text}, i) => { text.textContent = selected.labels[i][locale]; });
  render();
}

form.addEventListener('input', render);
form.addEventListener('submit', event => event.preventDefault());
language.addEventListener('click', () => {
  locale = 1 - locale;
  const url = new URL(location.href);
  if (locale) url.searchParams.set('lang','zh');
  else url.searchParams.delete('lang');
  history.replaceState(null,'',url);
  localize();
});
byId('copy').addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(byId('measurements').value);
    byId('copy-status').textContent = ['Copied','已複製'][locale];
  } catch {
    byId('measurements').select();
    byId('copy-status').textContent = ['Copy the selected text.','請複製已選取的文字。'][locale];
  }
});
localize();
