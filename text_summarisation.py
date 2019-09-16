from sumy.utils import get_stop_words
from sumy.nlp.stemmers import Stemmer
from sumy.parsers.plaintext import PlaintextParser
from sumy.nlp.tokenizers import Tokenizer as sumytoken
from sumy.summarizers.lex_rank import LexRankSummarizer
from sumy.utils import get_stop_words
from sumy.nlp.stemmers import Stemmer
from sumy.parsers.plaintext import PlaintextParser
from sumy.nlp.tokenizers import Tokenizer as sumytoken

from sumy.nlp.stemmers import Stemmer

from sumy.summarizers.luhn import LuhnSummarizer

import sys


LANGUAGE = "english"
SENTENCES_COUNT = 2
stemmer = Stemmer(LANGUAGE)
text = sys.argv[1] 

def luhn_summarizer(text, stemmer, LANGUAGE, SENTENCES_COUNT):
    parser = PlaintextParser.from_string(text, sumytoken(LANGUAGE))
    summarizer_luhn = LuhnSummarizer(stemmer)
    summarizer_luhn.stop_words = get_stop_words(LANGUAGE)
    sentences = []
    for sentence in summarizer_luhn(parser.document, SENTENCES_COUNT):
        a = sentence
        sentences.append(str(a))
    return " ".join(sentences)



print(luhn_summarizer(text, stemmer, LANGUAGE, SENTENCES_COUNT))