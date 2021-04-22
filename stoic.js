// javascript

const wdio = require("webdriverio");
const fs = require('fs')
const path = require('path')

function sleep(n) {
    Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, n);
}

console.log(__dirname)


const MyInfinixPhone = {
    path: '/wd/hub',
    port: 4723,
    capabilities: {
        platformName: "Android",
        platformVersion: "9",
        deviceName: "Infinix S5",
        noReset: 'true',
        app: "/home/olami/Documents/base.apk",
        appPackage: "com.cindicator.stoic_android",
        appActivity: "com.cindicator.stoic_android.view.SplashScreen",
        automationName: "UiAutomator2",
    }
};

async function start(opts, folder) {
    const client = await wdio.remote(opts);

    if(!folder) {
        try{
        folder = opts.capabilities.deviceName
        } catch(Error) {
            folder = 'main'
        }
    }

    // 
    if(!fs.existsSync(path.join(__dirname, folder))) {
        fs.mkdirSync(path.join(__dirname, folder))


    }

    let msg_path = path.join(__dirname, folder, 'msg.txt')

    let path_to_phone = path.join(__dirname, folder, 'phones.txt')
    let path_sender_txt = path.join(__dirname, folder, 'sender.txt')
    let path_dont_send_txt = path.join(__dirname, folder, 'dont_send.txt');

    if(!fs.existsSync(msg_path)) {
        msg_path = path.join(__dirname, 'msg.txt');
    }

    if(!fs.existsSync(path_to_phone)) {
        // get default
        path_to_phone = path.join(__dirname, 'phones.txt');
    }

    // if(!fs.existsSync(path_sender_txt)) {
    //     // get default
    //     fs.writeFileSync(path_sender_txt, '', 'utf8')
    // }

    // if(!fs.existsSync(path_dont_send_txt)) {
    //     // get default
    //     fs.writeFileSync(path_dont_send_txt, '', 'utf8')
    // }

    const pause_secs = 10000;

    let msg = fs.readFileSync(msg_path, 'utf8')


    let lineReader = fs.readFileSync(path_to_phone, 'utf8').toString().split('\n').filter(Boolean);

    for (let line of lineReader) {

        try {

            client.keys(['Tab']);
            await client.keys(['Enter']);
            let emailField = await client.$("android.widget.EditText");
            await emailField.setValue(`${msg.toString()}`);
            client.keys(['Tab']);
            client.keys(['Tab']);
            client.keys(['Tab']);
            await client.keys(['Enter']);
            let amountField = await client.$("android.widget.EditText");
            await amountField.setValue(`1000`);
            client.keys(['Tab'])
            await client.keys(['Enter']).finally(() => {
                // console.log('Reached here...')

                //  append to find
                console.log('Clicking submitting')
                sleep(pause_secs)
            })
        } catch (Error) {
            if (Error.toString().match('android.widget.EditText')) {
                // this is as a result of number is not found
                console.log('Number is not found')
                fs.appendFileSync(path_dont_send_txt, line.replace('+', '') + '\n')

                // cancel the notice
                // client.keys(['Tab'])
                client.keys(['Enter'])
            }

        }
    }



    await client.deleteSession();
}

start(MyInfinixPhone);
// start(MyInfinixPhone);
