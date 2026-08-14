#!/usr/bin/env python3
"""src/data/registry.ts генерацияси — ССВ идоралараро алмашинув реестридан.

Фойдаланиш:
    python3 scripts/gen-registry.py "<xlsx йўли>"

xlsx формати (1-варақ): 4–64 қаторлар, B–H устунлар:
№ | ССВ тизими | идора тизими | алмашинадиган маълумотлар | ҳуқуқий асос | ҳужжат | ҳолат.

Ҳар бир қаторнинг идораси AGENCY_OF харитасида (№ → идора id);
реестр янгиланганда янги қаторлар учун харитани тўлдиринг.
"""
import json
import re
import sys

import openpyxl

# реестр қаторининг идораси (№ → id) — 30.03.2026 ҳолати
AGENCY_OF = {
    **dict.fromkeys([8, 9, 10, 11, 12, 13, 14, 16, 17, 18, 35, 36, 37, 44, 45, 46, 47], 'social'),
    **dict.fromkeys([1, 2, 3, 4, 25], 'etrm'),
    **dict.fromkeys([5, 6, 7], 'insurance'),
    **dict.fromkeys([21, 22, 23, 24], 'hisob'),
    **dict.fromkeys([26, 27, 38, 50, 54, 55], 'soliq'),
    **dict.fromkeys([29, 30, 31], 'iiv'),
    **dict.fromkeys([34, 48, 49], 'moliya'),
    **dict.fromkeys([19, 20, 32, 33], 'mudofaa'),
    **dict.fromkeys([28, 52], 'adliya'),
    15: 'yoshlar', 39: 'maktab', 40: 'oila', 51: 'tech', 53: 'pharm',
    **dict.fromkeys([41, 42, 43, 56, 57, 58, 59, 60, 61], 'rh'),
}

# id → (тўлиқ ном, харитадаги ёрлиқ, доира ичидаги белги)
# Ёрлиқ — расмий номнинг ўзи (қисқартириб бузилмайди); фақат ЭТРМ —
# расмий аббревиатура (тўлиқ номи ҳалқа ёрлиғи учун жуда узун).
AG = {
    'social': ('Ижтимоий ҳимоя миллий агентлиги', 'Ижтимоий ҳимоя миллий агентлиги', 'ИҲ'),
    'etrm': ('Электрон технологияларни ривожлантириш маркази', 'ЭТРМ', 'ЭТРМ'),
    'insurance': ('Давлат тиббий суғурта жамғармаси', 'Давлат тиббий суғурта жамғармаси', 'ДТСЖ'),
    'hisob': ('Ҳисоб палатаси', 'Ҳисоб палатаси', 'ҲП'),
    'soliq': ('Солиқ қўмитаси', 'Солиқ қўмитаси', 'СҚ'),
    'iiv': ('Ички ишлар вазирлиги', 'Ички ишлар вазирлиги', 'ИИВ'),
    'moliya': ('Иқтисодиёт ва молия вазирлиги', 'Иқтисодиёт ва молия вазирлиги', 'ИМВ'),
    'mudofaa': ('Мудофаа вазирлиги', 'Мудофаа вазирлиги', 'МВ'),
    'adliya': ('Адлия вазирлиги', 'Адлия вазирлиги', 'АВ'),
    'yoshlar': ('Ёшлар ишлари агентлиги', 'Ёшлар ишлари агентлиги', 'ЁИА'),
    'maktab': ('Мактаб ва мактабгача таълим вазирлиги', 'Мактаб ва мактабгача таълим вазирлиги', 'МТВ'),
    'oila': ('Оила ва хотин-қизлар қўмитаси', 'Оила ва хотин-қизлар қўмитаси', 'ОХҚ'),
    'tech': ('Техник тартибга солиш агентлиги', 'Техник тартибга солиш агентлиги', 'ТТС'),
    'pharm': ('Фармацевтика ривожлантириш агентлиги', 'Фармацевтика', 'ФРА'),
    'oits': ('ОИТСга қарши курашиш маркази', 'ОИТС маркази', 'ОИТС'),
    'rh': ('«Рақамли ҳукумат» платформаси', '«Рақамли ҳукумат» платформаси', 'РҲ'),
}

