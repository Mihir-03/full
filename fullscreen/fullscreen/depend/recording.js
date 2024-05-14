
	// JavaScript logic
	let recording = false;
	let isPlaying = false
	let videoBlob = null;
	let mediaRecorder;
	let stream;
	let cameraPermission = false;
	let elapsedTime = 0;
	let file;
	let fileTrimmed;
	let devices = [];
	let activeDeviceIndex = 0;
	let isFrontCamera = true;
	let interval;
	let videoUrl = null;
	let mediaDevice = null;
	let recordedDuration = 0;
	let ffmpeg;
	let isScriptLoaded = false;
	let isTrim = false;
	let trimmedVideoUrl;
	const cameraHeight = 1440;
	const cameraWidth = 2560;

	const cameraLowResHeight = 1080;
	const cameraLowResWidth = 1920;

	const ratio = { width: 1920, height: 1080 };

	const mobileRatio = { width: 1920, height: 1080 };

	const container = document.getElementById("container");
	const video = document.getElementById("video");
	const record = document.getElementById("record");
	const recordingText = document.getElementById("recording-text");
	const recordButton = document.getElementById("record-button");
	const videoHeader = document.getElementById("video-header");
	const flipCameraIcon = document.getElementById("flip-camera-icon");
	const recordedVideo = document.getElementById("recorded");
	const playerContainer = document.getElementById("player-container");
	const playerControls = document.getElementById("player-controls");
	const playIcon = document.getElementById("play-icon");
	const pauseIcon = document.getElementById("pause-icon");
	const cancelIcon = document.getElementById("cancel-icon");
	const checkIcon = document.getElementById("check-icon");
	const slider = document.getElementById("slider");
	const trimContainer = document.getElementById("trim-icon-container")
	const sliderRangeI = document.getElementById('slider-range-i');
	const sliderRangeF = document.getElementById('slider-range-f');
  const amount = document.getElementById('amount');
  const trimIcon = document.getElementById("trim-icon")
  const nextStage = document.getElementById("record-info")
  const recordInfoContainer = document.querySelector(".record-info-container")
  const recordedInfoRecord = document.getElementById("recorded-info-record")
  
	let minValue = 0;
	let maxValue = 0;
	console.log(minValue, "minValue", maxValue);
	const isMobile =
	  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
		navigator.userAgent
	  );
	  const isSamsung =
  /Samsung/.test(navigator.userAgent) && !window.MSStream;
	async function startRecording() {
	  try {
		video.srcObject = stream;
		mediaRecorder = new MediaRecorder(stream);
		const chunks = [];

		mediaRecorder.ondataavailable = (e) => {
		  chunks.push(e.data);
		};

		mediaRecorder.onstop = () => {
		  const blob = new Blob(chunks, { type: "video/mp4" });
		  videoBlob = blob;

		  if (chunks.length > 0) {
			const firstChunkBlob = new Blob([chunks[0]], {
			  type: "video/mp4",
			});
			file = new File([firstChunkBlob], "video.mp4", {
			  type: "video/mp4",
			});
		  }
		};

		mediaRecorder.start();
		recording = true;
		//   setStream(stream);
		const startTime = Date.now();
		recordedDuration = elapsedTime;
		interval = setInterval(() => {
		  elapsedTime = Math.floor((Date.now() - startTime) / 1000);
		  recordingText.style = "display: block";
		  recordingText.innerText = formatTime(elapsedTime);
		}, 1000);
		setTimeout(() => {
		  clearInterval(interval);
		  mediaRecorder.stop();
		  recording = false;
		  stream.getTracks().forEach((track) => track.stop());
		  
		  
		  recordButton.className = "start-record";

		setTimeout(() => {
		  video.style.display = "none";
		  record.style.display = "none";
		  recordedVideo.style.display = "block";
		  playerContainer.style.display = "block";
		  playerControls.style.display = "flex";
		  if (isIOS) {
			recordedVideo.src = file && URL.createObjectURL(file);
		  } else {
			recordedVideo.src = videoBlob && URL.createObjectURL(videoBlob);
		  }
		  recordedVideo.pause();
		  recordedDuration = elapsedTime;
		  recordingText.style.display = "none";
		  elapsedTime = 0;
		}, isIOS ? 1000 : 200);
		}, 600000); // 10 minutes
	  } catch (error) {
		console.error("Error accessing user media:", error);
		if (
		  error.name === "NotAllowedError" ||
		  error.name === "PermissionDeniedError"
		) {
		  alert(
			"Camera permission denied. Please grant permission to record videos."
		  );
		}
	  }
	}

	// Recoded Video play
	async function playVideo() {
		isPlaying = true
	  trimIcon.classList.add('grey-out');
	  if (isTrim) {
		if (!isIOS) {
		  const blobUrl = URL.createObjectURL(file);
		  recordedVideo.src = blobUrl + `#t=${minValue},${maxValue}`;
		}
		if(isIOS){
		  recordedVideo.src = trimmedVideoUrl;
		}
		setTimeout(
		  () => {
			pauseVideo();
		  },
		  minValue > 0 ? (maxValue - minValue) * 1000 : maxValue * 1000
		);
	  }
	  recordedVideo.play();
	  playIcon.style.display = "none";
	  pauseIcon.style.display = "block";
	}

	// Recoded Video pause
	async function pauseVideo() {
	  recordedVideo.pause();
	  isPlaying = false
	  trimIcon.classList.remove('grey-out');
	  playIcon.style.display = "block";
	  pauseIcon.style.display = "none";
	}

	// Recoded Video end
   recordedVideo.addEventListener("ended", function () {
	  isPlaying = false
	  trimIcon.classList.remove('grey-out');
	  playIcon.style.display = "block";
	  pauseIcon.style.display = "none";
	});

	// Trim functionality

	async function onTrim() {
	if(isPlaying){
		return
	  }
	  playIcon.style.display = "none";
	  pauseIcon.style.display = "none";
	  cancelIcon.style.display = "none";
	  slider.style.display = "block";
	  checkIcon.style.display = "block";
	  isTrim = true;
	  minValue = 0;
	  console.log(recordedDuration, "recordedDuration");
	//   $(function () {
	//     $("#slider-range").slider({
	//       range: true,
	//       min: minValue,
	//       max: recordedDuration || 100,
	//       step: 1,
	//       values: [0, recordedDuration || 50],
	//       slide: function (event, ui) {
	//         // Update variables with slider values
	//         // minValue = ui.values[0];
	//         maxValue = ui.values[1];
	//         // if (maxValue > 2) {
	//           $("#amount").text(minValue + " sec - " + maxValue + " sec");
	//         // }
	//       },
	//     });
	//     $(".ui-slider-handle:first").addClass("ui-state-disabled").hide() ;
	//     // Initialize variables with initial slider values
	//     // minValue = $("#slider-range").slider("values", 0);
	//     maxValue = $("#slider-range").slider("values", 1);
	//     // if (maxValue > 2) {
	//       $("#amount").text(minValue + " sec - " + maxValue + " sec");
	//     // }
	//   });
	sliderRangeI.value = 0;
	sliderRangeF.value = recordedDuration;

	sliderRangeI.max = recordedDuration - 1 || 100; // Change 100 to your desired default maximum value
	sliderRangeI.min = 0; // Change 100 to your desired default maximum value

	sliderRangeF.min = 1; // Change 100 to your desired default maximum value
	sliderRangeF.max = recordedDuration || 100; // Change 100 to your desired default maximum value
	// Set the initial position of the slider to its maximum value
	amount.textContent  = "trim from sec " + sliderRangeI.value + " to " + sliderRangeF.value;

	function updateTrimVisuals() {
		const start = parseInt(sliderRangeI.value);
		const end = parseInt(sliderRangeF.value);

		if (start >= end) {
			sliderRangeI.value = end - 1;
			return;
		}

		amount.textContent  = "trim from sec " + sliderRangeI.value + " to " + sliderRangeF.value;	  
	}

	sliderRangeI.addEventListener('input', updateTrimVisuals);
	sliderRangeF.addEventListener('input', updateTrimVisuals);

  sliderRangeI.addEventListener('input', function() {
	const value = this.value;
	minValue = value
  });

  sliderRangeF.addEventListener('input', function() {
	const value = this.value;
	maxValue = value
  });
	}

	function toggleRecording() {
	  if (!recording && !videoBlob) {
		recordButton.className = "animate-size";
		flipCameraIcon.style.display = "none";
		startRecording();
	  } else {
		recordButton.className = "start-record";
		clearInterval(interval);
		mediaRecorder.stop();
		recording = false;

		stream.getTracks().forEach((track) => track.stop());
		setTimeout(() => {
		  nextStage.disabled = false;
		  video.style.display = "none";
		  record.style.display = "none";
		  recordedVideo.style.display = "block";
		  playerContainer.style.display = "block";
		  playerControls.style.display = "flex";
		  if (isIOS) {
			recordedVideo.src = file && URL.createObjectURL(file);
		  } else {
			recordedVideo.src = videoBlob && URL.createObjectURL(videoBlob);
		  }
		  recordedVideo.pause();
		  recordedDuration = elapsedTime;
		  recordingText.style.display = "none";
		  elapsedTime = 0;
		}, isIOS ? 1000 : 200);
	  }
	}

	function flipCamera() {
	  try {
		if (isIOS) {
		  devices = devices?.filter((device) =>
			["Front Camera", "Back Camera"]?.includes(device?.label)
		  );
		}
		if(isSamsung){
		  devices = devices?.filter((device) =>
			["camera2 1, facing front", "camera2 2, facing back"]?.includes(device?.label)
		  );
		}
		let newIndex = (activeDeviceIndex + 1) % devices.length;
		navigator.mediaDevices
		  .enumerateDevices()
		  .then(function (allDevices) {
			const videoDevices = allDevices.filter(
			  (device) => device.kind === "videoinput"
			);
			devices = videoDevices;
			if (isIOS) {
			  devices = devices?.filter((device) =>
				["Front Camera", "Back Camera"]?.includes(device?.label)
			  );
			  newIndex = isNaN(newIndex) ? 1 : newIndex;
			}
			if(isSamsung){
			  devices = devices?.filter((device) =>
				["camera2 1, facing front", "camera2 2, facing back"]?.includes(device?.label)
			  );
			}
			isFrontCamera = devices[newIndex]?.label.includes("Front");
			if (isFrontCamera) {
			  video.style.transform = "scaleX(-1)";
			} else {
			  video.style.transform = "none";
			}
			if (stream && !isIOS) {
			  stream.getTracks().forEach(track => {
				track.stop();
			  });
			}
			return navigator.mediaDevices.getUserMedia({
			  video: {
				deviceId: devices[newIndex].deviceId,
				width: isMobile ? mobileRatio?.width : ratio.width,
				height: isMobile ? mobileRatio?.height : ratio.height,
			  },
			  audio: true,
			});
		  })
		  .then((newStream) => {
			stream = newStream;
			video.srcObject = stream;
			activeDeviceIndex = newIndex;
		  });
	  } catch (error) {
		console.error("Error flipping camera:", error);
	  }
	}

	function formatTime(time) {
	  const minutes = Math.floor(time / 60);
	  const seconds = time % 60;
	  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds} - 10:00`;
	}

	function updateCameraDevices() {
	  navigator.mediaDevices.enumerateDevices().then(function (devices) {
		const videoDevices = devices.filter(
		  (device) => device.kind === "videoinput"
		);
		devices = videoDevices;
		isFrontCamera = devices[activeDeviceIndex]?.label.includes("front");
		if (isFrontCamera) {
		  // container.style.transform = "none";
		} else {
		  // container.style.transform = "scaleX(-1)";
		  // flipCameraIcon.style.transform = "unset"
		}
	  });
	}

	function getDefaultDevice(devices, device) {
	  devices.reduce((acc, val) => {
		if (val.deviceId === device) {
		  // @ts-ignore
		  if (val?.getCapabilities) {
			// @ts-ignore
			acc.push({ ...val.getCapabilities(), label: val.label });
		  } else {
			acc.push(val);
		  }
		}
		return acc;
	  }, []);
	}

	const isIOS =
	  /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

	if (isMobile) {
	  const idealWidth = 1280; // Adjust this value as needed
	  const idealHeight = 720; // Adjust this value as needed
	  navigator.mediaDevices.enumerateDevices().then((iosDevices) => {
		devices = iosDevices.filter((d) => d.kind === "videoinput");
		console.log(devices, "devices");
	  });
	  navigator.mediaDevices
		.getUserMedia({
		  video: {
			width: { ideal: idealWidth },
			height: { ideal: idealHeight },
		  },
		  audio: true,
		})
		.then((newStream) => {
		  stream = newStream;
		  video.srcObject = stream;
		  cameraPermission = true;
		  updateCameraDevices();
		})
		.catch((error) => {
		  console.error("Error accessing user media:", error);
		  if (
			error.name === "NotAllowedError" ||
			error.name === "PermissionDeniedError"
		  ) {
			alert(
			  "Camera permission denied. Please grant permission to record videos."
			);
		  }
		});
	} else if (isIOS) {
	  navigator.mediaDevices.enumerateDevices().then((iosDevices) => {
		devices = iosDevices.filter((d) => d.kind === "videoinput");
		// console.log(,'iosDevices');

		const resolution = (cameraLowResWidth, cameraLowResWidth);
		const deviceCapabilites = getDefaultDevice(devices, mediaDevice);
		const constraints = {
		  audio: false,
		  video: {
			deviceId: devices[0].deviceId,
			width: { ideal: resolution },
			height: { ideal: cameraHeight },
		  },
		};

		navigator.mediaDevices
		  .getUserMedia(constraints)
		  .then((newStream) => {
			stream = newStream;
			video.srcObject = stream;
			cameraPermission = true;
			updateCameraDevices();
		  })
		  .catch((error) => {
			console.error("Error accessing user media:", error);
			if (
			  error.name === "NotAllowedError" ||
			  error.name === "PermissionDeniedError"
			) {
			  alert(
				"Camera permission denied. Please grant permission to record videos."
			  );
			}
		  });
		console.log(deviceCapabilites, "deviceCapabilites");
	  });
	} else {
	  navigator.mediaDevices.enumerateDevices().then((iosDevices) => {
		devices = iosDevices.filter((d) => d.kind === "videoinput");
		console.log(devices, "devices");
	  });
	  navigator.mediaDevices
		.getUserMedia({
		  video: {
			width: ratio.width,
			height: ratio.height,
		  },
		  audio: true,
		})
		.then((newStream) => {
		  stream = newStream;
		  video.srcObject = stream;
		  cameraPermission = true;
		  updateCameraDevices();
		})
		.catch((error) => {
		  console.error("Error accessing user media:", error);
		  if (
			error.name === "NotAllowedError" ||
			error.name === "PermissionDeniedError"
		  ) {
			alert(
			  "Camera permission denied. Please grant permission to record videos."
			);
		  }
		});
	}
	async function loadScript(src) {
	  return new Promise((resolve, reject) => {
		const script = document.createElement("script");
		script.src = src;
		script.onload = resolve;
		script.onerror = reject;
		document.head.appendChild(script);
	  });
	}

	async function handleTrim() {
	  if (!file) {
		console.error("No file selected.");
		return;
	  }
	  if (isIOS) {
		const totalBytes = file.size;
		const startByte = (minValue / recordedDuration) * totalBytes;
		const endByte = (maxValue / recordedDuration) * totalBytes;
		const videoData = file.slice(startByte, endByte, file.type);
		const trimmedVideoBlob = new Blob([videoData], { type: file.type });
		fileTrimmed = new File([trimmedVideoBlob], file.name, { type: file.type });
		trimmedVideoUrl = URL.createObjectURL(trimmedVideoBlob);
		recordedVideo.src = trimmedVideoUrl;
		recordedVideo.pause();
		playIcon.style.display = "block";
		pauseIcon.style.display = "none";
		checkIcon.style.display = "none";
		slider.style.display = "none";
	  }else{
	  try {
		const blobUrl = URL.createObjectURL(file);
		recordedVideo.src = blobUrl + `#t=${minValue},${maxValue}`;
		
		let blob = new Blob([videoBlob], { type: "video/mp4" });
		



		let blobTrimmed = blob.slice(startByte, endByte, 'video/mp4');
		
		// Crear un objeto File a partir del Blob recortado
		let fileTrimmed = new File([blobTrimmed], 'trimmed_video.mp4', { type: 'video/mp4' });
		
		console.log("minval " + minValue);
		console.log("maxnval " + maxValue);
		console.log(file);
		console.log(blob);
		console.log(blobTrimmed);
		console.log(fileTrimmed);
		
		
		recordedVideo.pause();
		playIcon.style.display = "block";
		pauseIcon.style.display = "none";
		checkIcon.style.display = "none";
		slider.style.display = "none";
	  } catch (error) {
		console.error("Error while trimming video:", error);
	  }
	  }
	}

	
	function setRecordInfo() {
		if(file){
		  recordedVideo.style.display = "none";
		  playerContainer.style.display = "none";
		  playerControls.style.display = "none";
		  recordInfoContainer.style.display = "block"
		  nextStage.style.display = "none"
		  recordedInfoRecord.style.display = "block"
		  if (!isIOS) {
			const blobUrl = URL.createObjectURL(file);
			recordedInfoRecord.src = blobUrl + `#t=${minValue},${maxValue}`;
		  }
		  if(isIOS){
			recordedInfoRecord.src = trimmedVideoUrl;
		  }
		}
	
	  }
	
	  document.getElementById('record-form').addEventListener('submit', () => {
		event.preventDefault()
	
		console.log(file)
		console.log(fileTrimmed)
		console.log(URL.createObjectURL(fileTrimmed));
		
		let formData = new FormData()
		formData.append('title', document.querySelector('#record-form #record-title').value);
		formData.append('keywords', document.querySelector('#record-form #record-keywords').value);
		formData.append('duration', Math.floor(recordedDuration));
		formData.append('record', typeof fileTrimmed === "object" ? fileTrimmed : file);
		let fetchOptions = {
			method: 'POST',
			body: formData
		}
	
	
		if(!Array.from(document.querySelectorAll('#record-form input, #record-form textarea')).some((e) => e == '')){
			fetch('./backend/post-record.php', fetchOptions)
			  .then((response) => {
				if (response.ok) {
				  return response.json();
				}
			  }).then((data) =>{
				//   if(data.redirect){
				// 	window.location.href = `profile-user.php`
				//   }
				  if(data.error){
					alert('Oops...\nSomething went wrong')
				  }
			  })
		}else{
			alert('Please comply with all the requeriments');
		}
	  })
	  

	setInterval(updateCameraDevices, 5000);
  