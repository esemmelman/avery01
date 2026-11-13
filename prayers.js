const talit = [["בָּרוּךְ", "Baruch"], ["אַתָּה", "Atah"], ["יְיָ", "Adonai"], ["אֱלֹהֵינוּ", "Eloheinu"], ["מֶלֶךְ", "Melech"], ["הָעוֹלָם", "Ha’olam"], ["אֲשֶׁר", "Asher"], ["קִדְּשָׁנוּ", "Kid’shanu"], ["בְּמִצְוֹתָיו", "B’mitzvotav"], ["וְצִוָּנוּ", "V’tzivanu"], ["לְהִתְעַטֵּף", "L’hitateif"], ["בַּצִּיצִית", "Ba-tzitzit"]];
const elohai = `
אֱלֹהַי|Elohai
נְשָׁמָה|Neshama
שֶׁנָּתַתָּ|Shenatata
בִּי|Bi
טְהוֹרָה|Tehora
הִיא|Hi
אַתָּה|Atah
בְרָאתָהּ|Veratah
אַתָּה|Atah
יְצַרְתָּהּ|Yetzartah
אַתָּה|Atah
נְפַחְתָּהּ|Nefachtah
בִּי|Bi
וְאַתָּה|V’atah
מְשַׁמְּרָהּ|Meshamerah
בְּקִרְבִּי|B’kirbi
כָּל|Kol
זְמַן|Zman
שֶׁהַנְּשָׁמָה|Shehaneshama
בְקִרְבִּי|V’kirbi
מוֹדֶה|Modeh
אֲנִי|Ani
לְפָנֶיךָ|Lefanecha
יְיָ|Adonai
אֱלֹהַי|Elohai
וֵאלֹהֵי|V’Elohei
אֲבוֹתַי|Avotai
וְאִמּוֹתַי|V’emotai
רִבּוֹן|Ribon
כָּל|Kol
הַמַּעֲשִׂים|Hama’asim
אֲדוֹן|Adon
כָּל|Kol
הַנְּשָׁמוֹת|Haneshamot
בָּרוּךְ|Baruch
אַתָּה|Atah
יְיָ|Adonai
אֲשֶׁר|Asher
בְּיָדוֹ|B’yado
נֶפֶשׁ|Nefesh
כָּל|Kol
חָי|Chai
וְרוּחַ|V’ruach
כָּל|Kol
בְּשַׂר|B’sar
אִישׁ|Eesh
`.trim().split('\n').map(line => line.split('|'));
const laasok = [...talit.slice(0, 10), ['לַעֲסֹק', 'La’asok'], ['בְּדִבְרֵי', 'B’divrei'], ['תוֹרָה', 'Torah']];
const hamelamed = [
  ['בָּרוּךְ', 'Baruch'],
  ['אַתָּה', 'Atah'],
  ['יְיָ', 'Adonai'],
  ['הַמְלַמֵּד', 'Hamelamed'],
  ['תּוֹרָה', 'Torah'],
  ['לְעַמּוֹ', 'L’amo'],
  ['יִשְׂרָאֵל', 'Yisrael']
];