# ССВ тизими: (тўлиқ ном ичидаги калит, қисқа ном, белги, иконка калити)
MOH_SHORT = [
    ('DMED', 'DMED — Ягона тиббиёт АТ', 'DMED', 'dmed'),
    ('MIS2', 'MIS2 — Тиббиёт АТ', 'MIS2', 'mis2'),
    ('narko-psix', 'narko-psix.uz', 'NPX', 'npx'),
    ('ОИТСга қарши', 'HIV-ES — ОИТС маркази', 'HIV', 'hiv'),
    ('Туғилиш ва ўлимни', 'Туғилиш/ўлим қайди АТ', 'Т/Ў', 'birth'),
    ('Рақамли соғлиқ', 'Рақамли соғлиқ платформаси', 'РСП', 'rsp'),
    ('Medrefer', 'Medrefer — суғурта', 'MDR', 'mdr'),
    ('Cancer', 'Cancer-registr', 'CANC', 'canc'),
    ('Донор', 'Донор ҳисоби — Қон хизмати', 'ДОНОР', 'donor'),
    ('ЖиҳозМед', 'ЖиҳозМед АТ', 'ЖМ', 'jm'),
    ('МедДата', 'МедДата — тез ёрдам', '103', 'amb'),
    ('Автохўжалик', 'Автохўжалик АТ', 'АВТО', 'avto'),
]

# №1–43 — ССВ идораларга маълумот ТАҚДИМ ЭТАДИ (узатиш),
# №44–61 — идоралар ССВга маълумот ТАҚДИМ ЭТАДИ (қабул қилиш).
OUTGOING_MAX = 43

# Харитадан бутунлай чиқарилган идоралар (фойдаланувчи талаби)
EXCLUDE_AGENCIES = {'pharm'}
# Чиқарилган реестр қаторлари (фойдаланувчи талаби): №54 — РСП ⇄ Рақамли ҳукумат (Солиқ)
EXCLUDE_ROWS = {54}

# Реестрда «Жараёнда» деб турса-да, амалда ишлаётган қаторлар (фойдаланувчи тасдиқлади):
# №56 — вояга етмаганлар, №60 — ҳомиладор аёллар ва бола парвариши,
# №21 — Ҳисоб палатаси: рўйхатга олинган беморлар ва муассасалар маълумоти
FORCE_LIVE = {21, 56, 60}

# Икки томонлама алмашинувлар: № → идора ССВга тақдим этадиган маълумот
# (реестрда фақат ССВ берадигани ёзилган; фойдаланувчи изоҳи)
BIDIR = {
    15: '30 ёшгача бўлган ёшлар тўғрисидаги маълумотлар',
}

# Вергул бўйича ажратилмайдиган қаторлар: матн — яхлит бир гап
# (№49 — пенсионерларнинг хизмат жойлари санамаси)
NO_COMMA_SPLIT = {49}

YEAR_RE = re.compile(r'(20\d\d)\s*йил')


def clean(s):
    return re.sub(r'\s+', ' ', str(s or '')).strip()


def moh_short(full):
    for key, short, mark, icon in MOH_SHORT:
        if key in full:
            return short, mark, icon
    return full[:24], re.sub(r'[^\w]', '', full)[:4].upper(), None


def doc_label(doc):
    low = doc.lower()
    if 'ариза' in low:
        return 'Ариза берилган'
    if 'чиқилмоқда' in low:
        return 'Ишлаб чиқилмоқда'
    if 'чиқилган' in low or 'тасдиқланган' in low:
        return 'Тасдиқланган'
    return 'Ишлаб чиқилмоқда'


