const runIt = require("child_process");
const {
    Console
} = require("console");
const fs = require('fs');
const path = require('path');



let staticSrc = "_src/email_markup/static_markup/";
let staticDist = "_dist/email_static/";

let command = "npx mjml " + staticSrc + "*" + " -o " + staticDist;


let markupify = () => {
    return new Promise(function (resolve, reject) {
        setTimeout(() => {

            runIt.execSync(command, (error, stdout, stderr) => {
                if (error) {
                    console.log(`error: ${error.message}`);
                    return;
                }
                if (stderr) {
                    console.log(`stderr: ${stderr}`);
                    return;
                }
                console.log(`stdout: ${stdout}`);

                console.log("MJML executed");

            });
            resolve();
            console.log("Statics are Markup-i-fied");
        }, 3000);

    });

};




let hubify = () => {
    fs.readdir(staticDist, (err, files) => {
        if (err) {
            console.error("Could not list static HTML files", err);
            process.exit(1);
        }
        files.forEach(file => {
            fs.readFile(staticDist + file, 'utf8', (err, data) => {
                if (err) throw err;
                let check = "<!-- begin module -->";
                if(data.includes(check)){
                    let search = /(?:<!-- begin module -->)([\s\S]*?)(?:<!-- end module -->)/g;
                    let inner = data.match(search).join('\n');
                    fs.writeFile(staticDist + file, inner, 'utf8', (err, data) => {
                        if (err) throw err;
                        console.log("The " + path.parse(file).name + " static markup is updated");
                    });
                } else {
                    console.log(file + " doesn't need hubifying")
                }
            });
        })
    });
}

markupify().then(hubify);
