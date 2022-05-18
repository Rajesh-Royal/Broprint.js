// reference - biri on github

let _id = null;

const promises = [];

let connection;

function resolvePromises(value) {
  _id = value;
  promises.forEach(({ resolve }) => resolve(_id));
  promises.length = 0;
  connection.removeEventListener("icecandidate", onIceCandidate);
}

function rejectPromises() {
  promises.forEach(({ reject }) => reject("This browser is not supported, so WebRTC2 cannot provide a unique, static ID for this machine."));
  promises.length = 0;
}

function onIceCandidate({ candidate }) {
  if (connection.iceGatheringState === "complete" && _id == null) {
    connection = null;
    return rejectPromises();
  }

  if (!candidate) return;

  // For Chrome
  if (candidate.foundation) {
    return resolvePromises(candidate.foundation);
  }

  // For Safari
  if (candidate.candidate) {
    const matches = /^candidate:(\d+)\s/.exec(candidate.candidate);
    if (!matches || matches[1].length < 2) return;

    return resolvePromises(matches[1]);
  }
}

async function startConnection() {
  if (connection) return;

  connection = new RTCPeerConnection();

  // Required for Safari, causes an error on some other browsers.
  try {
    const stream = document.createElement("canvas").captureStream();
    stream.getTracks().forEach((track) => connection.addTrack(track));
  } catch (e) {}

  connection.addEventListener("icecandidate", onIceCandidate);

  const offer = await connection.createOffer({
    offerToReceiveAudio: 0,
    offerToReceiveVideo: 1
  });
  connection.setLocalDescription(offer);
}

async function WebRTCUniqueId() {
  if (typeof RTCPeerConnection == "undefined") throw new Error("This browser doesn't support WebRTC, so webRTC cannot provide a unique, static ID for this machine.");

  if (_id) return _id;

  const promise = new Promise((resolve, reject) => {
    startConnection();
    promises.push({ resolve, reject });
  });

  return promise;
}

module.exports = WebRTCUniqueId;