CAPS = set('АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЭЮЯЎҚҒҲABCDEFGHIJKLMNOPQRSTUVWXYZ«"')


def comma_split(x):
    """Бош ҳарф билан бошланадиган банддан олдинги вергул бўйича ажратиш;
    қавс ичидаги вергуллар ҳисобга олинмайди («(ЭКГ, УТТ, ФГДС)»)."""
    parts, depth, start = [], 0, 0
    for i, ch in enumerate(x):
        if ch == '(':
            depth += 1
        elif ch == ')':
            depth = max(0, depth - 1)
        elif ch == ',' and depth == 0:
            j = i + 1
            while j < len(x) and x[j] == ' ':
                j += 1
            if j > i + 1 and j < len(x) and x[j] in CAPS:
                parts.append(x[start:i])
                start = j
    parts.append(x[start:])
    return parts


def split_data(raw, comma=True):
    # аввал «;» ва янги қатор бўйича, сўнг (истисно бўлмаса) вергул бўйича
    items = [clean(x) for x in re.split(r'[;\n]+', str(raw or ''))]
    if comma:
        items = [p for x in items for p in comma_split(x)]
    # ячейкадаги «1.», «1.1.», «2)» каби рақамлаш ва четки қўштирноқларни оламиз
    items = [re.sub(r'^\d+(?:\.\d+)*\s*[.)]\s*', '', x).strip('"“” ') for x in items]
    return [x.rstrip('.').strip() for x in items if x and len(x) > 2]


def trunc(s, n):
    return s if len(s) <= n else s[: n - 1].rstrip() + '…'


