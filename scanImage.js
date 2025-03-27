const dropbox = document.getElementById("dropbox");
const fileInput = document.getElementById("fileInput");
const preview = document.getElementById("preview");
const ocrResult = document.getElementById("ocr-result");
const convertBtn = document.getElementById("convert-btn");
let currentImageSrc = null;

dropbox.addEventListener("click", () => {
    fileInput.click();
});

dropbox.addEventListener("dragover", (event) => {
    event.preventDefault();
    dropbox.classList.add("dragover");
});

dropbox.addEventListener("dragleave", () => {
    dropbox.classList.remove("dragover");
});

dropbox.addEventListener("drop", (event) => {
    event.preventDefault();
    dropbox.classList.remove("dragover");
    handleFiles(event.dataTransfer.files);
});

fileInput.addEventListener("change", (event) => {
    handleFiles(event.target.files);
});

convertBtn.addEventListener("click", () => {
    console.log("Perform");
    if (currentImageSrc) {
        performOCR(currentImageSrc);
    } else {
        ocrResult.textContent = "Please upload an image first.";
        ocrResult.style.display = "block";
    }
});

function handleFiles(files) {
    if (files.length > 0 && files[0].type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
            console.log("Image loaded successfully.");
            preview.src = e.target.result;
            preview.style.display = "block";
            currentImageSrc = e.target.result;
        };
        reader.onerror = () => {
            console.error("Error loading image file.");
            ocrResult.textContent = "Error loading image file.";
            ocrResult.style.display = "block";
        };
        reader.readAsDataURL(files[0]);
    } else {
        console.error("Invalid file type.");
        ocrResult.textContent = "Please upload a valid image file.";
        ocrResult.style.display = "block";
    }
}

function performOCR(imageSrc) {
    ocrResult.textContent = "Processing...";
    ocrResult.style.display = "block";

    Tesseract.recognize(
        imageSrc,
        'eng',
        {
            logger: (m) => console.log(m)
        }
    ).then(({ data: { text } }) => {
        console.log("OCR Output:", text);
        ocrResult.textContent = text.trim() || "No text detected.";
        ocrResult.style.display = "block";
    }).catch((error) => {
        console.error("OCR Error: ", error);
        ocrResult.textContent = "Error processing image.";
        ocrResult.style.display = "block";
    });
}