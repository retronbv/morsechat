import secrets
from app import app

def error(error, details="", code=200):
    return {
        "success": False,
        "error": error,
        "details": details
    }

def success(data):
    return {
        "success": True,
        "data": data
    }


def clearly_a_profanity(data):
    #TODO implement this in a separate package outside of this
    #repository. Not everything can be open source
    return False

def get_country_codes():
    # ISO 3166-1 alpha-2 country codes
    country_codes = [ "AF", "AL", "DZ", "AD", "AO", "AI", "AQ", "AG", "SA", "AR", "AM", "AW", "AU", "AT", "AZ", "BS", "BH", "BD", "BB", "BE", "BZ", "BJ", "BM", "BT", "BY", "MM", "BO", "BA", "BW", "BR", "BN", "BG", "BF", "BI", "KH", "CM", "CA", "CV", "TD", "CL", "CN", "CY", "VA", "CO", "KM", "KP", "KR", "CI", "CR", "HR", "CU", "CW", "DK", "DM", "EC", "EG", "SV", "AE", "ER", "EE", "ET", "FJ", "PH", "FI", "FR", "GA", "GM", "GE", "GS", "DE", "GH", "JM", "JP", "GI", "DJ", "JO", "GR", "GD", "GL", "GP", "GU", "GT", "GG", "GN", "GW", "GQ", "GY", "GF", "HT", "HN", "HK", "IN", "ID", "IR", "IQ", "IE", "IS", "BV", "IM", "CX", "NF", "AX", "BQ", "KY", "CC", "CK", "FO", "FK", "HM", "MP", "MH", "UM", "PN", "SB", "VG", "VI", "IL", "IT", "JE", "KZ", "KE", "KG", "KI", "KW", "LA", "LS", "LV", "LB", "LR", "LY", "LI", "LT", "LU", "MO", "MK", "MG", "MW", "MY", "MV", "ML", "MT", "MA", "MQ", "MR", "MU", "YT", "MX", "FM", "MD", "MN", "ME", "MS", "MZ", "NA", "NR", "NP", "NI", "NE", "NG", "NU", "NO", "NC", "NZ", "OM", "NL", "PK", "PW", "PS", "PA", "PG", "PY", "PE", "PF", "PL", "PR", "PT", "MC", "QA", "GB", "CD", "CZ", "CF", "CG", "DO", "RE", "RO", "RW", "RU", "EH", "KN", "LC", "SH", "VC", "BL", "MF", "PM", "WS", "AS", "SM", "ST", "SN", "RS", "SC", "SL", "SG", "SX", "SY", "SK", "SI", "SO", "ES", "LK", "US", "ZA", "SD", "SS", "SR", "SJ", "SE", "CH", "SZ", "TW", "TJ", "TZ", "TF", "IO", "TH", "TL", "TG", "TK", "TO", "TT", "TN", "TR", "TM", "TC", "TV", "UA", "UG", "HU", "UY", "UZ", "VU", "VE", "VN", "WF", "YE", "ZM", "ZW" ]
    return country_codes

def get_default_country_code():
    # Returns the United States country code, in the
    # ISO 3166-1 alpha-2 format
    return "US"

def negotiate_country(lang_header):
    # Parse the acceptLanguage header
    try:
        parsed = _parseAcceptLanguage(lang_header)
    except:
        return get_default_country_code()
    # validate the parsed data
    if len(parsed) == 0:
        return get_default_country_code()
    #sort the parsed data by weight
    parsed.sort(key=lambda tup: tup[1], reverse=True)
    #negotiate a country
    return _negotiate_country_from_langs_list(parsed)

def generate_anonymous_callsign(country):
    return country + secrets.token_hex(2).upper()


#https://github.com/siongui/userpages/blob/master/content/articles/2012/10/11/python-parse-accept-language-in-http-request-header%25en.rst
#https://siongui.github.io/2012/10/11/python-parse-accept-language-in-http-request-header/
# https://www.techonthenet.com/js/language_tags.php
def _parseAcceptLanguage(acceptLanguage):
    """
    Parses an accept-language header value
    Returns a list of tuples (lan, weight)
    """
    if len(acceptLanguage) < 2:
        raise Exception("invalid header data")
    languages = acceptLanguage.split(",")
    locale_q_pairs = []
    for language in languages:
        if language.split(";")[0] == language:
            # no q => q = 1
            locale_q_pairs.append((language.strip(), "1"))
        else:
            locale = language.split(";")[0].strip()
            q = language.split(";")[1].split("=")[1]
            locale_q_pairs.append((locale, q))
    return locale_q_pairs

def _negotiate_country_from_langs_list(parsedList):
    """
    Receives a list of language code tuples, sorted by preference.
    Returns the country code that could be best associated to one of
    the preferred languages, in order of preference.
    This is clearly a complicated task, that won't always be accurate
    """
    app.logger.info(parsedList)
    choosen = get_default_country_code()
    #iterate every language option
    for (lan, weight) in parsedList:
        app.logger.info(lan)
        # Preferred format:
        # xx-YY where YY is a region subtag, in iso 3166-1 format
        if len(lan) > 3 and lan[2] == "-":
            if lan[3:].upper() in get_country_codes():
                choosen = lan[3:].upper()
                break
        # least preferred format:
        # xx where xx is obviously not a region subtag, but matches a region subtag
        elif len(lan) == 2 and lan.upper() in get_country_codes():
            choosen = lan.upper()
            #don't break the loop, in the hope that there is a language option with
            #less weight that is expressed in the xx-YY format
    return choosen



