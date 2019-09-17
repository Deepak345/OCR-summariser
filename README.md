# OCR-summariser

## Getting Started

Git clone or download this Project as zip. <br>
 Execute the following commands in the base directory:-

### Prerequisites for node server

* install nodejs
* install mongodb
* install tesseract
### Installing tesseract in Ubuntu
```
sudo apt-get install tesseract-ocr
```
### Installing tesseract in Windows 

## [Tesseract](https://github.com/UB-Mannheim/tesseract/wiki)

* install nodemon
```
npm i -g --save nodemon
``` 
* import the node modules
```
npm install
```

### Prerequisites for summarisation

* install python3
* install pip3
* install virtualenv using pip
```
pip3 install virtualenv 
```
* Create a Virtual environment, install depedencies in the base directory of the project:-
```
virtualenv venv
source venv/bin/activate(for ubuntu)
venv/Scripts/activate(for windows)
pip install -r requirements.txt
python -m nltk.downloader punkt
deactivate
```
The above steps are needed to be performed only the first time.


## Running the Program

```
source venv/bin/activate
nodemon app
```

When it shows The app in running in port 8000
Open your browser and goto
```
localhost:8000
```
Later, the virtual environment can be deactivated when the work with project is over:-
```
deactivate
```


## Built With

* [Nodejs](https://nodejs.org/en/docs/) - The web framework used
* [Expressjs](https://expressjs.com/en/api.html) - Used for the backend servers
* [Mongodb](https://docs.mongodb.com/) - Database used
* [Javascript](https://devdocs.io/javascript/) - used for scripting
* [ejs](http://ejs.co/) - It is the templating lirary used
* [CSS](https://developer.mozilla.org/en-US/docs/Learn/CSS/Introduction_to_CSS) - It is used for styling purpose


## Authors

* **Abinash Panda** - Backend Developer(https://github.com/abinashp437)
* **Siddhant Mund** - Backend Developer(https://github.com/iamsid2)
* **Deepak Senapati** - Data Analyst(https://github.com/deepak345)

