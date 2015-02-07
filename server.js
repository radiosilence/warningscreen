import express from 'express';
import serveStatic from 'serve-static';
import request from 'request';

var DEVICES = [];


var updateDevices = () => {
  request.get('http://10.10.10.1/update_clients.asp', {
    auth: {user: 'admin', password: 'moose2000'}
  }, (error, res, body) => {
    var originDataTmp, originData, networkmap_fullscan;
    var genClientList = () => {};
    eval(body);
    DEVICES = originData.fromNetworkmapd
      .filter(line => line.length > 0)
      .map(line => ({
        iface: line.split('>')[0],
        name: line.split('>')[1],
        ipv4: line.split('>')[2],
        mac: line.split('>')[3],
      }));
  });
}

setInterval(updateDevices, 2000);
updateDevices();

var app = express();
app.get('/api/status', (req, res) => {
  res.type('application/json');
  res.send(JSON.stringify({
    devices: DEVICES
  }, null, 2));
});

app.use(serveStatic('.', {'index': ['index.html']}));

var server = app.listen(3000, () => {
  var host = server.address().address
  var port = server.address().port
  console.log(`Example app listening at http://${host}:${port}`);
});