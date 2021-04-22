"use strict";

// javascript
var wdio = require("webdriverio");

var fs = require('fs');

var path = require('path');

function sleep(n) {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, n);
}

console.log(__dirname);
var MyInfinixPhone = {
  path: '/wd/hub',
  port: 4723,
  capabilities: {
    platformName: "Android",
    platformVersion: "9",
    deviceName: "Infinix S5",
    noReset: 'true',
    // app: "Chrome",
    appPackage: "com.whatsapp",
    appActivity: "com.whatsapp.HomeActivity",
    automationName: "UiAutomator2"
  }
};

function start(opts, folder) {
  var client, msg_path, path_to_phone, path_sender_txt, path_dont_send_txt, pause_secs, msg, lineReader, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _loop, _iterator, _step;

  return regeneratorRuntime.async(function start$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return regeneratorRuntime.awrap(wdio.remote(opts));

        case 2:
          client = _context2.sent;

          if (!folder) {
            try {
              folder = opts.capabilities.deviceName;
            } catch (Error) {
              folder = 'main';
            }
          } // 


          if (!fs.existsSync(path.join(__dirname, folder))) {
            fs.mkdirSync(path.join(__dirname, folder));
          }

          msg_path = path.join(__dirname, folder, 'msg.txt');
          path_to_phone = path.join(__dirname, folder, 'phones.txt');
          path_sender_txt = path.join(__dirname, folder, 'sender.txt');
          path_dont_send_txt = path.join(__dirname, folder, 'dont_send.txt');

          if (!fs.existsSync(msg_path)) {
            console.log('yes!!!');
            msg_path = path.join(__dirname, 'msg.txt');
          }

          if (!fs.existsSync(path_to_phone)) {
            // get default
            path_to_phone = path.join(__dirname, 'phones.txt');
          } // if(!fs.existsSync(path_sender_txt)) {
          //     // get default
          //     fs.writeFileSync(path_sender_txt, '', 'utf8')
          // }
          // if(!fs.existsSync(path_dont_send_txt)) {
          //     // get default
          //     fs.writeFileSync(path_dont_send_txt, '', 'utf8')
          // }


          pause_secs = 10000;
          msg = fs.readFileSync(msg_path, 'utf8');
          lineReader = fs.readFileSync(path_to_phone, 'utf8').toString().split('\n').filter(Boolean);
          _iteratorNormalCompletion = true;
          _didIteratorError = false;
          _iteratorError = undefined;
          _context2.prev = 17;

          _loop = function _loop() {
            var line, field;
            return regeneratorRuntime.async(function _loop$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    line = _step.value;
                    _context.prev = 1;
                    client.url("https://wa.me/".concat(line.replace('+', '')));
                    _context.next = 5;
                    return regeneratorRuntime.awrap(client.$("android.widget.EditText"));

                  case 5:
                    field = _context.sent;
                    _context.next = 8;
                    return regeneratorRuntime.awrap(field.setValue("".concat(msg.toString())));

                  case 8:
                    client.keys(['Tab']);
                    client.keys(['Tab']);
                    _context.next = 12;
                    return regeneratorRuntime.awrap(client.keys(['Enter'])["finally"](function () {
                      // console.log('Reached here...')
                      //  append to find
                      console.log('appending ' + line.replace('+', '') + ' to sender');
                      fs.appendFileSync(path_sender_txt, line.replace('+', '') + '\n');
                      sleep(pause_secs);
                    }));

                  case 12:
                    _context.next = 17;
                    break;

                  case 14:
                    _context.prev = 14;
                    _context.t0 = _context["catch"](1);

                    if (_context.t0.toString().match('android.widget.EditText')) {
                      // this is as a result of number is not found
                      console.log('Number is not found');
                      fs.appendFileSync(path_dont_send_txt, line.replace('+', '') + '\n'); // cancel the notice
                      // client.keys(['Tab'])

                      client.keys(['Enter']);
                    }

                  case 17:
                  case "end":
                    return _context.stop();
                }
              }
            }, null, null, [[1, 14]]);
          };

          _iterator = lineReader[Symbol.iterator]();

        case 20:
          if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
            _context2.next = 26;
            break;
          }

          _context2.next = 23;
          return regeneratorRuntime.awrap(_loop());

        case 23:
          _iteratorNormalCompletion = true;
          _context2.next = 20;
          break;

        case 26:
          _context2.next = 32;
          break;

        case 28:
          _context2.prev = 28;
          _context2.t0 = _context2["catch"](17);
          _didIteratorError = true;
          _iteratorError = _context2.t0;

        case 32:
          _context2.prev = 32;
          _context2.prev = 33;

          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }

        case 35:
          _context2.prev = 35;

          if (!_didIteratorError) {
            _context2.next = 38;
            break;
          }

          throw _iteratorError;

        case 38:
          return _context2.finish(35);

        case 39:
          return _context2.finish(32);

        case 40:
          _context2.next = 42;
          return regeneratorRuntime.awrap(client.deleteSession());

        case 42:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[17, 28, 32, 40], [33,, 35, 39]]);
}

start(MyInfinixPhone); // start(MyInfinixPhone);