#!/bin/bash

export DEBIAN_FRONTEND=noninteractive
apt-get update
apt-get install -y python-software-properties npm

# Nodejs
wget http://nodejs.org/dist/v0.10.26/node-v0.10.26-linux-x64.tar.gz
tar xzvf node-v0.10.26-linux-x64.tar.gz
mv node-v0.10.26-linux-x64 /opt/node
echo 'PATH="$PATH:/opt/node/bin"' > /etc/profile.d/nodepath.sh
echo 'export PATH' >> /etc/profile.d/nodepath.sh
source /etc/profile.d/nodepath.sh

chmod a+x /vagrant/webserver.sh
ln -s /vagrant/webserver.sh /etc/init.d/webserver
update-rc.d webserver defaults
service webserver start


cd /vagrant
npm config set registry http://registry.npmjs.org/
sudo apt-get -y install gcc make build-essential
sudo add-apt-repository -y ppa:chris-lea/node.js
sudo apt-get update
sudo apt-get -y install nodejs
sudo npm install
sudo npm update
sudo npm install -g forever

echo app is running on localhost:55657