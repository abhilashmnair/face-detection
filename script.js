const video = document.getElementById("video");

Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('models'),
    faceapi.nets.faceExpressionNet.loadFromUri('models')
]).then(beginVideo);

async function beginVideo(){
    stream = null;
    try{
         stream = await navigator.mediaDevices.getUserMedia({ audio:false,video:true });
         video.srcObject = stream;
    } catch(err){
        alert("Unable to connect to camera or device not found!");
        console.log(err);
    }
}

video.addEventListener('play',function () {
        const canvas = faceapi.createCanvasFromMedia(video);
        document.body.append(canvas);
        const dimensions = { width: canvas.width, height: canvas.height };
        faceapi.matchDimensions(video, dimensions);

        setInterval(async function () {
            const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions();
            const resizedDetections = faceapi.resizeResults(detections, dimensions);

            canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
            faceapi.draw.drawDetections(canvas, resizedDetections);
            faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
            faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
        }, 100);
    });