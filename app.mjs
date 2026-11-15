import { tools } from './settings.mjs';

const byId = id => document.getElementById(id);
const query = new URLSearchParams(location.search);
const key = 'hdmi';
const selected = tools[key];
const form = document.querySelector('form');
const results = document.querySelector('.results');
const language = byId('language');
const lockMode = key === 'lock';
let locale = query.has('lang') ? Number(query.get('lang') === 'zh') : Number(document.documentElement.lang === 'zh-Hant');

const fields = selected.fields.map(([, , initial, min, step, max]) => {
  const label = document.createElement('label');
  const text = document.createElement('span');
  const input = document.createElement('input');
  input.required = min !== undefined;
  input.value = initial ?? '';
  if (min !== undefined) {
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
  let invalid = !fields.every(({input}) => input.validity.valid);
  if (!invalid) {
    try {
      values = selected.calculate(...fields.map(({input}) => input.value.trim() ? (input.type === 'number' ? input.valueAsNumber : input.value.trim()) : null));
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
    output.textContent = invalid ? '—' : value == null ? ['Unconfirmed','待確認'][locale] : Array.isArray(value) ? value[locale] : typeof value === 'string' ? value : typeof value === 'boolean'
      ? (value ? ['Yes','是'] : ['No','否'])[locale]
      : format.format(Math.abs(value) < 1e-9 ? 0 : value) + (unit ? ' ' + unit : '');
  });
  byId('measurements').value = invalid ? '' : [selected.title[locale], ...values.map((value, i) => selected.fields[i][locale] + ' — ' + (value ?? ['Not measured','未量'][locale])), ['Photos: outside, inside, door edge and frame by the lock.','相片：門外、門內、門邊及鎖位門框。'][locale]].join('\n');
}

function localize() {
  document.documentElement.lang = locale ? 'zh-Hant' : 'en';
  document.title = selected.title[locale] + ' | Elechid 音立';
  language.textContent = locale ? 'English' : '繁體中文';
  language.lang = locale ? 'en' : 'zh-Hant';
  byId('title').textContent = selected.title[locale];
  byId('intro').textContent = selected.intro[locale];
  byId('note').textContent = selected.note[locale];
  byId('source').textContent = ['Source code','原始碼'][locale];
  byId('brand').href = 'https://elechid.com' + (locale ? '/' : '/en/');
  byId('guide').href = 'https://elechid.com' + (locale ? '' : '/en') + '/blogs/news/' + selected.guide;
  byId('guide').textContent = ['Read the Elechid guide','閱讀 Elechid 選購及安裝指南'][locale];
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
  if (url.pathname.endsWith('/zh.html')) {
    if (locale) url.searchParams.delete('lang');
    else url.searchParams.set('lang','en');
  } else if (locale) url.searchParams.set('lang','zh');
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
