import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.decomposition import TruncatedSVD

from nltk.tokenize import sent_tokenize, word_tokenize 
from nltk.corpus import stopwords

from sklearn.decomposition import TruncatedSVD

import sys
# import nltk
# nltk.download('punkt')

# text pre-processing
def preprocessing(data):
  text = sent_tokenize(data)
  df = pd.DataFrame(text, columns=['sent'])

  stop = stopwords.words('english')
  df['sent'] = df['sent'].apply(lambda x: ' '.join([word for word in x.split() if word not in (stop)]))
  return text, df



# summarisation function
def summary(text, df) :
  vectorizer = TfidfVectorizer(max_df = 0.5, min_df = 2, smooth_idf = True)
  vectorizer.fit(df['sent'])
  vector = vectorizer.transform(df['sent'])
  tfidf = vector.toarray()
  tfidf = tfidf.T

  svd_model = TruncatedSVD(n_components = -(-len(text)//2),algorithm='randomized', n_iter=10, random_state=22)
  svd_model.fit(tfidf)
  svc = svd_model.components_
  svc = svc.tolist()

  summary = ''
  p_pos = 0
  for _ in range(len(svc)):
    m = max(svc[_])
    # print(m)
    pos = svc[_].index(m)
    # print(pos)
    # print(text[pos])
    if pos > p_pos:
      summary = summary + ' ' + text[pos]
    else:
      summary = text[pos] + ' ' + summary  
    p_pos = pos
  return summary


data = sys.argv[1]
data = data.replace('\n', ' ')

text,df = preprocessing(data)
summary = summary(text, df)

print(data + '\n' + summary)