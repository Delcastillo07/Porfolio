function showSection(id) {
  document.querySelectorAll("section").forEach(sec => sec.classList.remove("active"));
  document.querySelector("header").style.display = "none";

  if (id === "home") {
    document.querySelector("header").style.display = "block";
  } else {
    document.getElementById(id).classList.add("active");
  }
}

let lightboxIndex = 0;
let lightboxImages = [];
let currentGallery = null;

function addImageToGallery(src, gallery, storageKey) {
  const item = document.createElement("div");
  item.classList.add("gallery-item");

  const img = document.createElement("img");
  img.src = src;
  img.addEventListener("click", () => openLightbox(src, gallery));

  const delBtn = document.createElement("button");
  delBtn.textContent = "✖";
  delBtn.classList.add("delete-btn");
  delBtn.onclick = () => {
    item.remove();
    let savedImages = JSON.parse(localStorage.getItem(storageKey)) || [];
    savedImages = savedImages.filter(i => i !== src);
    localStorage.setItem(storageKey, JSON.stringify(savedImages));
  };

  item.appendChild(img);
  item.appendChild(delBtn);
  gallery.appendChild(item);
}

function openLightbox(src, gallery) {
  document.getElementById("lightbox").style.display = "flex";
  document.getElementById("lightboxImg").src = src;

  lightboxImages = Array.from(gallery.querySelectorAll("img")).map(img => img.src);
  lightboxIndex = lightboxImages.indexOf(src);
  currentGallery = gallery;
}

function closeLightbox() {
  document.getElementById("lightbox").style.display = "none";
}

function changeImage(direction) {
  if (!currentGallery) return;
  lightboxIndex += direction;

  if (lightboxIndex < 0) lightboxIndex = lightboxImages.length - 1;
  if (lightboxIndex >= lightboxImages.length) lightboxIndex = 0;

  document.getElementById("lightboxImg").src = lightboxImages[lightboxIndex];
}

function handleImageUpload(inputId, galleryId, storageKey) {
  const input = document.getElementById(inputId);
  const gallery = document.getElementById(galleryId);
  let savedImages = JSON.parse(localStorage.getItem(storageKey)) || [];

  savedImages.forEach(src => addImageToGallery(src, gallery, storageKey));

  input.addEventListener("change", () => {
    Array.from(input.files).forEach(file => {
      const reader = new FileReader();
      reader.onload = e => {
        const imgSrc = e.target.result;
        addImageToGallery(imgSrc, gallery, storageKey);
        savedImages.push(imgSrc);
        localStorage.setItem(storageKey, JSON.stringify(savedImages));
      };
      reader.readAsDataURL(file);
    });
  });
}

handleImageUpload("resumeUpload", "resumeGallery", "resumeImages");
handleImageUpload("certUpload", "certGallery", "certImages");
handleImageUpload("projUpload", "projGallery", "projImages");

document.getElementById("profileUpload").addEventListener("change", function () {
  const file = this.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = e => {
      document.getElementById("profilePic").src = e.target.result;
      localStorage.setItem("profilePic", e.target.result);
    };
    reader.readAsDataURL(file);
  }
});

window.addEventListener("load", function () {
  const savedPic = localStorage.getItem("profilePic");
  if (savedPic) document.getElementById("profilePic").src = savedPic;

  const savedName = localStorage.getItem("profileName");
  if (savedName) {
    document.getElementById("profileName").textContent = savedName;
    document.getElementById("nameInput").value = savedName;
  }
});

document.getElementById("nameInput").addEventListener("input", function () {
  const name = this.value || "Jocelyn A. Del Castillo";
  document.getElementById("profileName").textContent = name;
  localStorage.setItem("profileName", name);
});
