const days = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
];

const statNames = {
    'str': 'Strength',
    'dex': 'Dexterity',
    'int': 'Intelligence',
    'will': 'Will',
    'luck': 'Luck',
    'attmin': 'Min Damage',
    'attmax': 'Max Damage',
    'crit': 'Critical',
    'rate': 'Balance',
};

const conditions = {
    0: 'Poison',
    1: 'Deadly',
    2: 'Potion Poison',
    183: 'Respite Aftereffect',
};

const ranks = {
    1: 'F',
    2: 'E',
    3: 'D',
    4: 'C',
    5: 'B',
    6: 'A',
    7: '9',
    8: '8',
    9: '7',
    10: '6',
    11: '5',
    12: '4',
    13: '3',
    14: '2',
    15: '1',
    16: 'Dan 1',
    17: 'Dan 2',
    18: 'Dan 3',
};

module.exports = {
    days,
    statNames,
    conditions,
    ranks,
}
