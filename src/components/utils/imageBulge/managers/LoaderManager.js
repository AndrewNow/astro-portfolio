import { Texture } from 'ogl';

class LoaderManager {
  constructor() {
    this.assets = {}; // Dictionary of assets, can be different type, gltf, texture, img, font, feel free to make a Enum if using TypeScript
  }

  get(name) {
    return this.assets[name];
  }

  load = (data, gl) =>
    // load assets. check each item in the data array
    new Promise((resolve) => {
      const promises = [];
      for (let i = 0; i < data.length; i++) {
        const { texture } = data[i];
        if (texture && !this.assets[texture]) {
          promises.push(this.loadTexture(texture, gl));
        }
      }
      Promise.all(promises).then(() => resolve());
    });

  loadTexture(url, gl) {
    // if an asset is not loaded yet, load it
    if (!this.assets[url]) {
      this.assets[url] = {};
    }
    return new Promise((resolve) => {
      const image = new Image(); // create a new image
      const texture = new Texture(gl); // create a texture

      image.onload = () => {
        texture.image = image; // assign the texture to the image
        this.assets[url] = texture;
        resolve(image);
      };

      image.src = url;
    });
  }
}

export default new LoaderManager();
