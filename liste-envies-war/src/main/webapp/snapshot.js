/**
 * Module to manage the snapshot flag
 *
 * @author Julien Roche
 * @version 1.0.0
 * @since 1.0.0
 */

'use strict';

// Imports
const exec = require('child_process').exec;
const flag = process.argv[2];

// Constants & variables
const SNAPSHOT_FLAG = '-SNAPSHOT';
const REMOVEFLAG = '--remove';

let packageContent = require('./package.json');
let packageVersion = packageContent.version;

// Private functions
function promisedExec(command) {
    return new Promise(function (resolve, reject) {
        exec(command, (error) => {
            if (error) {
                reject(error);

            } else {
                resolve();
            }
        });
    });
}

// Deal with the snapshot flag
if (flag === REMOVEFLAG) {
    // Shall remove the flag
    packageVersion = packageVersion.replace(SNAPSHOT_FLAG, '');
    console.log('We remove the snapshot flag:', packageVersion);

    // Create a Git commit and tag with version !
    promisedExec(`npm --no-git-tag-version version ${packageVersion}`)
        .then(function () {
            return promisedExec(`git commit --all --message "Release version: ${packageVersion}"`);
        })
        .then(function () {
            return promisedExec(`git tag "v${packageVersion}"`);
        })
        .then(function () {
            return promisedExec(`git push && git push --tags`);
        })
        .catch(function (err) {
            console.error('An error occured:', err);
            process.exit(1);
        });

} else {
    if (packageVersion.indexOf(SNAPSHOT_FLAG)) {
        // Should remove this flag
        packageVersion = packageVersion.replace(SNAPSHOT_FLAG, '');
    }

    // Get the package version with the flag
    packageVersion += SNAPSHOT_FLAG;

    console.log('We add the snapshot flag:', packageVersion);

    // Create a Git commit with version ! But not a Git tag !
    promisedExec(`npm --no-git-tag-version version ${packageVersion}`)
        .then(function () {
            return promisedExec(`git commit --all --message "Upgrade to snapshot version: ${packageVersion}"`);
        })
        .then(function () {
            return promisedExec(`git push`);
        })
        .catch(function (err) {
            console.error('An error occured:', err);
            process.exit(1);
        });
}