const yotzer = `
בָּרוּךְ|Baruch
אַתָּה|Atah
יְיָ|Adonai
אֱלֹהֵינוּ|Eloheinu
מֶלֶךְ|Melech
הָעוֹלָם|Ha’olam
יוֹצֵר|Yotzer
אוֹר|Ohr
וּבוֹרֵא|Uvorei
חֹשֶׁךְ|Choshech
עֹשֶׂה|Oseh
שָׁלוֹם|Shalom
וּבוֹרֵא|Uvorei
אֶת־הַכֹּל|Et-hakol
הַמֵּאִיר|Hame’ir
לָאָרֶץ|La’aretz
וְלַדָּרִים|V’ladarim
עָלֶיהָ|Aleha
בְּרַחֲמִים|B’rachamim
וּבְטוּבוֹ|Uv’tuvo
מְחַדֵּשׁ|Mechadesh
בְּכָל|B’chol
יוֹם|Yom
תָּמִיד|Tamid
מַעֲשֵׂה|Ma’aseh
בְרֵאשִׁית|V’reishit
מָה|Mah
רַבּוּ|Rabu
מַעֲשֶׂיךָ|Ma’asecha
יְיָ|Adonai
כֻּלָּם|Kulam
בְּחָכְמָה|B’chochmah
עָשִׂיתָ|Asita
מָלְאָה|Mal’ah
הָאָרֶץ|Ha’aretz
קִנְיָנֶךָ|Kinyanecha
תִּתְבָּרַךְ|Titbarach
יְיָ|Adonai
אֱלֹהֵינוּ|Eloheinu
עַל|Al
שֶׁבַח|Shevach
מַעֲשֵׂה|Ma’aseh
יָדֶיךָ|Yadecha
וְעַל|V’al
מְאוֹרֵי|Me’orei
אוֹר|Ohr
שֶׁעָשִׂיתָ|She’asita
יְפָאֲרוּךָ|Yefa’arucha
סֶּלָה|Selah
אוֹר|Ohr
חָדָשׁ|Chadash
עַל|Al
צִיּוֹן|Tziyon
תָּאִיר|Ta’ir
וְנִזְכֶּה|V’nizkeh
כֻלָּנוּ|Chulanu
מְהֵרָה|M’heirah
לְאוֹרוֹ|L’oro
בָּרוּךְ|Baruch
אַתָּה|Atah
יְיָ|Adonai
יוֹצֵר|Yotzer
הַמְּאוֹרוֹת|Ham’orot
`.trim().split('\n').map(line => line.split('|'));

const prayers = {
  yotzer: { title: 'Yotzer Ohr', intro: 'Read down each column, beginning with the rightmost column and continuing to the left. Text follows your prayer book, page 313.', words: yotzer },
  hamelamed: { title: "Hamelamed Torah L’amo Yisrael", intro: "Blessing for the teaching of Torah. Read from top to bottom.", words: hamelamed, source: "https://kitzur.co.il/לוח-לימוד-יומי/textbook/47.html" },
  talit: { title: 'Blessing for the Talit', intro: 'For putting on a prayer shawl. Read from top to bottom.', words: talit, source: 'https://www.chabad.org/library/article_cdo/aid/3869279/jewish/Tallit-Prayer-Blessings.htm' },
  elohai: { allowRecording: true, textVersion: 2, title: 'Elohai Neshama', intro: 'Read down each column, beginning with the rightmost column and continuing to the left.', words: elohai, source: 'https://templesinaiatlanta.org/wp-content/uploads/2025/07/ShabbatMorningService.pdf' },
  laasok: { title: 'Laasok B’divrei Torah', intro: 'Blessing before Torah study. Read from top to bottom.', words: laasok, source: 'https://bneiakiva.org.il/operation/mt-laasok/' }
};
const picker = document.getElementById('prayer-picker');
function showPrayer(key) {
  const prayer = prayers[key];
  document.getElementById('title').textContent = prayer.title;
  document.title = prayer.title + ' — Prayers & Blessings';
  document.getElementById('intro').textContent = prayer.intro;
  document.getElementById('prayer-content').classList.toggle('long', prayer.words.length > 18);
  document.getElementById('source').href = prayer.source || '';
  document.getElementById('source').hidden = !prayer.source || key === 'hamelamed';
  const rows = prayer.words.map(([hebrew, transliteration], index) => {
    const row = document.createElement('li');
    row.dataset.word = index;
    row.tabIndex = 0;
    const he = document.createElement('span');
    he.className = 'hebrew'; he.lang = 'he'; he.dir = 'rtl'; he.textContent = hebrew;
    const dash = document.createElement('span');
    dash.className = 'dash'; dash.textContent = '–';
    const en = document.createElement('span');
    en.className = 'transliteration'; en.textContent = transliteration;
    row.append(he, dash, en);
    return row;
  });
  const columns = [];
  const columnCount = rows.length > 18 ? 3 : 1;
  document.getElementById('words').style.setProperty('--columns', columnCount);
  const wordsPerColumn = Math.ceil(rows.length / columnCount);
  for (let start = 0; start < rows.length; start += wordsPerColumn) {
    const column = document.createElement('ol');
    column.className = 'word-column';
    column.setAttribute('aria-label', 'Prayer column ' + (columns.length + 1));
    column.append(...rows.slice(start, start + wordsPerColumn));
    columns.push(column);
  }
  document.getElementById('words').replaceChildren(...columns);
}
picker.addEventListener('change', () => showPrayer(picker.value));
showPrayer(picker.value);
