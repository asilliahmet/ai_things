basic mnist reader.
TODOS: 
- complete workflow (design & devops included)
    - implement the designed frontend
    - release in aws
- clean up the code

for server:
cd server
source ./bin/activate
pip install
python server.py

for training:
cd server
source ./bin/activate
pip install
python main.py

for acquiring the mnist dataset:
cd server 
source ./bin/activate
pip install
python writedataset.py

for consumer
cd consumer
npm install
npm start

consumer-side change model server host:
code consumer/public/index.html
change window.kerasLocation
