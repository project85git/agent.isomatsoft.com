
import providerData from './casinoProvider.json'
const FindGameTypeIdByName = (gameType) => {
    const gameTypeValues = {
        100: "Casino Lobby",
        101: "Baccarat",
        102: "Blackjack",
        103: "Roulette",
        104: "Dragon Tiger",
        105: "Sicbo",
        106: "Bull Bull",
        107: "Poker",
        108: "Dice",
        109: "Game Show",
        200: "Games Lobby",
        201: "Slots",
        202: "Arcade Games",
        203: "Fishing Games",
        204: "Table Games",
        205: "Scratchcards",
        206: "Virtual Games",
        207: "Lottery Games",
        208: "Other Games",
        300: "Sportsbook"
    };
  
    return gameTypeValues[gameType] || null;
  };
  const  getGameProvider=(id)=>{
      return providerData.all_providers_name[id]||"Casino"
    }
    function formatDate(inputDate) {
      const date = new Date(inputDate);
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Adding 1 because getMonth() returns zero-based months
      const year = date.getFullYear().toString();
    
      return `${day}/${month}/${year}`;
    }
        function convertToUniversalTime(time12h) {
          // Check if the input is undefined or not in the expected format
          if (!time12h || typeof time12h !== 'string' || !time12h.includes(':')) {
              return "Invalid time format";
          }
      
          // Split the time string into hours, minutes, seconds, and AM/PM indicator
          const [time, period] = time12h.split(' ');
      
          // Split hours, minutes, and seconds
          const [hours, minutes, seconds] = time.split(':').map(Number);
      
          // Convert hours to 24-hour format
          let hours24 = hours % 12;
          hours24 += (period && period.toUpperCase() === 'PM') ? 12 : 0;
          
          // Convert midnight (12:00:00 AM) to 24-hour format (00:00:00)
          if (hours === 12 && (!period || period.toUpperCase() === 'AM')) {
              hours24 = 0;
          }
      
          // Return the time in 24-hour format
          return `${hours24.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      }

      function formatDateTime(isoString) {
        const date = new Date(isoString);
    
        // Using UTC methods to ensure it's strictly UTC+0
        const day = String(date.getUTCDate()).padStart(2, '0');
        const month = String(date.getUTCMonth() + 1).padStart(2, '0');
        const year = date.getUTCFullYear();
    
        const hours = String(date.getUTCHours()).padStart(2, '0');
        const minutes = String(date.getUTCMinutes()).padStart(2, '0');
        const seconds = String(date.getUTCSeconds()).padStart(2, '0');
    
        return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
    }
  
      const checkPermission = (permissions, key) => {
        const permission = permissions?.find((permission) => permission.name === key);
        return permission ? permission.value : false;
      };

      function formatBonusText(input) {
        return input
            .split('_') // Split the string by underscores
            .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize the first letter of each word
            .join(' '); // Join the words with a space
    }
    
     const parseData=(string)=>{
        try {
          return JSON.parse(string).en.replace(/_/g, '  '); 
        } catch (error) {
          return string.replace(/_/g, '  ');
        }
      }




      
  const currencyData = [
    {
      value: "ALL",
      label: "Albanian Lek (ALL)",
      countriesUsedCurrency: ["Albania"],
    },
    {
      value: "ADP",
      label: "Andorran Peseta (ADP)",
      countriesUsedCurrency: ["Andorra"],
    },
    {
      value: "AOA",
      label: "Angolan Kwanza (AOA)",
      countriesUsedCurrency: ["Angola"],
    },
    {
      value: "ARS",
      label: "Argentine Peso (ARS)",
      countriesUsedCurrency: ["Argentina"],
    },
    {
      value: "XCD",
      label: "East Caribbean Dollar (XCD)",
      countriesUsedCurrency: [
        "Antigua  Deis",
        "Dominica",
        "Grenada",
        "St Kitts & Nevis",
        "St Lucia",
      ],
    },

    {
      value: "AMD",
      label: "Armenian Dram (AMD)",
      countriesUsedCurrency: ["Armenia"],
    },
    {
      value: "AED",
      label: "United Arab Emirates Dirham (AED)",
      countriesUsedCurrency: ["United Arab Emirates"],
    },
    {
      value: "AFN",
      label: "Afghanistan (AFN)",
      countriesUsedCurrency: ["Afghanistan"],
    },

    {
      value: "AUD",
      label: "Australian Dollar (AUD)",
      countriesUsedCurrency: ["Australia", "Nauru", "Kiribati", "Tuvalu"],
    },

    {
      value: "AZN",
      label: "Azerbaijani Manat (AZN)",
      countriesUsedCurrency: ["Azerbaijan"],
    },
    {
      value: "BSD",
      label: "Bahamian Dollar (BSD)",
      countriesUsedCurrency: ["Bahamas"],
    },
    {
      value: "BHD",
      label: "Bahraini Dinar (BHD)",
      countriesUsedCurrency: ["Bahrain"],
    },
    {
      value: "BBD",
      label: "Barbadian Dollar (BBD)",
      countriesUsedCurrency: ["Barbados"],
    },
    {
      value: "BYN",
      label: "Belarusian Ruble (BYN)",
      countriesUsedCurrency: ["Belarus"],
    },
    {
      value: "BDT",
      label: "Bangladeshi Taka (BDT)",
      countriesUsedCurrency: ["Bangladesh"],
    },
    {
      value: "BND",
      label: "Brunei Dollar (BND)",
      countriesUsedCurrency: ["Brunei"],
    },

    {
      value: "BZD",
      label: "Belize Dollar (BZD)",
      countriesUsedCurrency: ["Belize"],
    },

    {
      value: "BMD",
      label: "Bermudian Dollar (BMD)",
      countriesUsedCurrency: ["Bermuda"],
    },
    {
      value: "INR",
      label: "Indian Rupee (INR)",
      countriesUsedCurrency: ["Bhutan"],
    },
    {
      value: "BOB",
      label: "Bolivian Boliviano (BOB)",
      countriesUsedCurrency: ["Bolivia"],
    },
    {
      value: "BAM",
      label: "Bosnia-Herzegovina Convertible Mark (BAM)",
      countriesUsedCurrency: ["Bosnia Herzegovina"],
    },
    {
      value: "BWP",
      label: "Botswana Pula (BWP)",
      countriesUsedCurrency: ["Botswana"],
    },
    {
      value: "BRL",
      label: "Brazilian Real (BRL)",
      countriesUsedCurrency: ["Brazil"],
    },

    {
      value: "BGN",
      label: "Bulgarian Lev (BGN)",
      countriesUsedCurrency: ["Bulgaria"],
    },
    {
      value: "XOF",
      label: "West African CFA Franc (XOF)",
      countriesUsedCurrency: [
        "Burkina",
        "Benin",
        "Guinea-Bissau",
        "Ivory Coast",
        "Mali",
        "Niger",
        "Senegal",
        "Togo",
      ],
    },
    {
      value: "BIF",
      label: "Burundian Franc (BIF)",
      countriesUsedCurrency: ["Burundi"],
    },
    {
      value: "XAF",
      label: "Central African CFA Franc (XAF)",
      countriesUsedCurrency: [
        "Cameroon",
        "Central African Republic",
        "Chad",
        "Congo",
        "Equatorial Guinea",
        "Gabon",
      ],
    },
    {
      value: "CVE",
      label: "Cape Verdean Escudo (CVE)",
      countriesUsedCurrency: ["Cape Verde"],
    },
    {
      value: "KYD",
      label: "Cayman Islands Dollar (KYD)",
      countriesUsedCurrency: ["Cayman Islands"],
    },

    {
      value: "CLP",
      label: "Chilean Peso (CLP)",
      countriesUsedCurrency: ["Chile"],
    },
    {
      value: "CNY",
      label: "Chinese Yuan (CNY)",
      countriesUsedCurrency: ["China"],
    },
    {
      value: "COP",
      label: "Colombian Peso (COP)",
      countriesUsedCurrency: ["Colombia"],
    },
    {
      value: "KMF",
      label: "Comorian Franc (KMF)",
      countriesUsedCurrency: ["Comoros"],
    },
    {
      value: "CDF",
      label: "Congolese Franc (CDF)",
      countriesUsedCurrency: ["Congo (Democratic Rep)"],
    },
    {
      value: "CRC",
      label: "Costa Rican Colón (CRC)",
      countriesUsedCurrency: ["Costa Rica"],
    },
    {
      value: "HRK",
      label: "Croatian Kuna (HRK)",
      countriesUsedCurrency: ["Croatia"],
    },
    {
      value: "CUP",
      label: "Cuban Peso (CUP)",
      countriesUsedCurrency: ["Cuba"],
    },
    {
      value: "CYP",
      label: "Cypriot Pound (CYP)",
      countriesUsedCurrency: ["Cyprus"],
    },
    {
      value: "CAD",
      label: "Canadian Dollar (CAD)",
      countriesUsedCurrency: ["Canada"],
    },

    {
      value: "CZK",
      label: "Czech Koruna (CZK)",
      countriesUsedCurrency: ["Czech Republic"],
    },
    {
      value: "DKK",
      label: "Danish Krone (DKK)",
      countriesUsedCurrency: ["Denmark"],
    },
    {
      value: "DOP",
      label: "Dominican Peso (DOP)",
      countriesUsedCurrency: ["Dominican Republic"],
    },
    {
      value: "DJF",
      label: "Djiboutian Franc (DJF)",
      countriesUsedCurrency: ["Djibouti"],
    },

    {
      value: "DZD",
      label: "Algerian Dinar (DZD)",
      countriesUsedCurrency: ["Algeria"],
    },
    {
      value: "EUR",
      label: "Germany (EUR)",
      countriesUsedCurrency: [
        "Austria",
        "Belgium",
        "Cyprus",
        "Estonia",
        "Monaco",
        "Montenegro",
        "Finland",
        "France",
        "Germany",
        "Greece",
        "Ireland",
        "Italy",
        "Kosovo",
        "Latvia",
        "San Marino",
        "Lithuania",
        "Vatican City",
        "Luxembourg",
        "Malta",
        "Netherlands",
        "Portugal",
        "Slovakia",
        "Slovenia",
        "Spain",
        "Ireland (Republic)",
      ],
    },
    {
      value: "LBP",
      label: "Lebanese Pound (LBP)",
      countriesUsedCurrency: ["Lebanon"],
    },
    {
      value: "LSL",
      label: "Lesotho Loti (LSL)",
      countriesUsedCurrency: ["Lesotha"],
    },
    {
      value: "LRD",
      label: "Liberian Dollar (LRD)",
      countriesUsedCurrency: ["Liberia"],
    },
    {
      value: "LYD",
      label: "Libyan Dinar (LYD)",
      countriesUsedCurrency: ["Libya"],
    },

    {
      value: "CHF",
      label: "Swiss Franc (CHF)",
      countriesUsedCurrency: ["Liechtenstein", "Switzerland"],
    },
    {
      value: "MKD",
      label: "Macedonian Denar (MKD)",
      countriesUsedCurrency: ["Macedonia"],
    },
    {
      value: "MGA",
      label: "Malagasy Ariary (MGA)",
      countriesUsedCurrency: ["Madagascar"],
    },
    {
      value: "MWK",
      label: "Malawian Kwacha (MWK)",
      countriesUsedCurrency: ["Malawi"],
    },
    {
      value: "MYR",
      label: "Malaysian Ringgit (MYR)",
      countriesUsedCurrency: ["Malaysia"],
    },
    {
      value: "MRO",
      label: "Mauritanian Ouguiya (MRO)",
      countriesUsedCurrency: ["Mauritania"],
    },
    {
      value: "MUR",
      label: "Mauritian Rupee (MUR)",
      countriesUsedCurrency: ["Mauritius"],
    },
    {
      value: "MZN",
      label: "Mozambican Metical (MZN)",
      countriesUsedCurrency: ["Mozambique"],
    },
    {
      value: "MMK",
      label: "Myanmar Kyat (MMK)",
      countriesUsedCurrency: ["Myanmar (Burma)", "Myanmar"],
    },
    {
      value: "NAD",
      label: "Namibian Dollar (NAD)",
      countriesUsedCurrency: ["Namibia"],
    },

    {
      value: "NIO",
      label: "Nicaraguan Córdoba (NIO)",
      countriesUsedCurrency: ["Nicaragua"],
    },
    {
      value: "OMR",
      label: "Omani Rial (OMR)",
      countriesUsedCurrency: ["Oman"],
    },
    {
      value: "ERN",
      label: "Eritrean Nakfa (ERN)",
      countriesUsedCurrency: ["Eritrea"],
    },
    {
      value: "ETB",
      label: "Ethiopian Birr (ETB)",
      countriesUsedCurrency: ["Ethiopia"],
    },
    {
      value: "FJD",
      label: "Fijian Dollar (FJD)",
      countriesUsedCurrency: ["Fiji"],
    },
    {
      value: "GMD",
      label: "Gambian Dalasi (GMD)",
      countriesUsedCurrency: ["Gambia"],
    },
    {
      value: "GEL",
      label: "Georgian Lari (GEL)",
      countriesUsedCurrency: ["Georgia"],
    },
    {
      value: "GHS",
      label: "Ghanaian Cedi (GHS)",
      countriesUsedCurrency: ["Ghana"],
    },
    {
      value: "GTQ",
      label: "Guatemalan Quetzal (GTQ)",
      countriesUsedCurrency: ["Guatemala"],
    },
    {
      value: "GNF",
      label: "Guinean Franc (GNF)",
      countriesUsedCurrency: ["Guinea"],
    },
    {
      value: "GYD",
      label: "Guyanese Dollar (GYD)",
      countriesUsedCurrency: ["Guyana"],
    },
    {
      value: "HTG",
      label: "Haitian Gourde (HTG)",
      countriesUsedCurrency: ["Haiti"],
    },
    {
      value: "HNL",
      label: "Honduran Lempira (HNL)",
      countriesUsedCurrency: ["Honduras"],
    },
    {
      value: "HUF",
      label: "Hungarian Forint (HUF)",
      countriesUsedCurrency: ["Hungary"],
    },
    {
      value: "ISK",
      label: "Icelandic Króna (ISK)",
      countriesUsedCurrency: ["Iceland"],
    },
    {
      value: "IRR",
      label: "Iranian Rial (IRR)",
      countriesUsedCurrency: ["Iran"],
    },
    {
      value: "IQD",
      label: "Iraqi Dinar (IQD)",
      countriesUsedCurrency: ["Iraq"],
    },
    {
      value: "GBP",
      label: "British Pound (GBP)",
      countriesUsedCurrency: ["United Kingdom"],
    },
    {
      value: "HKD",
      label: "Hong Kong Dollar (HKD)",
      countriesUsedCurrency: ["Hong Kong"],
    },

    {
      value: "IDR",
      label: "Indonesian Rupiah (IDR)",
      countriesUsedCurrency: ["Indonesia"],
    },
    {
      value: "IDO",
      label: "Indian Rupee (IDO)",
      countriesUsedCurrency: ["India"],
    },
    {
      value: "INR",
      label: "Indian Rupee (INR)",
      countriesUsedCurrency: ["India"],
    },
    {
      value: "JPY",
      label: "Japanese Yen (JPY)",
      countriesUsedCurrency: ["Japan"],
    },
    {
      value: "KRW",
      label: "South Korean Won (KRW)",
      countriesUsedCurrency: ["South Korea", "Korea South"],
    },

    {
      value: "KHR",
      label: "Cambodian Riel (KHR)",
      countriesUsedCurrency: ["Cambodia"],
    },
    {
      value: "LAK",
      label: "Laotian Kip (LAK)",
      countriesUsedCurrency: ["Laos"],
    },
    {
      value: "LKR",
      label: "Sri Lankan Rupee (LKR)",
      countriesUsedCurrency: ["Sri Lanka"],
    },
    {
      value: "ILS",
      label: "Israeli Shekel (ILS)",
      countriesUsedCurrency: ["Israel"],
    },
    {
      value: "JMD",
      label: "Jamaican Dollar (JMD)",
      countriesUsedCurrency: ["Jamaica"],
    },
    {
      value: "JOD",
      label: "Jordanian Dinar (JOD)",
      countriesUsedCurrency: ["Jordan"],
    },
    {
      value: "KZT",
      label: "Kazakhstani Tenge (KZT)",
      countriesUsedCurrency: ["Kazakhstan"],
    },
    {
      value: "KES",
      label: "Kenyan Shilling (KES)",
      countriesUsedCurrency: ["Kenya"],
    },

    {
      value: "KPW",
      label: "North Korean Won (KPW)",
      countriesUsedCurrency: ["Korea North"],
    },

    {
      value: "KWD",
      label: "Kuwaiti Dinar (KWD)",
      countriesUsedCurrency: ["Kuwait"],
    },
    {
      value: "KGS",
      label: "Kyrgyzstani Som (KGS)",
      countriesUsedCurrency: ["Kyrgyzstan"],
    },
    {
      value: "MAD",
      label: "Moroccan Dirham (MAD)",
      countriesUsedCurrency: ["Morocco"],
    },

    {
      value: "MNT",
      label: "Mongolian Tugrik (MNT)",
      countriesUsedCurrency: ["Mongolia"],
    },
    {
      value: "MYK",
      label: "Malaysian Ringgit (MYK)",
      countriesUsedCurrency: ["Malaysia"],
    },
    {
      value: "MXN",
      label: "Mexican Peso (MXN)",
      countriesUsedCurrency: ["Mexico"],
    },

    {
      value: "NGN",
      label: "Nigerian Naira (NGN)",
      countriesUsedCurrency: ["Nigeria"],
    },
    {
      value: "NOK",
      label: "Norwegian Krone (NOK)",
      countriesUsedCurrency: ["Norway"],
    },
    {
      value: "NPR",
      label: "Nepalese Rupee (NPR)",
      countriesUsedCurrency: ["Nepal"],
    },
    {
      value: "NZD",
      label: "New Zealand Dollar (NZD)",
      countriesUsedCurrency: ["New Zealand"],
    },
    {
      value: "PEN",
      label: "Peruvian Nuevo Sol (PEN)",
      countriesUsedCurrency: ["Peru"],
    },
    {
      value: "PKR",
      label: "Pakistani Rupee (PKR)",
      countriesUsedCurrency: ["Pakistan"],
    },
    {
      value: "RUB",
      label: "Russian Ruble (RUB)",
      countriesUsedCurrency: ["Russian Federation"],
    },
    {
      value: "SEK",
      label: "Swedish Krona (SEK)",
      countriesUsedCurrency: ["Sweden"],
    },
    {
      value: "THB",
      label: "Thai Baht (THB)",
      countriesUsedCurrency: ["Thailand"],
    },
    {
      value: "TRY",
      label: "Turkish Lira (TRY)",
      countriesUsedCurrency: ["Turkey"],
    },
    {
      value: "UCC",
      label: "Ukrainian Hryvnia (UCC)",
      countriesUsedCurrency: ["Ukraine"],
    },
    {
      value: "VES",
      label: "Venezuelan Bolívar (VES)",
      countriesUsedCurrency: ["Venezuela"],
    },
    {
      value: "PGK",
      label: "Papua New Guinean Kina (PGK)",
      countriesUsedCurrency: ["Papua New Guinea"],
    },
    {
      value: "PYG",
      label: "Paraguayan Guarani (PYG)",
      countriesUsedCurrency: ["Paraguay"],
    },
    {
      value: "PHP",
      label: "Philippine Peso (PHP)",
      countriesUsedCurrency: ["Philippines"],
    },
    {
      value: "PLN",
      label: "Polish Złoty (PLN)",
      countriesUsedCurrency: ["Poland"],
    },
    {
      value: "QAR",
      label: "Qatari Riyal (QAR)",
      countriesUsedCurrency: ["Qatar"],
    },
    {
      value: "RON",
      label: "Romanian Leu (RON)",
      countriesUsedCurrency: ["Romania"],
    },
    {
      value: "RWF",
      label: "Rwandan Franc (RWF)",
      countriesUsedCurrency: ["Rwanda"],
    },

    {
      value: "WST",
      label: "Samoan Tala (WST)",
      countriesUsedCurrency: ["Samoa"],
    },

    {
      value: "STN",
      label: "São Tomé & Príncipe Dobra (STN)",
      countriesUsedCurrency: ["Sao Tome & Principe"],
    },
    {
      value: "SAR",
      label: "Saudi Riyal (SAR)",
      countriesUsedCurrency: ["Saudi Arabia"],
    },
    {
      value: "RSD",
      label: "Serbian Dinar (RSD)",
      countriesUsedCurrency: ["Serbia"],
    },
    {
      value: "SCR",
      label: "Seychellois Rupee (SCR)",
      countriesUsedCurrency: ["Seychelles"],
    },
    {
      value: "SLL",
      label: "Sierra Leonean Leone (SLL)",
      countriesUsedCurrency: ["Sierra Leone"],
    },
    {
      value: "VND",
      label: "Vietnamese Dong (VND)",
      countriesUsedCurrency: ["Vietnam"],
    },
    {
      value: "VNO",
      label: "Vanuatu Vatu (VNO)",
      countriesUsedCurrency: ["Vanuatu"],
    },
    {
      value: "SGD",
      label: "Singapore Dollar (SGD)",
      countriesUsedCurrency: ["Singapore"],
    },
    {
      value: "SBD",
      label: "Solomon Islands Dollar (SBD)",
      countriesUsedCurrency: ["Solomon Islands"],
    },
    {
      value: "SOS",
      label: "Somali Shilling (SOS)",
      countriesUsedCurrency: ["Somalia"],
    },
    {
      value: "SSP",
      label: "South Sudanese Pound (SSP)",
      countriesUsedCurrency: ["South Sudan"],
    },
    {
      value: "SDG",
      label: "Sudanese Pound (SDG)",
      countriesUsedCurrency: ["Sudan"],
    },
    {
      value: "SRD",
      label: "Surinamese Dollar (SRD)",
      countriesUsedCurrency: ["Suriname"],
    },
    {
      value: "SZL",
      label: "Swazi Lilangeni (SZL)",
      countriesUsedCurrency: ["Swaziland"],
    },
    {
      value: "SYP",
      label: "Syrian Pound (SYP)",
      countriesUsedCurrency: ["Syria"],
    },
    {
      value: "TWD",
      label: "New Taiwan Dollar (TWD)",
      countriesUsedCurrency: ["Taiwan"],
    },
    {
      value: "TJS",
      label: "Tajikistani Somoni (TJS)",
      countriesUsedCurrency: ["Tajikistan"],
    },
    {
      value: "TZS",
      label: "Tanzanian Shilling (TZS)",
      countriesUsedCurrency: ["Tanzania"],
    },
    {
      value: "USD",
      label: "United States Dollar (USD)",
      countriesUsedCurrency: ["United States", "Ecuador", "El Salvador", "Panama", "Puerto Rico", "Guam", "Northern Mariana Islands", "American Samoa", "U.S. Virgin Islands"],
    },    
    {
      value: "TOP",
      label: "Tongan Pa'anga (TOP)",
      countriesUsedCurrency: ["Tonga"],
    },
    {
      value: "TTD",
      label: "Trinidad and Tobago Dollar (TTD)",
      countriesUsedCurrency: ["Trinidad & Tobago"],
    },
    {
      value: "TND",
      label: "Tunisian Dinar (TND)",
      countriesUsedCurrency: ["Tunisia"],
    },
    {
      value: "TMT",
      label: "Turkmenistani Manat (TMT)",
      countriesUsedCurrency: ["Turkmenistan"],
    },

    {
      value: "UGX",
      label: "Ugandan Shilling (UGX)",
      countriesUsedCurrency: ["Uganda"],
    },
    {
      value: "UYU",
      label: "Uruguayan Peso (UYU)",
      countriesUsedCurrency: ["Uruguay"],
    },
    {
      value: "UZS",
      label: "Uzbekistani Som (UZS)",
      countriesUsedCurrency: ["Uzbekistan"],
    },

    {
      value: "YER",
      label: "Yemeni Rial (YER)",
      countriesUsedCurrency: ["Yemen"],
    },
    {
      value: "ZMW",
      label: "Zambian Kwacha (ZMW)",
      countriesUsedCurrency: ["Zambia"],
    },
    {
      value: "ZWL",
      label: "Zimbabwean Dollar (ZWL)",
      countriesUsedCurrency: ["Zimbabwe"],
    },
    {
      value: "ZAR",
      label: "South African Rand (ZAR)",
      countriesUsedCurrency: ["South Africa"],
    },
  ];


  const messageTemplates=[
    { id: 1, category: "Payment", title: "Deposit Confirmation", content: "Hello [username], your deposit of $[amount] has been successfully credited to your account. Thank you for choosing us!" },
    { id: 2, category: "Promotions", title: "Exclusive Bonus Offer", content: "Hi [username], claim your exclusive bonus of $[bonus_amount] on your next deposit. Offer valid until [date]. Don’t miss out!" },
    { id: 3, category: "Security", title: "Account Activity Alert", content: "Dear [username], we noticed a login attempt on your account from a new device on [date]. If this wasn't you, please reset your password immediately." },
    { id: 4, category: "Announcements", title: "Game Release Alert", content: "Exciting news! [game_name] is now live on our platform. Be among the first to play and win big!" },
    { id: 5, category: "Sports", title: "Upcoming Match Alert", content: "Hi [username], the match between [team1] and [team2] starts at [time]. Place your bets now and enjoy the game!" },
    { id: 6, category: "Tips & Tricks", title: "Boost Your Winning Chances", content: "Hello [username], check out our latest tips and strategies to maximize your chances of winning. Visit [website] for details." },
    { id: 7, category: "Payment", title: "Withdrawal Confirmation", content: "Dear [username], your withdrawal of $[amount] has been successfully processed. Thank you for your transaction!" },
    { id: 8, category: "Promotions", title: "Limited Time Offer", content: "Hi [username], don't miss out on our limited-time offer! Get [discount]% off on your next deposit. Offer ends on [date]." },
    { id: 9, category: "Security", title: "Password Reset Request", content: "Hello [username], we received a request to reset your password. Click the link below to reset your password." },
    { id: 10, category: "Announcements", title: "Maintenance Notice", content: "Dear [username], we will be performing scheduled maintenance on our platform from [start_time] to [end_time]. Please plan accordingly." },
    { id: 11, category: "Sports", title: "Live Match Updates", content: "Hello [username], the match between [team1] and [team2] is live! Follow the action and place your bets now!" },
    { id: 12, category: "Tips & Tricks", title: "Maximize Your Winnings", content: "Hi [username], check out these expert tips to maximize your winnings in [game_name]. Good luck!" },
    { id: 13, category: "Payment", title: "Payment Failure", content: "Dear [username], we encountered an issue with processing your payment of $[amount]. Please try again or contact support." },
    { id: 14, category: "Promotions", title: "Special Bonus Alert", content: "Hey [username], enjoy an extra $[bonus_amount] as a bonus on your next deposit. Don’t miss this exclusive offer!" },
    { id: 15, category: "Security", title: "Two-Factor Authentication Setup", content: "Hi [username], for enhanced security, we recommend setting up two-factor authentication on your account. Click here to enable." },
    { id: 16, category: "Announcements", title: "New Feature Release", content: "Exciting news, [username]! We’ve just launched a new feature: [feature_name]. Explore it today!" },
    { id: 17, category: "Sports", title: "Betting Odds Update", content: "Hi [username], the odds for the match between [team1] and [team2] have changed. Check the updated odds before placing your bet!" },
    { id: 18, category: "Tips & Tricks", title: "Game Strategy Guide", content: "Hello [username], here’s a strategy guide to help you improve your performance in [game_name]. Good luck!" },
    { id: 19, category: "Payment", title: "Payment Confirmation", content: "Hello [username], your payment of $[amount] has been successfully received. Thank you for using our platform!" },
    { id: 20, category: "Promotions", title: "Refer a Friend", content: "Hi [username], refer a friend to our platform and earn a reward of $[reward_amount] when they make their first deposit!" },
    { id: 21, category: "Security", title: "Account Suspended", content: "Dear [username], we have temporarily suspended your account due to suspicious activity. Please contact support for more details." },
    { id: 22, category: "Announcements", title: "Seasonal Sale", content: "Hi [username], our seasonal sale is live! Get up to [discount]% off on all [products/services]. Shop now!" },
    { id: 23, category: "Sports", title: "Upcoming Tournament", content: "Dear [username], get ready for the upcoming tournament between [team1] and [team2]. Registration is now open!" },
    { id: 24, category: "Tips & Tricks", title: "Maximize Deposit Rewards", content: "Hello [username], take advantage of our deposit rewards by following these tips and strategies." },
    { id: 25, category: "Payment", title: "Refund Processed", content: "Dear [username], we’ve successfully processed a refund of $[amount] for your recent transaction." },
    { id: 26, category: "Promotions", title: "Early Bird Offer", content: "Hi [username], enjoy a special early bird discount of [discount]% when you make a deposit today!" },
    { id: 27, category: "Security", title: "Suspicious Login Alert", content: "Dear [username], we noticed a suspicious login attempt from [location] on [date]. If this wasn’t you, please change your password immediately." },
    { id: 28, category: "Announcements", title: "New Payment Method", content: "Hi [username], we’ve added a new payment method to our platform: [payment_method]. Enjoy more convenient transactions!" },
    { id: 29, category: "Sports", title: "Special Betting Offer", content: "Hello [username], get a free bet worth $[amount] on your next bet placed on [event_name]!" },
    { id: 30, category: "Tips & Tricks", title: "How to Play [Game Name]", content: "Hi [username], here’s a guide to help you get started with [game_name]. Improve your gameplay today!" },
    { id: 31, category: "Payment", title: "Payment Pending", content: "Dear [username], your payment of $[amount] is currently pending. Please check back later for updates." },
    { id: 32, category: "Promotions", title: "VIP Offer", content: "Hi [username], as a VIP member, enjoy exclusive rewards and offers. Check out your personalized VIP dashboard now!" },
    { id: 33, category: "Security", title: "Unusual Account Activity", content: "Dear [username], we noticed some unusual activity on your account. Please review your recent transactions and contact us if you believe your account has been compromised." },
    { id: 34, category: "Announcements", title: "Event Reminder", content: "Hey [username], don’t forget about the [event_name] happening on [date]. Mark your calendar and join us!" },
    { id: 35, category: "Sports", title: "Betting Tips", content: "Hi [username], here are some tips to improve your chances of winning on [game_name] bets." },
    { id: 36, category: "Tips & Tricks", title: "How to Win Big", content: "Hi [username], follow these expert tips to maximize your chances of winning big on [game_name]." },
    { id: 37, category: "Payment", title: "Deposit Reversal", content: "Dear [username], your recent deposit of $[amount] was reversed. Please check your account for more details." },
    { id: 38, category: "Promotions", title: "Weekend Special", content: "Hi [username], enjoy a special [discount]% off all deposits made this weekend. Don’t miss out!" },
    { id: 39, category: "Security", title: "Account Recovery Instructions", content: "Hello [username], if you’re having trouble accessing your account, follow these recovery instructions to regain access." },
    { id: 40, category: "Announcements", title: "Exclusive Event", content: "Dear [username], you’re invited to an exclusive event on [date]. RSVP now to secure your spot!" },
  ];
    
  const currencyOptions = currencyData.sort((a, b) => a.label.localeCompare(b.label));
  export {FindGameTypeIdByName,formatBonusText, getGameProvider,formatDate,formatDateTime,convertToUniversalTime,checkPermission,parseData, currencyOptions, messageTemplates}
