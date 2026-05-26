export interface Country {
    name: {
        common: string;
        official?: string;
        nativeName?: Record<string, { official: string; common: string }>;
    };
    cca2: string;
    cca3: string;
}

export const countries: Country[] = [
    {
        "name": {
            "common": "Syria",
            "official": "Syrian Arab Republic",
            "nativeName": {
                "ara": {
                    "official": "الجمهورية العربية السورية",
                    "common": "سوريا",
                },
            },
        },
        "cca2": "SY",
        "cca3": "SYR",
    },
    {
        "name": {
            "common": "New Zealand",
            "official": "New Zealand",
            "nativeName": {
                "eng": {
                    "official": "New Zealand",
                    "common": "New Zealand",
                },
                "mri": {
                    "official": "Aotearoa",
                    "common": "Aotearoa",
                },
                "nzs": {
                    "official": "New Zealand",
                    "common": "New Zealand",
                },
            },
        },
        "cca2": "NZ",
        "cca3": "NZL",
    },
    {
        "name": {
            "common": "Brunei",
            "official": "Nation of Brunei, Abode of Peace",
            "nativeName": {
                "msa": {
                    "official": "Nation of Brunei, Abode Damai",
                    "common": "Negara Brunei Darussalam",
                },
            },
        },
        "cca2": "BN",
        "cca3": "BRN",
    },
    {
        "name": {
            "common": "British Indian Ocean Territory",
            "official": "British Indian Ocean Territory",
            "nativeName": {
                "eng": {
                    "official": "British Indian Ocean Territory",
                    "common": "British Indian Ocean Territory",
                },
            },
        },
        "cca2": "IO",
        "cca3": "IOT",
    },
    {
        "name": {
            "common": "Kenya",
            "official": "Republic of Kenya",
            "nativeName": {
                "eng": {
                    "official": "Republic of Kenya",
                    "common": "Kenya",
                },
                "swa": {
                    "official": "Republic of Kenya",
                    "common": "Kenya",
                },
            },
        },
        "cca2": "KE",
        "cca3": "KEN",
    },
    {
        "name": {
            "common": "Palau",
            "official": "Republic of Palau",
            "nativeName": {
                "eng": {
                    "official": "Republic of Palau",
                    "common": "Palau",
                },
                "pau": {
                    "official": "Beluu er a Belau",
                    "common": "Belau",
                },
            },
        },
        "cca2": "PW",
        "cca3": "PLW",
    },
    {
        "name": {
            "common": "Oman",
            "official": "Sultanate of Oman",
            "nativeName": {
                "ara": {
                    "official": "سلطنة عمان",
                    "common": "عمان",
                },
            },
        },
        "cca2": "OM",
        "cca3": "OMN",
    },
    {
        "name": {
            "common": "Mexico",
            "official": "United Mexican States",
            "nativeName": {
                "spa": {
                    "official": "Estados Unidos Mexicanos",
                    "common": "México",
                },
            },
        },
        "cca2": "MX",
        "cca3": "MEX",
    },
    {
        "name": {
            "common": "Palestine",
            "official": "State of Palestine",
            "nativeName": {
                "ara": {
                    "official": "دولة فلسطين",
                    "common": "فلسطين",
                },
            },
        },
        "cca2": "PS",
        "cca3": "PSE",
    },
    {
        "name": {
            "common": "Turks and Caicos Islands",
            "official": "Turks and Caicos Islands",
            "nativeName": {
                "eng": {
                    "official": "Turks and Caicos Islands",
                    "common": "Turks and Caicos Islands",
                },
            },
        },
        "cca2": "TC",
        "cca3": "TCA",
    },
    {
        "name": {
            "common": "Central African Republic",
            "official": "Central African Republic",
            "nativeName": {
                "fra": {
                    "official": "République centrafricaine",
                    "common": "République centrafricaine",
                },
                "sag": {
                    "official": "Ködörösêse tî Bêafrîka",
                    "common": "Bêafrîka",
                },
            },
        },
        "cca2": "CF",
        "cca3": "CAF",
    },
    {
        "name": {
            "common": "Saint Kitts and Nevis",
            "official": "Federation of Saint Christopher and Nevis",
            "nativeName": {
                "eng": {
                    "official": "Federation of Saint Christopher and Nevis",
                    "common": "Saint Kitts and Nevis",
                },
            },
        },
        "cca2": "KN",
        "cca3": "KNA",
    },
    {
        "name": {
            "common": "South Sudan",
            "official": "Republic of South Sudan",
            "nativeName": {
                "eng": {
                    "official": "Republic of South Sudan",
                    "common": "South Sudan",
                },
            },
        },
        "cca2": "SS",
        "cca3": "SSD",
    },
    {
        "name": {
            "common": "Ukraine",
            "official": "Ukraine",
            "nativeName": {
                "ukr": {
                    "official": "Україна",
                    "common": "Україна",
                },
            },
        },
        "cca2": "UA",
        "cca3": "UKR",
    },
    {
        "name": {
            "common": "Saint Barthélemy",
            "official": "Collectivity of Saint Barthélemy",
            "nativeName": {
                "fra": {
                    "official": "Collectivité de Saint-Barthélemy",
                    "common": "Saint-Barthélemy",
                },
            },
        },
        "cca2": "BL",
        "cca3": "BLM",
    },
    {
        "name": {
            "common": "Netherlands",
            "official": "Kingdom of the Netherlands",
            "nativeName": {
                "nld": {
                    "official": "Koninkrijk der Nederlanden",
                    "common": "Nederland",
                },
            },
        },
        "cca2": "NL",
        "cca3": "NLD",
    },
    {
        "name": {
            "common": "Tanzania",
            "official": "United Republic of Tanzania",
            "nativeName": {
                "eng": {
                    "official": "United Republic of Tanzania",
                    "common": "Tanzania",
                },
                "swa": {
                    "official": "Jamhuri ya Muungano wa Tanzania",
                    "common": "Tanzania",
                },
            },
        },
        "cca2": "TZ",
        "cca3": "TZA",
    },
    {
        "name": {
            "common": "Czechia",
            "official": "Czech Republic",
            "nativeName": {
                "ces": {
                    "official": "Česká republika",
                    "common": "Česko",
                },
                "slk": {
                    "official": "Česká republika",
                    "common": "Česko",
                },
            },
        },
        "cca2": "CZ",
        "cca3": "CZE",
    },
    {
        "name": {
            "common": "Belarus",
            "official": "Republic of Belarus",
            "nativeName": {
                "bel": {
                    "official": "Рэспубліка Беларусь",
                    "common": "Белару́сь",
                },
                "rus": {
                    "official": "Республика Беларусь",
                    "common": "Беларусь",
                },
            },
        },
        "cca2": "BY",
        "cca3": "BLR",
    },
    {
        "name": {
            "common": "Yemen",
            "official": "Republic of Yemen",
            "nativeName": {
                "ara": {
                    "official": "الجمهورية اليمنية",
                    "common": "اليَمَن",
                },
            },
        },
        "cca2": "YE",
        "cca3": "YEM",
    },
    {
        "name": {
            "common": "Slovenia",
            "official": "Republic of Slovenia",
            "nativeName": {
                "slv": {
                    "official": "Republika Slovenija",
                    "common": "Slovenija",
                },
            },
        },
        "cca2": "SI",
        "cca3": "SVN",
    },
    {
        "name": {
            "common": "Tokelau",
            "official": "Tokelau",
            "nativeName": {
                "eng": {
                    "official": "Tokelau",
                    "common": "Tokelau",
                },
                "smo": {
                    "official": "Tokelau",
                    "common": "Tokelau",
                },
                "tkl": {
                    "official": "Tokelau",
                    "common": "Tokelau",
                },
            },
        },
        "cca2": "TK",
        "cca3": "TKL",
    },
    {
        "name": {
            "common": "Nigeria",
            "official": "Federal Republic of Nigeria",
            "nativeName": {
                "eng": {
                    "official": "Federal Republic of Nigeria",
                    "common": "Nigeria",
                },
            },
        },
        "cca2": "NG",
        "cca3": "NGA",
    },
    {
        "name": {
            "common": "Réunion",
            "official": "Réunion Island",
            "nativeName": {
                "fra": {
                    "official": "Ile de la Réunion",
                    "common": "La Réunion",
                },
            },
        },
        "cca2": "RE",
        "cca3": "REU",
    },
    {
        "name": {
            "common": "Guadeloupe",
            "official": "Guadeloupe",
            "nativeName": {
                "fra": {
                    "official": "Guadeloupe",
                    "common": "Guadeloupe",
                },
            },
        },
        "cca2": "GP",
        "cca3": "GLP",
    },
    {
        "name": {
            "common": "Hungary",
            "official": "Hungary",
            "nativeName": {
                "hun": {
                    "official": "Magyarország",
                    "common": "Magyarország",
                },
            },
        },
        "cca2": "HU",
        "cca3": "HUN",
    },
    {
        "name": {
            "common": "Heard Island and McDonald Islands",
            "official": "Heard Island and McDonald Islands",
            "nativeName": {
                "eng": {
                    "official": "Heard Island and McDonald Islands",
                    "common": "Heard Island and McDonald Islands",
                },
            },
        },
        "cca2": "HM",
        "cca3": "HMD",
    },
    {
        "name": {
            "common": "Eswatini",
            "official": "Kingdom of Eswatini",
            "nativeName": {
                "eng": {
                    "official": "Kingdom of Eswatini",
                    "common": "Eswatini",
                },
                "ssw": {
                    "official": "Umbuso weSwatini",
                    "common": "eSwatini",
                },
            },
        },
        "cca2": "SZ",
        "cca3": "SWZ",
    },
    {
        "name": {
            "common": "Comoros",
            "official": "Union of the Comoros",
            "nativeName": {
                "ara": {
                    "official": "الاتحاد القمري",
                    "common": "القمر‎",
                },
                "fra": {
                    "official": "Union des Comores",
                    "common": "Comores",
                },
                "zdj": {
                    "official": "Udzima wa Komori",
                    "common": "Komori",
                },
            },
        },
        "cca2": "KM",
        "cca3": "COM",
    },
    {
        "name": {
            "common": "India",
            "official": "Republic of India",
            "nativeName": {
                "eng": {
                    "official": "Republic of India",
                    "common": "India",
                },
                "hin": {
                    "official": "भारत गणराज्य",
                    "common": "भारत",
                },
                "tam": {
                    "official": "இந்தியக் குடியரசு",
                    "common": "இந்தியா",
                },
            },
        },
        "cca2": "IN",
        "cca3": "IND",
    },
    {
        "name": {
            "common": "Cocos (Keeling) Islands",
            "official": "Territory of the Cocos (Keeling) Islands",
            "nativeName": {
                "eng": {
                    "official": "Territory of the Cocos (Keeling) Islands",
                    "common": "Cocos (Keeling) Islands",
                },
            },
        },
        "cca2": "CC",
        "cca3": "CCK",
    },
    {
        "name": {
            "common": "United Kingdom",
            "official": "United Kingdom of Great Britain and Northern Ireland",
            "nativeName": {
                "eng": {
                    "official": "United Kingdom of Great Britain and Northern Ireland",
                    "common": "United Kingdom",
                },
            },
        },
        "cca2": "GB",
        "cca3": "GBR",
    },
    {
        "name": {
            "common": "Angola",
            "official": "Republic of Angola",
            "nativeName": {
                "por": {
                    "official": "República de Angola",
                    "common": "Angola",
                },
            },
        },
        "cca2": "AO",
        "cca3": "AGO",
    },
    {
        "name": {
            "common": "Macau",
            "official": "Macao Special Administrative Region of the People's Republic of China",
            "nativeName": {
                "por": {
                    "official": "Região Administrativa Especial de Macau da República Popular da China",
                    "common": "Macau",
                },
                "zho": {
                    "official": "中华人民共和国澳门特别行政区",
                    "common": "澳门",
                },
            },
        },
        "cca2": "MO",
        "cca3": "MAC",
    },
    {
        "name": {
            "common": "Costa Rica",
            "official": "Republic of Costa Rica",
            "nativeName": {
                "spa": {
                    "official": "República de Costa Rica",
                    "common": "Costa Rica",
                },
            },
        },
        "cca2": "CR",
        "cca3": "CRI",
    },
    {
        "name": {
            "common": "Niue",
            "official": "Niue",
            "nativeName": {
                "eng": {
                    "official": "Niue",
                    "common": "Niue",
                },
                "niu": {
                    "official": "Niuē",
                    "common": "Niuē",
                },
            },
        },
        "cca2": "NU",
        "cca3": "NIU",
    },
    {
        "name": {
            "common": "Cook Islands",
            "official": "Cook Islands",
            "nativeName": {
                "eng": {
                    "official": "Cook Islands",
                    "common": "Cook Islands",
                },
                "rar": {
                    "official": "Kūki 'Āirani",
                    "common": "Kūki 'Āirani",
                },
            },
        },
        "cca2": "CK",
        "cca3": "COK",
    },
    {
        "name": {
            "common": "Djibouti",
            "official": "Republic of Djibouti",
            "nativeName": {
                "ara": {
                    "official": "جمهورية جيبوتي",
                    "common": "جيبوتي‎",
                },
                "fra": {
                    "official": "République de Djibouti",
                    "common": "Djibouti",
                },
            },
        },
        "cca2": "DJ",
        "cca3": "DJI",
    },
    {
        "name": {
            "common": "Saint Pierre and Miquelon",
            "official": "Saint Pierre and Miquelon",
            "nativeName": {
                "fra": {
                    "official": "Collectivité territoriale de Saint-Pierre-et-Miquelon",
                    "common": "Saint-Pierre-et-Miquelon",
                },
            },
        },
        "cca2": "PM",
        "cca3": "SPM",
    },
    {
        "name": {
            "common": "Austria",
            "official": "Republic of Austria",
            "nativeName": {
                "bar": {
                    "official": "Republik Österreich",
                    "common": "Österreich",
                },
            },
        },
        "cca2": "AT",
        "cca3": "AUT",
    },
    {
        "name": {
            "common": "Indonesia",
            "official": "Republic of Indonesia",
            "nativeName": {
                "ind": {
                    "official": "Republik Indonesia",
                    "common": "Indonesia",
                },
            },
        },
        "cca2": "ID",
        "cca3": "IDN",
    },
    {
        "name": {
            "common": "Nauru",
            "official": "Republic of Nauru",
            "nativeName": {
                "eng": {
                    "official": "Republic of Nauru",
                    "common": "Nauru",
                },
                "nau": {
                    "official": "Republic of Nauru",
                    "common": "Nauru",
                },
            },
        },
        "cca2": "NR",
        "cca3": "NRU",
    },
    {
        "name": {
            "common": "Kazakhstan",
            "official": "Republic of Kazakhstan",
            "nativeName": {
                "kaz": {
                    "official": "Қазақстан Республикасы",
                    "common": "Қазақстан",
                },
                "rus": {
                    "official": "Республика Казахстан",
                    "common": "Казахстан",
                },
            },
        },
        "cca2": "KZ",
        "cca3": "KAZ",
    },
    {
        "name": {
            "common": "Malawi",
            "official": "Republic of Malawi",
            "nativeName": {
                "eng": {
                    "official": "Republic of Malawi",
                    "common": "Malawi",
                },
                "nya": {
                    "official": "Chalo cha Malawi, Dziko la Malaŵi",
                    "common": "Malaŵi",
                },
            },
        },
        "cca2": "MW",
        "cca3": "MWI",
    },
    {
        "name": {
            "common": "Eritrea",
            "official": "State of Eritrea",
            "nativeName": {
                "ara": {
                    "official": "دولة إرتريا",
                    "common": "إرتريا‎",
                },
                "eng": {
                    "official": "State of Eritrea",
                    "common": "Eritrea",
                },
                "tir": {
                    "official": "ሃገረ ኤርትራ",
                    "common": "ኤርትራ",
                },
            },
        },
        "cca2": "ER",
        "cca3": "ERI",
    },
    {
        "name": {
            "common": "Tunisia",
            "official": "Tunisian Republic",
            "nativeName": {
                "ara": {
                    "official": "الجمهورية التونسية",
                    "common": "تونس",
                },
            },
        },
        "cca2": "TN",
        "cca3": "TUN",
    },
    {
        "name": {
            "common": "Pitcairn Islands",
            "official": "Pitcairn Group of Islands",
            "nativeName": {
                "eng": {
                    "official": "Pitcairn Group of Islands",
                    "common": "Pitcairn Islands",
                },
            },
        },
        "cca2": "PN",
        "cca3": "PCN",
    },
    {
        "name": {
            "common": "Saudi Arabia",
            "official": "Kingdom of Saudi Arabia",
            "nativeName": {
                "ara": {
                    "official": "المملكة العربية السعودية",
                    "common": "العربية السعودية",
                },
            },
        },
        "cca2": "SA",
        "cca3": "SAU",
    },
    {
        "name": {
            "common": "Turkmenistan",
            "official": "Turkmenistan",
            "nativeName": {
                "rus": {
                    "official": "Туркменистан",
                    "common": "Туркмения",
                },
                "tuk": {
                    "official": "Türkmenistan",
                    "common": "Türkmenistan",
                },
            },
        },
        "cca2": "TM",
        "cca3": "TKM",
    },
    {
        "name": {
            "common": "Western Sahara",
            "official": "Sahrawi Arab Democratic Republic",
            "nativeName": {
                "ber": {
                    "official": "Sahrawi Arab Democratic Republic",
                    "common": "Western Sahara",
                },
                "mey": {
                    "official": "الجمهورية العربية الصحراوية الديمقراطية",
                    "common": "الصحراء الغربية",
                },
                "spa": {
                    "official": "República Árabe Saharaui Democrática",
                    "common": "Sahara Occidental",
                },
            },
        },
        "cca2": "EH",
        "cca3": "ESH",
    },
    {
        "name": {
            "common": "Ghana",
            "official": "Republic of Ghana",
            "nativeName": {
                "eng": {
                    "official": "Republic of Ghana",
                    "common": "Ghana",
                },
            },
        },
        "cca2": "GH",
        "cca3": "GHA",
    },
    {
        "name": {
            "common": "Tuvalu",
            "official": "Tuvalu",
            "nativeName": {
                "eng": {
                    "official": "Tuvalu",
                    "common": "Tuvalu",
                },
                "tvl": {
                    "official": "Tuvalu",
                    "common": "Tuvalu",
                },
            },
        },
        "cca2": "TV",
        "cca3": "TUV",
    },
    {
        "name": {
            "common": "Myanmar",
            "official": "Republic of the Union of Myanmar",
            "nativeName": {
                "mya": {
                    "official": "ပြည်ထောင်စု သမ္မတ မြန်မာနိုင်ငံတော်",
                    "common": "မြန်မာ",
                },
            },
        },
        "cca2": "MM",
        "cca3": "MMR",
    },
    {
        "name": {
            "common": "Gabon",
            "official": "Gabonese Republic",
            "nativeName": {
                "fra": {
                    "official": "République gabonaise",
                    "common": "Gabon",
                },
            },
        },
        "cca2": "GA",
        "cca3": "GAB",
    },
    {
        "name": {
            "common": "Cuba",
            "official": "Republic of Cuba",
            "nativeName": {
                "spa": {
                    "official": "República de Cuba",
                    "common": "Cuba",
                },
            },
        },
        "cca2": "CU",
        "cca3": "CUB",
    },
    {
        "name": {
            "common": "China",
            "official": "People's Republic of China",
            "nativeName": {
                "zho": {
                    "official": "中华人民共和国",
                    "common": "中国",
                },
            },
        },
        "cca2": "CN",
        "cca3": "CHN",
    },
    {
        "name": {
            "common": "Panama",
            "official": "Republic of Panama",
            "nativeName": {
                "spa": {
                    "official": "República de Panamá",
                    "common": "Panamá",
                },
            },
        },
        "cca2": "PA",
        "cca3": "PAN",
    },
    {
        "name": {
            "common": "Thailand",
            "official": "Kingdom of Thailand",
            "nativeName": {
                "tha": {
                    "official": "ราชอาณาจักรไทย",
                    "common": "ประเทศไทย",
                },
            },
        },
        "cca2": "TH",
        "cca3": "THA",
    },
    {
        "name": {
            "common": "Russia",
            "official": "Russian Federation",
            "nativeName": {
                "rus": {
                    "official": "Российская Федерация",
                    "common": "Россия",
                },
            },
        },
        "cca2": "RU",
        "cca3": "RUS",
    },
    {
        "name": {
            "common": "Bosnia and Herzegovina",
            "official": "Bosnia and Herzegovina",
            "nativeName": {
                "bos": {
                    "official": "Bosna i Hercegovina",
                    "common": "Bosna i Hercegovina",
                },
                "hrv": {
                    "official": "Bosna i Hercegovina",
                    "common": "Bosna i Hercegovina",
                },
                "srp": {
                    "official": "Босна и Херцеговина",
                    "common": "Босна и Херцеговина",
                },
            },
        },
        "cca2": "BA",
        "cca3": "BIH",
    },
    {
        "name": {
            "common": "Qatar",
            "official": "State of Qatar",
            "nativeName": {
                "ara": {
                    "official": "دولة قطر",
                    "common": "قطر",
                },
            },
        },
        "cca2": "QA",
        "cca3": "QAT",
    },
    {
        "name": {
            "common": "Bouvet Island",
            "official": "Bouvet Island",
            "nativeName": {
                "nor": {
                    "official": "Bouvetøya",
                    "common": "Bouvetøya",
                },
            },
        },
        "cca2": "BV",
        "cca3": "BVT",
    },
    {
        "name": {
            "common": "Iraq",
            "official": "Republic of Iraq",
            "nativeName": {
                "ara": {
                    "official": "جمهورية العراق",
                    "common": "العراق",
                },
                "arc": {
                    "official": "ܩܘܼܛܢܵܐ ܐܝܼܪܲܩ",
                    "common": "ܩܘܼܛܢܵܐ",
                },
                "ckb": {
                    "official": "کۆماری عێراق",
                    "common": "کۆماری",
                },
            },
        },
        "cca2": "IQ",
        "cca3": "IRQ",
    },
    {
        "name": {
            "common": "Tajikistan",
            "official": "Republic of Tajikistan",
            "nativeName": {
                "rus": {
                    "official": "Республика Таджикистан",
                    "common": "Таджикистан",
                },
                "tgk": {
                    "official": "Ҷумҳурии Тоҷикистон",
                    "common": "Тоҷикистон",
                },
            },
        },
        "cca2": "TJ",
        "cca3": "TJK",
    },
    {
        "name": {
            "common": "Guyana",
            "official": "Co-operative Republic of Guyana",
            "nativeName": {
                "eng": {
                    "official": "Co-operative Republic of Guyana",
                    "common": "Guyana",
                },
            },
        },
        "cca2": "GY",
        "cca3": "GUY",
    },
    {
        "name": {
            "common": "Solomon Islands",
            "official": "Solomon Islands",
            "nativeName": {
                "eng": {
                    "official": "Solomon Islands",
                    "common": "Solomon Islands",
                },
            },
        },
        "cca2": "SB",
        "cca3": "SLB",
    },
    {
        "name": {
            "common": "Slovakia",
            "official": "Slovak Republic",
            "nativeName": {
                "slk": {
                    "official": "Slovenská republika",
                    "common": "Slovensko",
                },
            },
        },
        "cca2": "SK",
        "cca3": "SVK",
    },
    {
        "name": {
            "common": "Gibraltar",
            "official": "Gibraltar",
            "nativeName": {
                "eng": {
                    "official": "Gibraltar",
                    "common": "Gibraltar",
                },
            },
        },
        "cca2": "GI",
        "cca3": "GIB",
    },
    {
        "name": {
            "common": "Peru",
            "official": "Republic of Peru",
            "nativeName": {
                "aym": {
                    "official": "Piruw Suyu",
                    "common": "Piruw",
                },
                "que": {
                    "official": "Piruw Ripuwlika",
                    "common": "Piruw",
                },
                "spa": {
                    "official": "República del Perú",
                    "common": "Perú",
                },
            },
        },
        "cca2": "PE",
        "cca3": "PER",
    },
    {
        "name": {
            "common": "Puerto Rico",
            "official": "Commonwealth of Puerto Rico",
            "nativeName": {
                "eng": {
                    "official": "Commonwealth of Puerto Rico",
                    "common": "Puerto Rico",
                },
                "spa": {
                    "official": "Estado Libre Asociado de Puerto Rico",
                    "common": "Puerto Rico",
                },
            },
        },
        "cca2": "PR",
        "cca3": "PRI",
    },
    {
        "name": {
            "common": "Armenia",
            "official": "Republic of Armenia",
            "nativeName": {
                "hye": {
                    "official": "Հայաստանի Հանրապետություն",
                    "common": "Հայաստան",
                },
            },
        },
        "cca2": "AM",
        "cca3": "ARM",
    },
    {
        "name": {
            "common": "Azerbaijan",
            "official": "Republic of Azerbaijan",
            "nativeName": {
                "aze": {
                    "official": "Azərbaycan Respublikası",
                    "common": "Azərbaycan",
                },
            },
        },
        "cca2": "AZ",
        "cca3": "AZE",
    },
    {
        "name": {
            "common": "Mauritania",
            "official": "Islamic Republic of Mauritania",
            "nativeName": {
                "ara": {
                    "official": "الجمهورية الإسلامية الموريتانية",
                    "common": "موريتانيا",
                },
            },
        },
        "cca2": "MR",
        "cca3": "MRT",
    },
    {
        "name": {
            "common": "Belize",
            "official": "Belize",
            "nativeName": {
                "bjz": {
                    "official": "Belize",
                    "common": "Belize",
                },
                "eng": {
                    "official": "Belize",
                    "common": "Belize",
                },
                "spa": {
                    "official": "Belice",
                    "common": "Belice",
                },
            },
        },
        "cca2": "BZ",
        "cca3": "BLZ",
    },
    {
        "name": {
            "common": "Anguilla",
            "official": "Anguilla",
            "nativeName": {
                "eng": {
                    "official": "Anguilla",
                    "common": "Anguilla",
                },
            },
        },
        "cca2": "AI",
        "cca3": "AIA",
    },
    {
        "name": {
            "common": "Seychelles",
            "official": "Republic of Seychelles",
            "nativeName": {
                "crs": {
                    "official": "Repiblik Sesel",
                    "common": "Sesel",
                },
                "eng": {
                    "official": "Republic of Seychelles",
                    "common": "Seychelles",
                },
                "fra": {
                    "official": "République des Seychelles",
                    "common": "Seychelles",
                },
            },
        },
        "cca2": "SC",
        "cca3": "SYC",
    },
    {
        "name": {
            "common": "Norfolk Island",
            "official": "Territory of Norfolk Island",
            "nativeName": {
                "eng": {
                    "official": "Territory of Norfolk Island",
                    "common": "Norfolk Island",
                },
                "pih": {
                    "official": "Teratri of Norf'k Ailen",
                    "common": "Norf'k Ailen",
                },
            },
        },
        "cca2": "NF",
        "cca3": "NFK",
    },
    {
        "name": {
            "common": "Philippines",
            "official": "Republic of the Philippines",
            "nativeName": {
                "eng": {
                    "official": "Republic of the Philippines",
                    "common": "Philippines",
                },
                "fil": {
                    "official": "Republic of the Philippines",
                    "common": "Pilipinas",
                },
            },
        },
        "cca2": "PH",
        "cca3": "PHL",
    },
    {
        "name": {
            "common": "Argentina",
            "official": "Argentine Republic",
            "nativeName": {
                "grn": {
                    "official": "Argentine Republic",
                    "common": "Argentina",
                },
                "spa": {
                    "official": "República Argentina",
                    "common": "Argentina",
                },
            },
        },
        "cca2": "AR",
        "cca3": "ARG",
    },
    {
        "name": {
            "common": "Moldova",
            "official": "Republic of Moldova",
            "nativeName": {
                "ron": {
                    "official": "Republica Moldova",
                    "common": "Moldova",
                },
            },
        },
        "cca2": "MD",
        "cca3": "MDA",
    },
    {
        "name": {
            "common": "Samoa",
            "official": "Independent State of Samoa",
            "nativeName": {
                "eng": {
                    "official": "Independent State of Samoa",
                    "common": "Samoa",
                },
                "smo": {
                    "official": "Malo Saʻoloto Tutoʻatasi o Sāmoa",
                    "common": "Sāmoa",
                },
            },
        },
        "cca2": "WS",
        "cca3": "WSM",
    },
    {
        "name": {
            "common": "Antarctica",
            "official": "Antarctica",
            "nativeName": {},
        },
        "cca2": "AQ",
        "cca3": "ATA",
    },
    {
        "name": {
            "common": "Sierra Leone",
            "official": "Republic of Sierra Leone",
            "nativeName": {
                "eng": {
                    "official": "Republic of Sierra Leone",
                    "common": "Sierra Leone",
                },
            },
        },
        "cca2": "SL",
        "cca3": "SLE",
    },
    {
        "name": {
            "common": "Cambodia",
            "official": "Kingdom of Cambodia",
            "nativeName": {
                "khm": {
                    "official": "ព្រះរាជាណាចក្រកម្ពុជា",
                    "common": "Kâmpŭchéa",
                },
            },
        },
        "cca2": "KH",
        "cca3": "KHM",
    },
    {
        "name": {
            "common": "Vanuatu",
            "official": "Republic of Vanuatu",
            "nativeName": {
                "bis": {
                    "official": "Ripablik blong Vanuatu",
                    "common": "Vanuatu",
                },
                "eng": {
                    "official": "Republic of Vanuatu",
                    "common": "Vanuatu",
                },
                "fra": {
                    "official": "République de Vanuatu",
                    "common": "Vanuatu",
                },
            },
        },
        "cca2": "VU",
        "cca3": "VUT",
    },
    {
        "name": {
            "common": "Jordan",
            "official": "Hashemite Kingdom of Jordan",
            "nativeName": {
                "ara": {
                    "official": "المملكة الأردنية الهاشمية",
                    "common": "الأردن",
                },
            },
        },
        "cca2": "JO",
        "cca3": "JOR",
    },
    {
        "name": {
            "common": "Martinique",
            "official": "Martinique",
            "nativeName": {
                "fra": {
                    "official": "Martinique",
                    "common": "Martinique",
                },
            },
        },
        "cca2": "MQ",
        "cca3": "MTQ",
    },
    {
        "name": {
            "common": "Tonga",
            "official": "Kingdom of Tonga",
            "nativeName": {
                "eng": {
                    "official": "Kingdom of Tonga",
                    "common": "Tonga",
                },
                "ton": {
                    "official": "Kingdom of Tonga",
                    "common": "Tonga",
                },
            },
        },
        "cca2": "TO",
        "cca3": "TON",
    },
    {
        "name": {
            "common": "British Virgin Islands",
            "official": "Virgin Islands",
            "nativeName": {
                "eng": {
                    "official": "Virgin Islands",
                    "common": "British Virgin Islands",
                },
            },
        },
        "cca2": "VG",
        "cca3": "VGB",
    },
    {
        "name": {
            "common": "Timor-Leste",
            "official": "Democratic Republic of Timor-Leste",
            "nativeName": {
                "por": {
                    "official": "República Democrática de Timor-Leste",
                    "common": "Timor-Leste",
                },
                "tet": {
                    "official": "Repúblika Demokrátika Timór-Leste",
                    "common": "Timór-Leste",
                },
            },
        },
        "cca2": "TL",
        "cca3": "TLS",
    },
    {
        "name": {
            "common": "French Polynesia",
            "official": "French Polynesia",
            "nativeName": {
                "fra": {
                    "official": "Polynésie française",
                    "common": "Polynésie française",
                },
            },
        },
        "cca2": "PF",
        "cca3": "PYF",
    },
    {
        "name": {
            "common": "Turkey",
            "official": "Republic of Turkey",
            "nativeName": {
                "tur": {
                    "official": "Türkiye Cumhuriyeti",
                    "common": "Türkiye",
                },
            },
        },
        "cca2": "TR",
        "cca3": "TUR",
    },
    {
        "name": {
            "common": "Guernsey",
            "official": "Bailiwick of Guernsey",
            "nativeName": {
                "eng": {
                    "official": "Bailiwick of Guernsey",
                    "common": "Guernsey",
                },
                "fra": {
                    "official": "Bailliage de Guernesey",
                    "common": "Guernesey",
                },
                "nfr": {
                    "official": "Dgèrnésiais",
                    "common": "Dgèrnésiais",
                },
            },
        },
        "cca2": "GG",
        "cca3": "GGY",
    },
    {
        "name": {
            "common": "Senegal",
            "official": "Republic of Senegal",
            "nativeName": {
                "fra": {
                    "official": "République du Sénégal",
                    "common": "Sénégal",
                },
            },
        },
        "cca2": "SN",
        "cca3": "SEN",
    },
    {
        "name": {
            "common": "Guatemala",
            "official": "Republic of Guatemala",
            "nativeName": {
                "spa": {
                    "official": "República de Guatemala",
                    "common": "Guatemala",
                },
            },
        },
        "cca2": "GT",
        "cca3": "GTM",
    },
    {
        "name": {
            "common": "Poland",
            "official": "Republic of Poland",
            "nativeName": {
                "pol": {
                    "official": "Rzeczpospolita Polska",
                    "common": "Polska",
                },
            },
        },
        "cca2": "PL",
        "cca3": "POL",
    },
    {
        "name": {
            "common": "Bahamas",
            "official": "Commonwealth of the Bahamas",
            "nativeName": {
                "eng": {
                    "official": "Commonwealth of the Bahamas",
                    "common": "Bahamas",
                },
            },
        },
        "cca2": "BS",
        "cca3": "BHS",
    },
    {
        "name": {
            "common": "Faroe Islands",
            "official": "Faroe Islands",
            "nativeName": {
                "dan": {
                    "official": "Færøerne",
                    "common": "Færøerne",
                },
                "fao": {
                    "official": "Føroyar",
                    "common": "Føroyar",
                },
            },
        },
        "cca2": "FO",
        "cca3": "FRO",
    },
    {
        "name": {
            "common": "Aruba",
            "official": "Aruba",
            "nativeName": {
                "nld": {
                    "official": "Aruba",
                    "common": "Aruba",
                },
                "pap": {
                    "official": "Aruba",
                    "common": "Aruba",
                },
            },
        },
        "cca2": "AW",
        "cca3": "ABW",
    },
    {
        "name": {
            "common": "Dominican Republic",
            "official": "Dominican Republic",
            "nativeName": {
                "spa": {
                    "official": "República Dominicana",
                    "common": "República Dominicana",
                },
            },
        },
        "cca2": "DO",
        "cca3": "DOM",
    },
    {
        "name": {
            "common": "Hong Kong",
            "official": "Hong Kong Special Administrative Region of the People's Republic of China",
            "nativeName": {
                "eng": {
                    "official": "Hong Kong Special Administrative Region of the People's Republic of China",
                    "common": "Hong Kong",
                },
                "zho": {
                    "official": "中华人民共和国香港特别行政区",
                    "common": "香港",
                },
            },
        },
        "cca2": "HK",
        "cca3": "HKG",
    },
    {
        "name": {
            "common": "São Tomé and Príncipe",
            "official": "Democratic Republic of São Tomé and Príncipe",
            "nativeName": {
                "por": {
                    "official": "República Democrática do São Tomé e Príncipe",
                    "common": "São Tomé e Príncipe",
                },
            },
        },
        "cca2": "ST",
        "cca3": "STP",
    },
    {
        "name": {
            "common": "Uruguay",
            "official": "Oriental Republic of Uruguay",
            "nativeName": {
                "spa": {
                    "official": "República Oriental del Uruguay",
                    "common": "Uruguay",
                },
            },
        },
        "cca2": "UY",
        "cca3": "URY",
    },
    {
        "name": {
            "common": "Bermuda",
            "official": "Bermuda",
            "nativeName": {
                "eng": {
                    "official": "Bermuda",
                    "common": "Bermuda",
                },
            },
        },
        "cca2": "BM",
        "cca3": "BMU",
    },
    {
        "name": {
            "common": "Wallis and Futuna",
            "official": "Territory of the Wallis and Futuna Islands",
            "nativeName": {
                "fra": {
                    "official": "Territoire des îles Wallis et Futuna",
                    "common": "Wallis et Futuna",
                },
            },
        },
        "cca2": "WF",
        "cca3": "WLF",
    },
    {
        "name": {
            "common": "South Africa",
            "official": "Republic of South Africa",
            "nativeName": {
                "afr": {
                    "official": "Republiek van Suid-Afrika",
                    "common": "South Africa",
                },
                "eng": {
                    "official": "Republic of South Africa",
                    "common": "South Africa",
                },
                "nbl": {
                    "official": "IRiphabliki yeSewula Afrika",
                    "common": "Sewula Afrika",
                },
                "nso": {
                    "official": "Rephaboliki ya Afrika-Borwa ",
                    "common": "Afrika-Borwa",
                },
                "sot": {
                    "official": "Rephaboliki ya Afrika Borwa",
                    "common": "Afrika Borwa",
                },
                "ssw": {
                    "official": "IRiphabhulikhi yeNingizimu Afrika",
                    "common": "Ningizimu Afrika",
                },
                "tsn": {
                    "official": "Rephaboliki ya Aforika Borwa",
                    "common": "Aforika Borwa",
                },
                "tso": {
                    "official": "Riphabliki ra Afrika Dzonga",
                    "common": "Afrika Dzonga",
                },
                "ven": {
                    "official": "Riphabuḽiki ya Afurika Tshipembe",
                    "common": "Afurika Tshipembe",
                },
                "xho": {
                    "official": "IRiphabliki yaseMzantsi Afrika",
                    "common": "Mzantsi Afrika",
                },
                "zul": {
                    "official": "IRiphabliki yaseNingizimu Afrika",
                    "common": "Ningizimu Afrika",
                },
            },
        },
        "cca2": "ZA",
        "cca3": "ZAF",
    },
    {
        "name": {
            "common": "Israel",
            "official": "State of Israel",
            "nativeName": {
                "ara": {
                    "official": "دولة إسرائيل",
                    "common": "إسرائيل",
                },
                "heb": {
                    "official": "מדינת ישראל",
                    "common": "ישראל",
                },
            },
        },
        "cca2": "IL",
        "cca3": "ISR",
    },
    {
        "name": {
            "common": "San Marino",
            "official": "Republic of San Marino",
            "nativeName": {
                "ita": {
                    "official": "Repubblica di San Marino",
                    "common": "San Marino",
                },
            },
        },
        "cca2": "SM",
        "cca3": "SMR",
    },
    {
        "name": {
            "common": "El Salvador",
            "official": "Republic of El Salvador",
            "nativeName": {
                "spa": {
                    "official": "República de El Salvador",
                    "common": "El Salvador",
                },
            },
        },
        "cca2": "SV",
        "cca3": "SLV",
    },
    {
        "name": {
            "common": "Mongolia",
            "official": "Mongolia",
            "nativeName": {
                "mon": {
                    "official": "Монгол улс",
                    "common": "Монгол улс",
                },
            },
        },
        "cca2": "MN",
        "cca3": "MNG",
    },
    {
        "name": {
            "common": "American Samoa",
            "official": "American Samoa",
            "nativeName": {
                "eng": {
                    "official": "American Samoa",
                    "common": "American Samoa",
                },
                "smo": {
                    "official": "Sāmoa Amelika",
                    "common": "Sāmoa Amelika",
                },
            },
        },
        "cca2": "AS",
        "cca3": "ASM",
    },
    {
        "name": {
            "common": "French Southern and Antarctic Lands",
            "official": "Territory of the French Southern and Antarctic Lands",
            "nativeName": {
                "fra": {
                    "official": "Territoire des Terres australes et antarctiques françaises",
                    "common": "Terres australes et antarctiques françaises",
                },
            },
        },
        "cca2": "TF",
        "cca3": "ATF",
    },
    {
        "name": {
            "common": "Zimbabwe",
            "official": "Republic of Zimbabwe",
            "nativeName": {
                "bwg": {
                    "official": "Republic of Zimbabwe",
                    "common": "Zimbabwe",
                },
                "eng": {
                    "official": "Republic of Zimbabwe",
                    "common": "Zimbabwe",
                },
                "kck": {
                    "official": "Republic of Zimbabwe",
                    "common": "Zimbabwe",
                },
                "khi": {
                    "official": "Republic of Zimbabwe",
                    "common": "Zimbabwe",
                },
                "ndc": {
                    "official": "Republic of Zimbabwe",
                    "common": "Zimbabwe",
                },
                "nde": {
                    "official": "Republic of Zimbabwe",
                    "common": "Zimbabwe",
                },
                "nya": {
                    "official": "Republic of Zimbabwe",
                    "common": "Zimbabwe",
                },
                "sna": {
                    "official": "Republic of Zimbabwe",
                    "common": "Zimbabwe",
                },
                "sot": {
                    "official": "Republic of Zimbabwe",
                    "common": "Zimbabwe",
                },
                "toi": {
                    "official": "Republic of Zimbabwe",
                    "common": "Zimbabwe",
                },
                "tsn": {
                    "official": "Republic of Zimbabwe",
                    "common": "Zimbabwe",
                },
                "tso": {
                    "official": "Republic of Zimbabwe",
                    "common": "Zimbabwe",
                },
                "ven": {
                    "official": "Republic of Zimbabwe",
                    "common": "Zimbabwe",
                },
                "xho": {
                    "official": "Republic of Zimbabwe",
                    "common": "Zimbabwe",
                },
                "zib": {
                    "official": "Republic of Zimbabwe",
                    "common": "Zimbabwe",
                },
            },
        },
        "cca2": "ZW",
        "cca3": "ZWE",
    },
    {
        "name": {
            "common": "Falkland Islands",
            "official": "Falkland Islands",
            "nativeName": {
                "eng": {
                    "official": "Falkland Islands",
                    "common": "Falkland Islands",
                },
            },
        },
        "cca2": "FK",
        "cca3": "FLK",
    },
    {
        "name": {
            "common": "Croatia",
            "official": "Republic of Croatia",
            "nativeName": {
                "hrv": {
                    "official": "Republika Hrvatska",
                    "common": "Hrvatska",
                },
            },
        },
        "cca2": "HR",
        "cca3": "HRV",
    },
    {
        "name": {
            "common": "Kiribati",
            "official": "Independent and Sovereign Republic of Kiribati",
            "nativeName": {
                "eng": {
                    "official": "Independent and Sovereign Republic of Kiribati",
                    "common": "Kiribati",
                },
                "gil": {
                    "official": "Ribaberiki Kiribati",
                    "common": "Kiribati",
                },
            },
        },
        "cca2": "KI",
        "cca3": "KIR",
    },
    {
        "name": {
            "common": "Marshall Islands",
            "official": "Republic of the Marshall Islands",
            "nativeName": {
                "eng": {
                    "official": "Republic of the Marshall Islands",
                    "common": "Marshall Islands",
                },
                "mah": {
                    "official": "Republic of the Marshall Islands",
                    "common": "M̧ajeļ",
                },
            },
        },
        "cca2": "MH",
        "cca3": "MHL",
    },
    {
        "name": {
            "common": "Norway",
            "official": "Kingdom of Norway",
            "nativeName": {
                "nno": {
                    "official": "Kongeriket Noreg",
                    "common": "Noreg",
                },
                "nob": {
                    "official": "Kongeriket Norge",
                    "common": "Norge",
                },
                "smi": {
                    "official": "Norgga gonagasriika",
                    "common": "Norgga",
                },
            },
        },
        "cca2": "NO",
        "cca3": "NOR",
    },
    {
        "name": {
            "common": "Mali",
            "official": "Republic of Mali",
            "nativeName": {
                "fra": {
                    "official": "République du Mali",
                    "common": "Mali",
                },
            },
        },
        "cca2": "ML",
        "cca3": "MLI",
    },
    {
        "name": {
            "common": "Zambia",
            "official": "Republic of Zambia",
            "nativeName": {
                "eng": {
                    "official": "Republic of Zambia",
                    "common": "Zambia",
                },
            },
        },
        "cca2": "ZM",
        "cca3": "ZMB",
    },
    {
        "name": {
            "common": "Maldives",
            "official": "Republic of the Maldives",
            "nativeName": {
                "div": {
                    "official": "ދިވެހިރާއްޖޭގެ ޖުމްހޫރިއްޔާ",
                    "common": "ދިވެހިރާއްޖޭގެ",
                },
            },
        },
        "cca2": "MV",
        "cca3": "MDV",
    },
    {
        "name": {
            "common": "Antigua and Barbuda",
            "official": "Antigua and Barbuda",
            "nativeName": {
                "eng": {
                    "official": "Antigua and Barbuda",
                    "common": "Antigua and Barbuda",
                },
            },
        },
        "cca2": "AG",
        "cca3": "ATG",
    },
    {
        "name": {
            "common": "Christmas Island",
            "official": "Territory of Christmas Island",
            "nativeName": {
                "eng": {
                    "official": "Territory of Christmas Island",
                    "common": "Christmas Island",
                },
            },
        },
        "cca2": "CX",
        "cca3": "CXR",
    },
    {
        "name": {
            "common": "Iran",
            "official": "Islamic Republic of Iran",
            "nativeName": {
                "fas": {
                    "official": "جمهوری اسلامی ایران",
                    "common": "ایران",
                },
            },
        },
        "cca2": "IR",
        "cca3": "IRN",
    },
    {
        "name": {
            "common": "Italy",
            "official": "Italian Republic",
            "nativeName": {
                "ita": {
                    "official": "Repubblica italiana",
                    "common": "Italia",
                },
            },
        },
        "cca2": "IT",
        "cca3": "ITA",
    },
    {
        "name": {
            "common": "Gambia",
            "official": "Republic of the Gambia",
            "nativeName": {
                "eng": {
                    "official": "Republic of the Gambia",
                    "common": "Gambia",
                },
            },
        },
        "cca2": "GM",
        "cca3": "GMB",
    },
    {
        "name": {
            "common": "South Korea",
            "official": "Republic of Korea",
            "nativeName": {
                "kor": {
                    "official": "대한민국",
                    "common": "한국",
                },
            },
        },
        "cca2": "KR",
        "cca3": "KOR",
    },
    {
        "name": {
            "common": "Papua New Guinea",
            "official": "Independent State of Papua New Guinea",
            "nativeName": {
                "eng": {
                    "official": "Independent State of Papua New Guinea",
                    "common": "Papua New Guinea",
                },
                "hmo": {
                    "official": "Independen Stet bilong Papua Niugini",
                    "common": "Papua Niu Gini",
                },
                "tpi": {
                    "official": "Independen Stet bilong Papua Niugini",
                    "common": "Papua Niugini",
                },
            },
        },
        "cca2": "PG",
        "cca3": "PNG",
    },
    {
        "name": {
            "common": "Egypt",
            "official": "Arab Republic of Egypt",
            "nativeName": {
                "ara": {
                    "official": "جمهورية مصر العربية",
                    "common": "مصر",
                },
            },
        },
        "cca2": "EG",
        "cca3": "EGY",
    },
    {
        "name": {
            "common": "Isle of Man",
            "official": "Isle of Man",
            "nativeName": {
                "eng": {
                    "official": "Isle of Man",
                    "common": "Isle of Man",
                },
                "glv": {
                    "official": "Ellan Vannin or Mannin",
                    "common": "Mannin",
                },
            },
        },
        "cca2": "IM",
        "cca3": "IMN",
    },
    {
        "name": {
            "common": "Latvia",
            "official": "Republic of Latvia",
            "nativeName": {
                "lav": {
                    "official": "Latvijas Republikas",
                    "common": "Latvija",
                },
            },
        },
        "cca2": "LV",
        "cca3": "LVA",
    },
    {
        "name": {
            "common": "Paraguay",
            "official": "Republic of Paraguay",
            "nativeName": {
                "grn": {
                    "official": "Tetã Paraguái",
                    "common": "Paraguái",
                },
                "spa": {
                    "official": "República de Paraguay",
                    "common": "Paraguay",
                },
            },
        },
        "cca2": "PY",
        "cca3": "PRY",
    },
    {
        "name": {
            "common": "Grenada",
            "official": "Grenada",
            "nativeName": {
                "eng": {
                    "official": "Grenada",
                    "common": "Grenada",
                },
            },
        },
        "cca2": "GD",
        "cca3": "GRD",
    },
    {
        "name": {
            "common": "Colombia",
            "official": "Republic of Colombia",
            "nativeName": {
                "spa": {
                    "official": "República de Colombia",
                    "common": "Colombia",
                },
            },
        },
        "cca2": "CO",
        "cca3": "COL",
    },
    {
        "name": {
            "common": "Finland",
            "official": "Republic of Finland",
            "nativeName": {
                "fin": {
                    "official": "Suomen tasavalta",
                    "common": "Suomi",
                },
                "swe": {
                    "official": "Republiken Finland",
                    "common": "Finland",
                },
            },
        },
        "cca2": "FI",
        "cca3": "FIN",
    },
    {
        "name": {
            "common": "Bulgaria",
            "official": "Republic of Bulgaria",
            "nativeName": {
                "bul": {
                    "official": "Република България",
                    "common": "България",
                },
            },
        },
        "cca2": "BG",
        "cca3": "BGR",
    },
    {
        "name": {
            "common": "Togo",
            "official": "Togolese Republic",
            "nativeName": {
                "fra": {
                    "official": "République togolaise",
                    "common": "Togo",
                },
            },
        },
        "cca2": "TG",
        "cca3": "TGO",
    },
    {
        "name": {
            "common": "Chile",
            "official": "Republic of Chile",
            "nativeName": {
                "spa": {
                    "official": "República de Chile",
                    "common": "Chile",
                },
            },
        },
        "cca2": "CL",
        "cca3": "CHL",
    },
    {
        "name": {
            "common": "Dominica",
            "official": "Commonwealth of Dominica",
            "nativeName": {
                "eng": {
                    "official": "Commonwealth of Dominica",
                    "common": "Dominica",
                },
            },
        },
        "cca2": "DM",
        "cca3": "DMA",
    },
    {
        "name": {
            "common": "Ireland",
            "official": "Republic of Ireland",
            "nativeName": {
                "eng": {
                    "official": "Republic of Ireland",
                    "common": "Ireland",
                },
                "gle": {
                    "official": "Poblacht na hÉireann",
                    "common": "Éire",
                },
            },
        },
        "cca2": "IE",
        "cca3": "IRL",
    },
    {
        "name": {
            "common": "Botswana",
            "official": "Republic of Botswana",
            "nativeName": {
                "eng": {
                    "official": "Republic of Botswana",
                    "common": "Botswana",
                },
                "tsn": {
                    "official": "Lefatshe la Botswana",
                    "common": "Botswana",
                },
            },
        },
        "cca2": "BW",
        "cca3": "BWA",
    },
    {
        "name": {
            "common": "Kosovo",
            "official": "Republic of Kosovo",
            "nativeName": {
                "sqi": {
                    "official": "Republika e Kosovës",
                    "common": "Kosova",
                },
                "srp": {
                    "official": "Република Косово",
                    "common": "Косово",
                },
            },
        },
        "cca2": "XK",
        "cca3": "UNK",
    },
    {
        "name": {
            "common": "United States",
            "official": "United States of America",
            "nativeName": {
                "eng": {
                    "official": "United States of America",
                    "common": "United States",
                },
            },
        },
        "cca2": "US",
        "cca3": "USA",
    },
    {
        "name": {
            "common": "Uzbekistan",
            "official": "Republic of Uzbekistan",
            "nativeName": {
                "rus": {
                    "official": "Республика Узбекистан",
                    "common": "Узбекистан",
                },
                "uzb": {
                    "official": "O'zbekiston Respublikasi",
                    "common": "O‘zbekiston",
                },
            },
        },
        "cca2": "UZ",
        "cca3": "UZB",
    },
    {
        "name": {
            "common": "Brazil",
            "official": "Federative Republic of Brazil",
            "nativeName": {
                "por": {
                    "official": "República Federativa do Brasil",
                    "common": "Brasil",
                },
            },
        },
        "cca2": "BR",
        "cca3": "BRA",
    },
    {
        "name": {
            "common": "Rwanda",
            "official": "Republic of Rwanda",
            "nativeName": {
                "eng": {
                    "official": "Republic of Rwanda",
                    "common": "Rwanda",
                },
                "fra": {
                    "official": "République rwandaise",
                    "common": "Rwanda",
                },
                "kin": {
                    "official": "Repubulika y'u Rwanda",
                    "common": "Rwanda",
                },
            },
        },
        "cca2": "RW",
        "cca3": "RWA",
    },
    {
        "name": {
            "common": "Liechtenstein",
            "official": "Principality of Liechtenstein",
            "nativeName": {
                "deu": {
                    "official": "Fürstentum Liechtenstein",
                    "common": "Liechtenstein",
                },
            },
        },
        "cca2": "LI",
        "cca3": "LIE",
    },
    {
        "name": {
            "common": "Bhutan",
            "official": "Kingdom of Bhutan",
            "nativeName": {
                "dzo": {
                    "official": "འབྲུག་རྒྱལ་ཁབ་",
                    "common": "འབྲུག་ཡུལ་",
                },
            },
        },
        "cca2": "BT",
        "cca3": "BTN",
    },
    {
        "name": {
            "common": "Montenegro",
            "official": "Montenegro",
            "nativeName": {
                "cnr": {
                    "official": "Црна Гора",
                    "common": "Црна Гора",
                },
            },
        },
        "cca2": "ME",
        "cca3": "MNE",
    },
    {
        "name": {
            "common": "Niger",
            "official": "Republic of Niger",
            "nativeName": {
                "fra": {
                    "official": "République du Niger",
                    "common": "Niger",
                },
            },
        },
        "cca2": "NE",
        "cca3": "NER",
    },
    {
        "name": {
            "common": "Albania",
            "official": "Republic of Albania",
            "nativeName": {
                "sqi": {
                    "official": "Republika e Shqipërisë",
                    "common": "Shqipëria",
                },
            },
        },
        "cca2": "AL",
        "cca3": "ALB",
    },
    {
        "name": {
            "common": "Morocco",
            "official": "Kingdom of Morocco",
            "nativeName": {
                "ara": {
                    "official": "المملكة المغربية",
                    "common": "المغرب",
                },
                "ber": {
                    "official": "ⵜⴰⴳⵍⴷⵉⵜ ⵏ ⵍⵎⵖⵔⵉⴱ",
                    "common": "ⵍⵎⴰⵖⵔⵉⴱ",
                },
            },
        },
        "cca2": "MA",
        "cca3": "MAR",
    },
    {
        "name": {
            "common": "Venezuela",
            "official": "Bolivarian Republic of Venezuela",
            "nativeName": {
                "spa": {
                    "official": "República Bolivariana de Venezuela",
                    "common": "Venezuela",
                },
            },
        },
        "cca2": "VE",
        "cca3": "VEN",
    },
    {
        "name": {
            "common": "Republic of the Congo",
            "official": "Republic of the Congo",
            "nativeName": {
                "fra": {
                    "official": "République du Congo",
                    "common": "République du Congo",
                },
                "kon": {
                    "official": "Repubilika ya Kongo",
                    "common": "Repubilika ya Kongo",
                },
                "lin": {
                    "official": "Republíki ya Kongó",
                    "common": "Republíki ya Kongó",
                },
            },
        },
        "cca2": "CG",
        "cca3": "COG",
    },
    {
        "name": {
            "common": "Burundi",
            "official": "Republic of Burundi",
            "nativeName": {
                "fra": {
                    "official": "République du Burundi",
                    "common": "Burundi",
                },
                "run": {
                    "official": "Republika y'Uburundi ",
                    "common": "Uburundi",
                },
            },
        },
        "cca2": "BI",
        "cca3": "BDI",
    },
    {
        "name": {
            "common": "Jersey",
            "official": "Bailiwick of Jersey",
            "nativeName": {
                "eng": {
                    "official": "Bailiwick of Jersey",
                    "common": "Jersey",
                },
                "fra": {
                    "official": "Bailliage de Jersey",
                    "common": "Jersey",
                },
                "nrf": {
                    "official": "Bailliage dé Jèrri",
                    "common": "Jèrri",
                },
            },
        },
        "cca2": "JE",
        "cca3": "JEY",
    },
    {
        "name": {
            "common": "North Macedonia",
            "official": "Republic of North Macedonia",
            "nativeName": {
                "mkd": {
                    "official": "Република Северна Македонија",
                    "common": "Македонија",
                },
            },
        },
        "cca2": "MK",
        "cca3": "MKD",
    },
    {
        "name": {
            "common": "Kyrgyzstan",
            "official": "Kyrgyz Republic",
            "nativeName": {
                "kir": {
                    "official": "Кыргыз Республикасы",
                    "common": "Кыргызстан",
                },
                "rus": {
                    "official": "Кыргызская Республика",
                    "common": "Киргизия",
                },
            },
        },
        "cca2": "KG",
        "cca3": "KGZ",
    },
    {
        "name": {
            "common": "Romania",
            "official": "Romania",
            "nativeName": {
                "ron": {
                    "official": "România",
                    "common": "România",
                },
            },
        },
        "cca2": "RO",
        "cca3": "ROU",
    },
    {
        "name": {
            "common": "Guam",
            "official": "Guam",
            "nativeName": {
                "cha": {
                    "official": "Guåhån",
                    "common": "Guåhån",
                },
                "eng": {
                    "official": "Guam",
                    "common": "Guam",
                },
                "spa": {
                    "official": "Guam",
                    "common": "Guam",
                },
            },
        },
        "cca2": "GU",
        "cca3": "GUM",
    },
    {
        "name": {
            "common": "Åland Islands",
            "official": "Åland Islands",
            "nativeName": {
                "swe": {
                    "official": "Landskapet Åland",
                    "common": "Åland",
                },
            },
        },
        "cca2": "AX",
        "cca3": "ALA",
    },
    {
        "name": {
            "common": "Equatorial Guinea",
            "official": "Republic of Equatorial Guinea",
            "nativeName": {
                "fra": {
                    "official": "République de la Guinée Équatoriale",
                    "common": "Guinée équatoriale",
                },
                "por": {
                    "official": "República da Guiné Equatorial",
                    "common": "Guiné Equatorial",
                },
                "spa": {
                    "official": "República de Guinea Ecuatorial",
                    "common": "Guinea Ecuatorial",
                },
            },
        },
        "cca2": "GQ",
        "cca3": "GNQ",
    },
    {
        "name": {
            "common": "South Georgia",
            "official": "South Georgia and the South Sandwich Islands",
            "nativeName": {
                "eng": {
                    "official": "South Georgia and the South Sandwich Islands",
                    "common": "South Georgia",
                },
            },
        },
        "cca2": "GS",
        "cca3": "SGS",
    },
    {
        "name": {
            "common": "French Guiana",
            "official": "Guiana",
            "nativeName": {
                "fra": {
                    "official": "Guyane",
                    "common": "Guyane française",
                },
            },
        },
        "cca2": "GF",
        "cca3": "GUF",
    },
    {
        "name": {
            "common": "Germany",
            "official": "Federal Republic of Germany",
            "nativeName": {
                "deu": {
                    "official": "Bundesrepublik Deutschland",
                    "common": "Deutschland",
                },
            },
        },
        "cca2": "DE",
        "cca3": "DEU",
    },
    {
        "name": {
            "common": "Denmark",
            "official": "Kingdom of Denmark",
            "nativeName": {
                "dan": {
                    "official": "Kongeriget Danmark",
                    "common": "Danmark",
                },
            },
        },
        "cca2": "DK",
        "cca3": "DNK",
    },
    {
        "name": {
            "common": "Iceland",
            "official": "Iceland",
            "nativeName": {
                "isl": {
                    "official": "Ísland",
                    "common": "Ísland",
                },
            },
        },
        "cca2": "IS",
        "cca3": "ISL",
    },
    {
        "name": {
            "common": "Somalia",
            "official": "Federal Republic of Somalia",
            "nativeName": {
                "ara": {
                    "official": "جمهورية الصومال‎‎",
                    "common": "الصومال‎‎",
                },
                "som": {
                    "official": "Jamhuuriyadda Federaalka Soomaaliya",
                    "common": "Soomaaliya",
                },
            },
        },
        "cca2": "SO",
        "cca3": "SOM",
    },
    {
        "name": {
            "common": "Micronesia",
            "official": "Federated States of Micronesia",
            "nativeName": {
                "eng": {
                    "official": "Federated States of Micronesia",
                    "common": "Micronesia",
                },
            },
        },
        "cca2": "FM",
        "cca3": "FSM",
    },
    {
        "name": {
            "common": "Laos",
            "official": "Lao People's Democratic Republic",
            "nativeName": {
                "lao": {
                    "official": "ສາທາລະນະ ຊາທິປະໄຕ ຄົນລາວ ຂອງ",
                    "common": "ສປປລາວ",
                },
            },
        },
        "cca2": "LA",
        "cca3": "LAO",
    },
    {
        "name": {
            "common": "Sint Maarten",
            "official": "Sint Maarten",
            "nativeName": {
                "eng": {
                    "official": "Sint Maarten",
                    "common": "Sint Maarten",
                },
                "fra": {
                    "official": "Saint-Martin",
                    "common": "Saint-Martin",
                },
                "nld": {
                    "official": "Sint Maarten",
                    "common": "Sint Maarten",
                },
            },
        },
        "cca2": "SX",
        "cca3": "SXM",
    },
    {
        "name": {
            "common": "Liberia",
            "official": "Republic of Liberia",
            "nativeName": {
                "eng": {
                    "official": "Republic of Liberia",
                    "common": "Liberia",
                },
            },
        },
        "cca2": "LR",
        "cca3": "LBR",
    },
    {
        "name": {
            "common": "Chad",
            "official": "Republic of Chad",
            "nativeName": {
                "ara": {
                    "official": "جمهورية تشاد",
                    "common": "تشاد‎",
                },
                "fra": {
                    "official": "République du Tchad",
                    "common": "Tchad",
                },
            },
        },
        "cca2": "TD",
        "cca3": "TCD",
    },
    {
        "name": {
            "common": "Australia",
            "official": "Commonwealth of Australia",
            "nativeName": {
                "eng": {
                    "official": "Commonwealth of Australia",
                    "common": "Australia",
                },
            },
        },
        "cca2": "AU",
        "cca3": "AUS",
    },
    {
        "name": {
            "common": "Burkina Faso",
            "official": "Burkina Faso",
            "nativeName": {
                "fra": {
                    "official": "République du Burkina",
                    "common": "Burkina Faso",
                },
            },
        },
        "cca2": "BF",
        "cca3": "BFA",
    },
    {
        "name": {
            "common": "Malta",
            "official": "Republic of Malta",
            "nativeName": {
                "eng": {
                    "official": "Republic of Malta",
                    "common": "Malta",
                },
                "mlt": {
                    "official": "Repubblika ta ' Malta",
                    "common": "Malta",
                },
            },
        },
        "cca2": "MT",
        "cca3": "MLT",
    },
    {
        "name": {
            "common": "Northern Mariana Islands",
            "official": "Commonwealth of the Northern Mariana Islands",
            "nativeName": {
                "cal": {
                    "official": "Commonwealth of the Northern Mariana Islands",
                    "common": "Northern Mariana Islands",
                },
                "cha": {
                    "official": "Sankattan Siha Na Islas Mariånas",
                    "common": "Na Islas Mariånas",
                },
                "eng": {
                    "official": "Commonwealth of the Northern Mariana Islands",
                    "common": "Northern Mariana Islands",
                },
            },
        },
        "cca2": "MP",
        "cca3": "MNP",
    },
    {
        "name": {
            "common": "Uganda",
            "official": "Republic of Uganda",
            "nativeName": {
                "eng": {
                    "official": "Republic of Uganda",
                    "common": "Uganda",
                },
                "swa": {
                    "official": "Republic of Uganda",
                    "common": "Uganda",
                },
            },
        },
        "cca2": "UG",
        "cca3": "UGA",
    },
    {
        "name": {
            "common": "Spain",
            "official": "Kingdom of Spain",
            "nativeName": {
                "spa": {
                    "official": "Reino de España",
                    "common": "España",
                },
            },
        },
        "cca2": "ES",
        "cca3": "ESP",
    },
    {
        "name": {
            "common": "Sudan",
            "official": "Republic of the Sudan",
            "nativeName": {
                "ara": {
                    "official": "جمهورية السودان",
                    "common": "السودان",
                },
                "eng": {
                    "official": "Republic of the Sudan",
                    "common": "Sudan",
                },
            },
        },
        "cca2": "SD",
        "cca3": "SDN",
    },
    {
        "name": {
            "common": "Taiwan",
            "official": "Republic of China (Taiwan)",
            "nativeName": {
                "zho": {
                    "official": "中華民國",
                    "common": "台灣",
                },
            },
        },
        "cca2": "TW",
        "cca3": "TWN",
    },
    {
        "name": {
            "common": "Afghanistan",
            "official": "Islamic Republic of Afghanistan",
            "nativeName": {
                "prs": {
                    "official": "جمهوری اسلامی افغانستان",
                    "common": "افغانستان",
                },
                "pus": {
                    "official": "د افغانستان اسلامي جمهوریت",
                    "common": "افغانستان",
                },
                "tuk": {
                    "official": "Owganystan Yslam Respublikasy",
                    "common": "Owganystan",
                },
            },
        },
        "cca2": "AF",
        "cca3": "AFG",
    },
    {
        "name": {
            "common": "Svalbard and Jan Mayen",
            "official": "Svalbard og Jan Mayen",
            "nativeName": {
                "nor": {
                    "official": "Svalbard og Jan Mayen",
                    "common": "Svalbard og Jan Mayen",
                },
            },
        },
        "cca2": "SJ",
        "cca3": "SJM",
    },
    {
        "name": {
            "common": "Fiji",
            "official": "Republic of Fiji",
            "nativeName": {
                "eng": {
                    "official": "Republic of Fiji",
                    "common": "Fiji",
                },
                "fij": {
                    "official": "Matanitu Tugalala o Viti",
                    "common": "Viti",
                },
                "hif": {
                    "official": "रिपब्लिक ऑफ फीजी",
                    "common": "फिजी",
                },
            },
        },
        "cca2": "FJ",
        "cca3": "FJI",
    },
    {
        "name": {
            "common": "Guinea-Bissau",
            "official": "Republic of Guinea-Bissau",
            "nativeName": {
                "por": {
                    "official": "República da Guiné-Bissau",
                    "common": "Guiné-Bissau",
                },
                "pov": {
                    "official": "República da Guiné-Bissau",
                    "common": "Guiné-Bissau",
                },
            },
        },
        "cca2": "GW",
        "cca3": "GNB",
    },
    {
        "name": {
            "common": "Andorra",
            "official": "Principality of Andorra",
            "nativeName": {
                "cat": {
                    "official": "Principat d'Andorra",
                    "common": "Andorra",
                },
            },
        },
        "cca2": "AD",
        "cca3": "AND",
    },
    {
        "name": {
            "common": "Algeria",
            "official": "People's Democratic Republic of Algeria",
            "nativeName": {
                "ara": {
                    "official": "الجمهورية الديمقراطية الشعبية الجزائرية",
                    "common": "الجزائر",
                },
            },
        },
        "cca2": "DZ",
        "cca3": "DZA",
    },
    {
        "name": {
            "common": "Portugal",
            "official": "Portuguese Republic",
            "nativeName": {
                "por": {
                    "official": "República Portuguesa",
                    "common": "Portugal",
                },
            },
        },
        "cca2": "PT",
        "cca3": "PRT",
    },
    {
        "name": {
            "common": "Mozambique",
            "official": "Republic of Mozambique",
            "nativeName": {
                "por": {
                    "official": "República de Moçambique",
                    "common": "Moçambique",
                },
            },
        },
        "cca2": "MZ",
        "cca3": "MOZ",
    },
    {
        "name": {
            "common": "Lesotho",
            "official": "Kingdom of Lesotho",
            "nativeName": {
                "eng": {
                    "official": "Kingdom of Lesotho",
                    "common": "Lesotho",
                },
                "sot": {
                    "official": "Kingdom of Lesotho",
                    "common": "Lesotho",
                },
            },
        },
        "cca2": "LS",
        "cca3": "LSO",
    },
    {
        "name": {
            "common": "North Korea",
            "official": "Democratic People's Republic of Korea",
            "nativeName": {
                "kor": {
                    "official": "조선민주주의인민공화국",
                    "common": "조선",
                },
            },
        },
        "cca2": "KP",
        "cca3": "PRK",
    },
    {
        "name": {
            "common": "Singapore",
            "official": "Republic of Singapore",
            "nativeName": {
                "eng": {
                    "official": "Republic of Singapore",
                    "common": "Singapore",
                },
                "zho": {
                    "official": "新加坡共和国",
                    "common": "新加坡",
                },
                "msa": {
                    "official": "Republik Singapura",
                    "common": "Singapura",
                },
                "tam": {
                    "official": "சிங்கப்பூர் குடியரசு",
                    "common": "சிங்கப்பூர்",
                },
            },
        },
        "cca2": "SG",
        "cca3": "SGP",
    },
    {
        "name": {
            "common": "Monaco",
            "official": "Principality of Monaco",
            "nativeName": {
                "fra": {
                    "official": "Principauté de Monaco",
                    "common": "Monaco",
                },
            },
        },
        "cca2": "MC",
        "cca3": "MCO",
    },
    {
        "name": {
            "common": "Lebanon",
            "official": "Lebanese Republic",
            "nativeName": {
                "ara": {
                    "official": "الجمهورية اللبنانية",
                    "common": "لبنان",
                },
                "fra": {
                    "official": "République libanaise",
                    "common": "Liban",
                },
            },
        },
        "cca2": "LB",
        "cca3": "LBN",
    },
    {
        "name": {
            "common": "Serbia",
            "official": "Republic of Serbia",
            "nativeName": {
                "srp": {
                    "official": "Република Србија",
                    "common": "Србија",
                },
            },
        },
        "cca2": "RS",
        "cca3": "SRB",
    },
    {
        "name": {
            "common": "Estonia",
            "official": "Republic of Estonia",
            "nativeName": {
                "est": {
                    "official": "Eesti Vabariik",
                    "common": "Eesti",
                },
            },
        },
        "cca2": "EE",
        "cca3": "EST",
    },
    {
        "name": {
            "common": "Barbados",
            "official": "Barbados",
            "nativeName": {
                "eng": {
                    "official": "Barbados",
                    "common": "Barbados",
                },
            },
        },
        "cca2": "BB",
        "cca3": "BRB",
    },
    {
        "name": {
            "common": "Mauritius",
            "official": "Republic of Mauritius",
            "nativeName": {
                "eng": {
                    "official": "Republic of Mauritius",
                    "common": "Mauritius",
                },
                "fra": {
                    "official": "République de Maurice",
                    "common": "Maurice",
                },
                "mfe": {
                    "official": "Republik Moris",
                    "common": "Moris",
                },
            },
        },
        "cca2": "MU",
        "cca3": "MUS",
    },
    {
        "name": {
            "common": "Saint Helena, Ascension and Tristan da Cunha",
            "official": "Saint Helena, Ascension and Tristan da Cunha",
            "nativeName": {
                "eng": {
                    "official": "Saint Helena, Ascension and Tristan da Cunha",
                    "common": "Saint Helena, Ascension and Tristan da Cunha",
                },
            },
        },
        "cca2": "SH",
        "cca3": "SHN",
    },
    {
        "name": {
            "common": "Belgium",
            "official": "Kingdom of Belgium",
            "nativeName": {
                "deu": {
                    "official": "Königreich Belgien",
                    "common": "Belgien",
                },
                "fra": {
                    "official": "Royaume de Belgique",
                    "common": "Belgique",
                },
                "nld": {
                    "official": "Koninkrijk België",
                    "common": "België",
                },
            },
        },
        "cca2": "BE",
        "cca3": "BEL",
    },
    {
        "name": {
            "common": "Libya",
            "official": "State of Libya",
            "nativeName": {
                "ara": {
                    "official": "الدولة ليبيا",
                    "common": "‏ليبيا",
                },
            },
        },
        "cca2": "LY",
        "cca3": "LBY",
    },
    {
        "name": {
            "common": "Nicaragua",
            "official": "Republic of Nicaragua",
            "nativeName": {
                "spa": {
                    "official": "República de Nicaragua",
                    "common": "Nicaragua",
                },
            },
        },
        "cca2": "NI",
        "cca3": "NIC",
    },
    {
        "name": {
            "common": "Kuwait",
            "official": "State of Kuwait",
            "nativeName": {
                "ara": {
                    "official": "دولة الكويت",
                    "common": "الكويت",
                },
            },
        },
        "cca2": "KW",
        "cca3": "KWT",
    },
    {
        "name": {
            "common": "New Caledonia",
            "official": "New Caledonia",
            "nativeName": {
                "fra": {
                    "official": "Nouvelle-Calédonie",
                    "common": "Nouvelle-Calédonie",
                },
            },
        },
        "cca2": "NC",
        "cca3": "NCL",
    },
    {
        "name": {
            "common": "France",
            "official": "French Republic",
            "nativeName": {
                "fra": {
                    "official": "République française",
                    "common": "France",
                },
            },
        },
        "cca2": "FR",
        "cca3": "FRA",
    },
    {
        "name": {
            "common": "Vietnam",
            "official": "Socialist Republic of Vietnam",
            "nativeName": {
                "vie": {
                    "official": "Cộng hòa xã hội chủ nghĩa Việt Nam",
                    "common": "Việt Nam",
                },
            },
        },
        "cca2": "VN",
        "cca3": "VNM",
    },
    {
        "name": {
            "common": "Saint Vincent and the Grenadines",
            "official": "Saint Vincent and the Grenadines",
            "nativeName": {
                "eng": {
                    "official": "Saint Vincent and the Grenadines",
                    "common": "Saint Vincent and the Grenadines",
                },
            },
        },
        "cca2": "VC",
        "cca3": "VCT",
    },
    {
        "name": {
            "common": "Bahrain",
            "official": "Kingdom of Bahrain",
            "nativeName": {
                "ara": {
                    "official": "مملكة البحرين",
                    "common": "‏البحرين",
                },
            },
        },
        "cca2": "BH",
        "cca3": "BHR",
    },
    {
        "name": {
            "common": "Curaçao",
            "official": "Country of Curaçao",
            "nativeName": {
                "eng": {
                    "official": "Country of Curaçao",
                    "common": "Curaçao",
                },
                "nld": {
                    "official": "Land Curaçao",
                    "common": "Curaçao",
                },
                "pap": {
                    "official": "Pais Kòrsou",
                    "common": "Pais Kòrsou",
                },
            },
        },
        "cca2": "CW",
        "cca3": "CUW",
    },
    {
        "name": {
            "common": "Bangladesh",
            "official": "People's Republic of Bangladesh",
            "nativeName": {
                "ben": {
                    "official": "বাংলাদেশ গণপ্রজাতন্ত্রী",
                    "common": "বাংলাদেশ",
                },
            },
        },
        "cca2": "BD",
        "cca3": "BGD",
    },
    {
        "name": {
            "common": "Ivory Coast",
            "official": "Republic of Côte d'Ivoire",
            "nativeName": {
                "fra": {
                    "official": "République de Côte d'Ivoire",
                    "common": "Côte d'Ivoire",
                },
            },
        },
        "cca2": "CI",
        "cca3": "CIV",
    },
    {
        "name": {
            "common": "DR Congo",
            "official": "Democratic Republic of the Congo",
            "nativeName": {
                "fra": {
                    "official": "République démocratique du Congo",
                    "common": "RD Congo",
                },
                "kon": {
                    "official": "Repubilika ya Kongo Demokratiki",
                    "common": "Repubilika ya Kongo Demokratiki",
                },
                "lin": {
                    "official": "Republiki ya Kongó Demokratiki",
                    "common": "Republiki ya Kongó Demokratiki",
                },
                "lua": {
                    "official": "Ditunga dia Kongu wa Mungalaata",
                    "common": "Ditunga dia Kongu wa Mungalaata",
                },
                "swa": {
                    "official": "Jamhuri ya Kidemokrasia ya Kongo",
                    "common": "Jamhuri ya Kidemokrasia ya Kongo",
                },
            },
        },
        "cca2": "CD",
        "cca3": "COD",
    },
    {
        "name": {
            "common": "Sri Lanka",
            "official": "Democratic Socialist Republic of Sri Lanka",
            "nativeName": {
                "sin": {
                    "official": "ශ්‍රී ලංකා ප්‍රජාතාන්ත්‍රික සමාජවාදී ජනරජය",
                    "common": "ශ්‍රී ලංකාව",
                },
                "tam": {
                    "official": "இலங்கை சனநாயக சோசலிசக் குடியரசு",
                    "common": "இலங்கை",
                },
            },
        },
        "cca2": "LK",
        "cca3": "LKA",
    },
    {
        "name": {
            "common": "United States Minor Outlying Islands",
            "official": "United States Minor Outlying Islands",
            "nativeName": {
                "eng": {
                    "official": "United States Minor Outlying Islands",
                    "common": "United States Minor Outlying Islands",
                },
            },
        },
        "cca2": "UM",
        "cca3": "UMI",
    },
    {
        "name": {
            "common": "Caribbean Netherlands",
            "official": "Bonaire, Sint Eustatius and Saba",
            "nativeName": {
                "nld": {
                    "official": "Bonaire, Sint Eustatius en Saba",
                    "common": "Caribisch Nederland",
                },
                "pap": {
                    "official": "Boneiru, Sint Eustatius y Saba",
                    "common": "Boneiru, Sint Eustatius y Saba",
                },
            },
        },
        "cca2": "BQ",
        "cca3": "BES",
    },
    {
        "name": {
            "common": "Nepal",
            "official": "Federal Democratic Republic of Nepal",
            "nativeName": {
                "nep": {
                    "official": "नेपाल संघीय लोकतान्त्रिक गणतन्त्र",
                    "common": "नेपाल",
                },
            },
        },
        "cca2": "NP",
        "cca3": "NPL",
    },
    {
        "name": {
            "common": "Bolivia",
            "official": "Plurinational State of Bolivia",
            "nativeName": {
                "aym": {
                    "official": "Wuliwya Suyu",
                    "common": "Wuliwya",
                },
                "grn": {
                    "official": "Tetã Volívia",
                    "common": "Volívia",
                },
                "que": {
                    "official": "Buliwya Mamallaqta",
                    "common": "Buliwya",
                },
                "spa": {
                    "official": "Estado Plurinacional de Bolivia",
                    "common": "Bolivia",
                },
            },
        },
        "cca2": "BO",
        "cca3": "BOL",
    },
    {
        "name": {
            "common": "Namibia",
            "official": "Republic of Namibia",
            "nativeName": {
                "afr": {
                    "official": "Republiek van Namibië",
                    "common": "Namibië",
                },
                "deu": {
                    "official": "Republik Namibia",
                    "common": "Namibia",
                },
                "eng": {
                    "official": "Republic of Namibia",
                    "common": "Namibia",
                },
                "her": {
                    "official": "Republic of Namibia",
                    "common": "Namibia",
                },
                "hgm": {
                    "official": "Republic of Namibia",
                    "common": "Namibia",
                },
                "kwn": {
                    "official": "Republic of Namibia",
                    "common": "Namibia",
                },
                "loz": {
                    "official": "Republic of Namibia",
                    "common": "Namibia",
                },
                "ndo": {
                    "official": "Republic of Namibia",
                    "common": "Namibia",
                },
                "tsn": {
                    "official": "Lefatshe la Namibia",
                    "common": "Namibia",
                },
            },
        },
        "cca2": "NA",
        "cca3": "NAM",
    },
    {
        "name": {
            "common": "Haiti",
            "official": "Republic of Haiti",
            "nativeName": {
                "fra": {
                    "official": "République d'Haïti",
                    "common": "Haïti",
                },
                "hat": {
                    "official": "Repiblik Ayiti",
                    "common": "Ayiti",
                },
            },
        },
        "cca2": "HT",
        "cca3": "HTI",
    },
    {
        "name": {
            "common": "Suriname",
            "official": "Republic of Suriname",
            "nativeName": {
                "nld": {
                    "official": "Republiek Suriname",
                    "common": "Suriname",
                },
            },
        },
        "cca2": "SR",
        "cca3": "SUR",
    },
    {
        "name": {
            "common": "Saint Martin",
            "official": "Saint Martin",
            "nativeName": {
                "fra": {
                    "official": "Saint-Martin",
                    "common": "Saint-Martin",
                },
            },
        },
        "cca2": "MF",
        "cca3": "MAF",
    },
    {
        "name": {
            "common": "Canada",
            "official": "Canada",
            "nativeName": {
                "eng": {
                    "official": "Canada",
                    "common": "Canada",
                },
                "fra": {
                    "official": "Canada",
                    "common": "Canada",
                },
            },
        },
        "cca2": "CA",
        "cca3": "CAN",
    },
    {
        "name": {
            "common": "Honduras",
            "official": "Republic of Honduras",
            "nativeName": {
                "spa": {
                    "official": "República de Honduras",
                    "common": "Honduras",
                },
            },
        },
        "cca2": "HN",
        "cca3": "HND",
    },
    {
        "name": {
            "common": "Vatican City",
            "official": "Vatican City State",
            "nativeName": {
                "ita": {
                    "official": "Stato della Città del Vaticano",
                    "common": "Vaticano",
                },
                "lat": {
                    "official": "Status Civitatis Vaticanæ",
                    "common": "Vaticanæ",
                },
            },
        },
        "cca2": "VA",
        "cca3": "VAT",
    },
    {
        "name": {
            "common": "United Arab Emirates",
            "official": "United Arab Emirates",
            "nativeName": {
                "ara": {
                    "official": "الإمارات العربية المتحدة",
                    "common": "دولة الإمارات العربية المتحدة",
                },
            },
        },
        "cca2": "AE",
        "cca3": "ARE",
    },
    {
        "name": {
            "common": "Guinea",
            "official": "Republic of Guinea",
            "nativeName": {
                "fra": {
                    "official": "République de Guinée",
                    "common": "Guinée",
                },
            },
        },
        "cca2": "GN",
        "cca3": "GIN",
    },
    {
        "name": {
            "common": "Cameroon",
            "official": "Republic of Cameroon",
            "nativeName": {
                "eng": {
                    "official": "Republic of Cameroon",
                    "common": "Cameroon",
                },
                "fra": {
                    "official": "République du Cameroun",
                    "common": "Cameroun",
                },
            },
        },
        "cca2": "CM",
        "cca3": "CMR",
    },
    {
        "name": {
            "common": "Cyprus",
            "official": "Republic of Cyprus",
            "nativeName": {
                "ell": {
                    "official": "Δημοκρατία της Κύπρος",
                    "common": "Κύπρος",
                },
                "tur": {
                    "official": "Kıbrıs Cumhuriyeti",
                    "common": "Kıbrıs",
                },
            },
        },
        "cca2": "CY",
        "cca3": "CYP",
    },
    {
        "name": {
            "common": "Trinidad and Tobago",
            "official": "Republic of Trinidad and Tobago",
            "nativeName": {
                "eng": {
                    "official": "Republic of Trinidad and Tobago",
                    "common": "Trinidad and Tobago",
                },
            },
        },
        "cca2": "TT",
        "cca3": "TTO",
    },
    {
        "name": {
            "common": "Sweden",
            "official": "Kingdom of Sweden",
            "nativeName": {
                "swe": {
                    "official": "Konungariket Sverige",
                    "common": "Sverige",
                },
            },
        },
        "cca2": "SE",
        "cca3": "SWE",
    },
    {
        "name": {
            "common": "Madagascar",
            "official": "Republic of Madagascar",
            "nativeName": {
                "fra": {
                    "official": "République de Madagascar",
                    "common": "Madagascar",
                },
                "mlg": {
                    "official": "Repoblikan'i Madagasikara",
                    "common": "Madagasikara",
                },
            },
        },
        "cca2": "MG",
        "cca3": "MDG",
    },
    {
        "name": {
            "common": "Mayotte",
            "official": "Department of Mayotte",
            "nativeName": {
                "fra": {
                    "official": "Département de Mayotte",
                    "common": "Mayotte",
                },
            },
        },
        "cca2": "YT",
        "cca3": "MYT",
    },
    {
        "name": {
            "common": "Cayman Islands",
            "official": "Cayman Islands",
            "nativeName": {
                "eng": {
                    "official": "Cayman Islands",
                    "common": "Cayman Islands",
                },
            },
        },
        "cca2": "KY",
        "cca3": "CYM",
    },
    {
        "name": {
            "common": "Malaysia",
            "official": "Malaysia",
            "nativeName": {
                "eng": {
                    "official": "Malaysia",
                    "common": "Malaysia",
                },
                "msa": {
                    "official": "مليسيا",
                    "common": "مليسيا",
                },
            },
        },
        "cca2": "MY",
        "cca3": "MYS",
    },
    {
        "name": {
            "common": "Benin",
            "official": "Republic of Benin",
            "nativeName": {
                "fra": {
                    "official": "République du Bénin",
                    "common": "Bénin",
                },
            },
        },
        "cca2": "BJ",
        "cca3": "BEN",
    },
    {
        "name": {
            "common": "Greenland",
            "official": "Greenland",
            "nativeName": {
                "kal": {
                    "official": "Kalaallit Nunaat",
                    "common": "Kalaallit Nunaat",
                },
            },
        },
        "cca2": "GL",
        "cca3": "GRL",
    },
    {
        "name": {
            "common": "Switzerland",
            "official": "Swiss Confederation",
            "nativeName": {
                "fra": {
                    "official": "Confédération suisse",
                    "common": "Suisse",
                },
                "gsw": {
                    "official": "Schweizerische Eidgenossenschaft",
                    "common": "Schweiz",
                },
                "ita": {
                    "official": "Confederazione Svizzera",
                    "common": "Svizzera",
                },
                "roh": {
                    "official": "Confederaziun svizra",
                    "common": "Svizra",
                },
            },
        },
        "cca2": "CH",
        "cca3": "CHE",
    },
    {
        "name": {
            "common": "Georgia",
            "official": "Georgia",
            "nativeName": {
                "kat": {
                    "official": "საქართველო",
                    "common": "საქართველო",
                },
            },
        },
        "cca2": "GE",
        "cca3": "GEO",
    },
    {
        "name": {
            "common": "Ecuador",
            "official": "Republic of Ecuador",
            "nativeName": {
                "spa": {
                    "official": "República del Ecuador",
                    "common": "Ecuador",
                },
            },
        },
        "cca2": "EC",
        "cca3": "ECU",
    },
    {
        "name": {
            "common": "Cape Verde",
            "official": "Republic of Cabo Verde",
            "nativeName": {
                "por": {
                    "official": "República de Cabo Verde",
                    "common": "Cabo Verde",
                },
            },
        },
        "cca2": "CV",
        "cca3": "CPV",
    },
    {
        "name": {
            "common": "Luxembourg",
            "official": "Grand Duchy of Luxembourg",
            "nativeName": {
                "deu": {
                    "official": "Großherzogtum Luxemburg",
                    "common": "Luxemburg",
                },
                "fra": {
                    "official": "Grand-Duché de Luxembourg",
                    "common": "Luxembourg",
                },
                "ltz": {
                    "official": "Groussherzogtum Lëtzebuerg",
                    "common": "Lëtzebuerg",
                },
            },
        },
        "cca2": "LU",
        "cca3": "LUX",
    },
    {
        "name": {
            "common": "Saint Lucia",
            "official": "Saint Lucia",
            "nativeName": {
                "eng": {
                    "official": "Saint Lucia",
                    "common": "Saint Lucia",
                },
            },
        },
        "cca2": "LC",
        "cca3": "LCA",
    },
    {
        "name": {
            "common": "United States Virgin Islands",
            "official": "Virgin Islands of the United States",
            "nativeName": {
                "eng": {
                    "official": "Virgin Islands of the United States",
                    "common": "United States Virgin Islands",
                },
            },
        },
        "cca2": "VI",
        "cca3": "VIR",
    },
    {
        "name": {
            "common": "Japan",
            "official": "Japan",
            "nativeName": {
                "jpn": {
                    "official": "日本",
                    "common": "日本",
                },
            },
        },
        "cca2": "JP",
        "cca3": "JPN",
    },
    {
        "name": {
            "common": "Jamaica",
            "official": "Jamaica",
            "nativeName": {
                "eng": {
                    "official": "Jamaica",
                    "common": "Jamaica",
                },
                "jam": {
                    "official": "Jamaica",
                    "common": "Jamaica",
                },
            },
        },
        "cca2": "JM",
        "cca3": "JAM",
    },
    {
        "name": {
            "common": "Ethiopia",
            "official": "Federal Democratic Republic of Ethiopia",
            "nativeName": {
                "amh": {
                    "official": "የኢትዮጵያ ፌዴራላዊ ዲሞክራሲያዊ ሪፐብሊክ",
                    "common": "ኢትዮጵያ",
                },
            },
        },
        "cca2": "ET",
        "cca3": "ETH",
    },
    {
        "name": {
            "common": "Pakistan",
            "official": "Islamic Republic of Pakistan",
            "nativeName": {
                "eng": {
                    "official": "Islamic Republic of Pakistan",
                    "common": "Pakistan",
                },
                "urd": {
                    "official": "اسلامی جمہوریۂ پاكستان",
                    "common": "پاكستان",
                },
            },
        },
        "cca2": "PK",
        "cca3": "PAK",
    },
    {
        "name": {
            "common": "Montserrat",
            "official": "Montserrat",
            "nativeName": {
                "eng": {
                    "official": "Montserrat",
                    "common": "Montserrat",
                },
            },
        },
        "cca2": "MS",
        "cca3": "MSR",
    },
    {
        "name": {
            "common": "Lithuania",
            "official": "Republic of Lithuania",
            "nativeName": {
                "lit": {
                    "official": "Lietuvos Respublikos",
                    "common": "Lietuva",
                },
            },
        },
        "cca2": "LT",
        "cca3": "LTU",
    },
    {
        "name": {
            "common": "Greece",
            "official": "Hellenic Republic",
            "nativeName": {
                "ell": {
                    "official": "Ελληνική Δημοκρατία",
                    "common": "Ελλάδα",
                },
            },
        },
        "cca2": "GR",
        "cca3": "GRC",
    },
];
