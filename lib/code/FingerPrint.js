"use strict";
// this file is a driver file for testing in local
// this will not be used for npm build
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDeviceId = void 0;
/* eslint-disable no-fallthrough */
const EncryptDecrypt_1 = require("./EncryptDecrypt");
const GenerateCanvasFingerprint_1 = require("./GenerateCanvasFingerprint");
const generateTheAudioPrints_1 = require("./generateTheAudioPrints");
/**
 * This functions working
 * @Param {null}
 * @return {Promise<string>} - resolve(string)
 */
const getDeviceId = () => {
    /**
     * @return {Promise} - a frequency number 120.256896523
     * @reference - https://fingerprintjs.com/blog/audio-fingerprinting/
     */
    const getTheAudioPrints = new Promise((resolve, reject) => {
        generateTheAudioPrints_1.generateTheAudioFingerPrint.run(function (fingerprint) {
            resolve(fingerprint);
        });
    });
    /**
     *
     * @param {null}
     * @return {Promise<string>} - and sha512 hashed string
     */
    const DevicePrints = new Promise((resolve, reject) => {
        getTheAudioPrints.then((audioChannelResult) => {
            let fingerprint = window.btoa(audioChannelResult) + (0, GenerateCanvasFingerprint_1.getCanvasFingerprint)();
            // using btoa to hash the values to looks better readable
            resolve((0, EncryptDecrypt_1.cyrb53)(fingerprint, 0));
        }).catch(() => {
            try {
                // if failed with audio fingerprint then resolve only with canvas fingerprint
                resolve((0, EncryptDecrypt_1.cyrb53)((0, GenerateCanvasFingerprint_1.getCanvasFingerprint)()).toString());
            }
            catch (error) {
                reject("Failed to generate the finger print of this browser");
            }
        });
    });
    return DevicePrints;
};
exports.getDeviceId = getDeviceId;
