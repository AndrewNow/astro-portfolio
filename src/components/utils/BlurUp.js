const images = document.querySelectorAll("img[data-src]");

const loadImage = (image) => {
  const src = image.getAttribute("data-src");
  if (!src) {
    return;
  }

  const img = new Image();
  img.onload = () => {
    image.setAttribute("src", src);
    image.removeAttribute("data-src");
    image.style.filter = "unset";
  };
  img.src = src;
};

images.forEach((image) => {
  loadImage(image);
});