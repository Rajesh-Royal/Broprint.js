import { cyrb53 } from "./code/EncryptDecrypt";
import { getCanvasFingerprint } from "./code/GenerateCanvasFingerprint";
import { generateTheAudioFingerPrint } from "./code/generateTheAudioPrints";



/**
 * This functions working
 * @Param {null}
 * @return {Promise<string>} - resolve(string)
 */
export const getCurrentBrowserFingerPrint = (): Promise<string> => {

    /**
     * @return {Promise} - a frequency number 120.256896523
     * @reference - https://fingerprintjs.com/blog/audio-fingerprinting/
     */
    const getTheAudioPrints = new Promise((resolve, reject) => {
        generateTheAudioFingerPrint.run(function (fingerprint: any) {
            resolve(fingerprint);
        });
    });

    /**
     * 
     * @param {null}
     * @return {Promise<string>} - and sha512 hashed string
     */
    const DevicePrints: Promise<string> = new Promise((resolve, reject) => {
        getTheAudioPrints.then((audioChannelResult) => {

            let fingerprint = window.btoa(audioChannelResult as string) + getCanvasFingerprint()
            // using btoa to hash the values to looks better readable
            resolve(cyrb53(fingerprint, 0) as unknown as string);
        }).catch(() => {
            try {
                // if failed with audio fingerprint then resolve only with canvas fingerprint
                resolve(cyrb53(getCanvasFingerprint()).toString());
            } catch (error) {
                reject("Failed to generate the finger print of this browser");
            }
        })
    });
    return DevicePrints;
};