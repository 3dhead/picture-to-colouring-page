if (window.location.host !== null && navigator.serviceWorker != null) {
  navigator.serviceWorker
    .register("service-worker.js")
    .then(function (registration) {
      console.log("Registered events at scope: ", registration.scope);
    })
    .catch((error) => {
      console.error("Failed to register service worker", error);
    });
}

const allowDrop = (event) => {
  event.preventDefault();
};

const extractFromGoogleImagesDrop = (dataTransfer) => {
  const uriList = dataTransfer.getData("text/uri-list");
  const url = new URL(uriList);

  if (!url.hostname === "www.google.com") {
    return "";
  }

  if (url.pathname === "/url" && url.searchParams.get("source") === "images") {
    const htmlData = dataTransfer.getData("text/html");
    const parser = new DOMParser();
    const imageDoc = parser.parseFromString(htmlData, "text/html");
    const image = imageDoc.querySelector("img");
    return image.src;
  }

  if (url.pathname === "/imgres") {
    return url.searchParams.get("imgurl");
  }
};

const getImageUrl = (dataTransfer) => {
  if (!dataTransfer) {
    return "";
  }

  const googleImagesImageUrl = extractFromGoogleImagesDrop(dataTransfer);

  if (googleImagesImageUrl) {
    return googleImagesImageUrl;
  }

  const text = dataTransfer.getData("text");
  if (text) {
    return text;
  }

  const uriList = dataTransfer.getData("text/uri-list");

  if (uriList) {
    return uriList;
  }

  return "";
};

const drop = (event) => {
  event.preventDefault();
  const imageUrl = getImageUrl(event.dataTransfer);
  const imageElement = document.getElementById("image");
  imageElement.src = imageUrl;
  imageElement.className = "bright";

  messageElement = document.getElementById("drop-message-box");
  messageElement.className = "hidden";
};

const reset = (event) => {
  event.preventDefault();
  const imageElement = document.getElementById("image");
  imageElement.className = "hidden";
  delete imageElement.style.opacity;

  messageElement = document.getElementById("drop-message");
  messageElement.className = "";
};

const updateOpacity = (event) => {
  const newOpacity = 1 - parseFloat(event.target.value, 10);
  const imageElement = document.getElementById("image");
  imageElement.style.opacity = newOpacity;
};

const print = (event) => {
  event.preventDefault();
  window.print();
};
