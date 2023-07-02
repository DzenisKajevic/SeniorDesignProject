In order to use Spotipy:
- Create a Spotify account
- Create a Spotify app
- Add the following to your environment variables:
    - SPOTIPY_CLIENT_ID
    - SPOTIPY_CLIENT_SECRET
    - SPOTIPY_REDIRECT_URI (?) (not sure if this is necessary)
- Install Spotipy: `pip install spotipy`
- Install the following dependencies: `pip install pandas numpy sklearn`
- deactivate the virtual environment
- Run `python3 main.py` to generate the data set
- Run `python3 train.py` to train the model



- set up virtual environment: 
 + cd ML
 + python -m venv env
- change executionPolicy to RemoteSigned to be able to access the virtual environment (windows):
 + open PowerShell as admin and run "Set-ExecutionPolicy RemoteSigned"
- !!!!!activate the virtual environment:
 + env/Scripts/activate.ps1  

<!-- NOT NEEDED, USE requirements.txt instead - Install pymongo[srv] for accessing the db:
 +python -m pip install "pymongo[srv]"
 -->

- install dependencies:
 + pip install -r requirements.txt

- upgrade dependencies (if needed): 
 + pip install --upgrade -r requirements.txt

(for me... save dependencies:
 + pip freeze > requirements.txt
)

- test running scripts:
 + python -i test.py 

- Deactivate the environment:
 + deactivate


- Useful for setting up VSC (not detecting venv): https://stackoverflow.com/questions/66869413/visual-studio-code-does-not-detect-virtual-environments