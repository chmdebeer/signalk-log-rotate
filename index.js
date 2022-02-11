const fs = require('fs');
const cron = require('node-cron');

const logFolder = '../temp';

module.exports = function (app) {

  let checkLogFiles = function() {
    fs.readdir(logFolder, (err, files) => {
      let todayDate = new Date().toISOString();
      todayDate = todayDate.substring(0, 10);

      files.forEach(file => {
        // app.debug(file);
        if ( file.startsWith('skserver-raw_') ) {
          let logDate = file.substring(13, 23) ;
          if (logDate < todayDate) {
            app.debug('Removing ' + file);
            // fs.unlink(file, (err) => {
            //   console.log(err);
            //   //file removed
            // });
          }
        }


      });
    });
  }

  let _start = function(options) {
    app.debug(`${plugin.name} Started...`)

    console.log(app.config);
    console.log(app.env);

    cron.schedule('0 0 * * * *', () => {
      checkLogFiles();
    });
    checkLogFiles();
  }

  let _stop = function(options) {
    app.debug(`${plugin.name} Stopped...`)
  }

  const plugin = {
    id: 'signalk-log-rotate',
    name: 'Log Rotate',
    description: 'A Signalk plugin to rotate data source logs',

    schema: {
      type: 'object',
      required: ['saveFreq'],
      properties: {
        checkFreq: {
          type: 'number',
          title: 'How often to check log files',
          default: 15000
        }
      }
    },


    start: _start,
    stop: _stop
  }


return plugin;

}