def main(path):
    ws = openpyxl.load_workbook(path, data_only=True).worksheets[0]
    agency_children = {k: [] for k in AG}
    total = 0
    acts = set()
    for r in range(4, 65):
        no = ws.cell(r, 2).value
        if no is None:
            continue
        no = int(no)
        if no in EXCLUDE_ROWS or AGENCY_OF[no] in EXCLUDE_AGENCIES:
            continue
        total += 1
        moh = clean(ws.cell(r, 3).value)
        partner = clean(ws.cell(r, 4).value)
        items = split_data(ws.cell(r, 5).value, comma=no not in NO_COMMA_SPLIT) or [clean(ws.cell(r, 5).value)]
        basis = clean(ws.cell(r, 6).value)
        doc = clean(ws.cell(r, 7).value)
        status = clean(ws.cell(r, 8).value)
        ag = AGENCY_OF[no]
        short, mark, sys_icon = moh_short(moh)
        live = status == 'Мавжуд' or no in FORCE_LIVE
        outgoing = no <= OUTGOING_MAX
        if basis:
            acts.add(basis)
        year = (YEAR_RE.search(basis) or [None, None])[1]
        both = no in BIDIR
        moh_step = {'title': short, 'sub': 'ССВ тизими', 'icon': sys_icon}
        ag_step = {'title': AG[ag][1], 'sub': 'ҳамкор идора', 'icon': ag}
        kpis = [
            {'value': 'ССВ ⇄ Идора' if both else 'ССВ → Идора' if outgoing else 'Идора → ССВ',
             'label': 'маълумот йўналиши'},
            {'value': 'Мавжуд' if live else 'Режада', 'label': 'алмашинув ҳолати'},
            {'value': doc_label(doc), 'label': 'ҳужжат ҳолати'},
        ]
        if not live:
            kpis.append({'value': '2026 йил охири', 'label': 'режа муддати'})
        if year:
            kpis.append({'value': year, 'label': 'асос йили'})
        panel = [
            {'kind': 'flow', 'title': 'Маълумот оқими',
             'steps': [moh_step, ag_step] if outgoing or both else [ag_step, moh_step],
             **({'twoWay': True} if both else {})},
            {'kind': 'kpis', 'items': kpis},
            {'kind': 'list',
             'title': 'ССВ тақдим этадиган маълумотлар' if outgoing else 'ССВга тақдим этиладиган маълумотлар',
             'items': items},
        ]
        if both:
            panel.insert(3, {'kind': 'list', 'title': 'Идора ССВга тақдим этадиган маълумотлар',
                             'items': [BIDIR[no]]})
        if basis:
            panel.append({'kind': 'list', 'title': 'Ҳуқуқий асос', 'items': [basis]})
        if both:
            arrow_desc = f'{short} ⇄ {AG[ag][0]}. Икки томонлама алмашинув.'
        else:
            arrow_desc = (f'{short} → {AG[ag][0]}. ССВ маълумот тақдим этади.' if outgoing
                          else f'{AG[ag][0]} → {short}. Идора ССВга маълумот тақдим этади.')
        if not live:
            arrow_desc += ' 2026 йил охирига режалаштирилган.'
        agency_children[ag].append({
            'id': f'int-{no}',
            'name': items[0],
            'label': trunc(items[0], 20),
            'mark': mark,
            'icon': sys_icon,
            'dir': 'both' if both else 'out' if outgoing else 'in',
            'desc': f'{arrow_desc} Реестрдаги {no}-алмашинув. Идора тизими: {trunc(partner, 90)}',
            'status': 'live' if live else 'plan',
            'stat': {'value': f'№ {no}', 'label': 'реестр рақами'},
            'panel': panel,
        })

    nodes = []
    active_total = 0
    outgoing_total = sum(1 for kids in agency_children.values() for k in kids if k['dir'] == 'out')
    for ag, (name, label, mark) in AG.items():
        if ag in EXCLUDE_AGENCIES:
            continue
        kids = agency_children[ag]
        if not kids:
            continue
        active = sum(1 for k in kids if k['status'] == 'live')
        active_total += active
        planned = len(kids) - active
        out_n = sum(1 for k in kids if k['dir'] == 'out')
        in_n = len(kids) - out_n
        flows = ' · '.join(
            ([f'ССВ тақдим этади: {out_n} та'] if out_n else []) + ([f'ССВ қабул қилади: {in_n} та'] if in_n else []),
        )
        nodes.append({
            'id': f'ag-{ag}',
            'name': name,
            'label': label,
            'mark': mark,
            'icon': ag,
            'desc': f'Алмашинув йўналишлари: {len(kids)} та, мавжуд: {active} та'
            + (f', режада: {planned} та (2026 йил охиригача)' if planned else '')
            + f'. {flows}.',
            'stat': {'value': str(len(kids)), 'label': 'алмашинув йўналиши'},
            'children': kids,
        })

    header = (
        '/* ============================================================\n'
        '   АВТОГЕНЕРАЦИЯ — ССВ идоралараро алмашинув реестридан\n'
        f'   «Интеграция қилинадиган АТлар» (30.03.2026): {total} та йўналиш,\n'
        f'   {len(nodes)} та идора.\n'
        '   Қайта генерация: python3 scripts/gen-registry.py "<файл.xlsx>"\n'
        '   ============================================================ */\n'
        "import type { EcoNode } from '../lib/types'\n\n"
        f'export const REGISTRY_TOTALS = {{ total: {total}, active: {active_total}, '
        f'process: {total - active_total}, agencies: {len(nodes)}, acts: {len(acts)}, '
        f'outgoing: {outgoing_total}, incoming: {total - outgoing_total} }}\n\n'
        '/** Ҳамкор идоралар ва уларнинг интеграциялари (дарахт барглари) */\n'
        'export const GOV_AGENCY_NODES: EcoNode[] = '
    )
    out = header + json.dumps(nodes, ensure_ascii=False, indent=2) + '\n'
    with open('src/data/registry.ts', 'w', encoding='utf-8') as f:
        f.write(out)
    print(f'registry.ts: {total} integrations, {len(nodes)} agencies, {len(acts)} acts, active {active_total}')


if __name__ == '__main__':
    main(sys.argv[1])
