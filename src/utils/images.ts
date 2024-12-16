import { IMGBB_KEY } from '../constants/config';
import { size, difference, split } from 'lodash';
import imgbbUploader from 'imgbb-uploader';
import sharp from 'sharp';

export const uploadImage = async (image: string): Promise<string> => {
  try {
    if (image === undefined || image === null || image === '') return null;
    let img = image;
    if (size(split(image, 'base64,')) === 2) {
      img = split(image, 'base64,')[1];
    };
    
    const sharpImg = sharp(Buffer.from(img, 'base64'));
    const optImg = await sharpImg.jpeg({ mozjpeg: true }).toBuffer();

    const tmp = await imgbbUploader({
      apiKey: IMGBB_KEY,
      base64string: optImg.toString('base64')
    });

    return tmp.url;
  } catch (error) {
    throw (error);
  }
}

export const updateImages = async (images: string[], oldImages: string[]): Promise<string[]> => {
  try {
    const newImages: string[] = [];
    const addImages = difference(images, oldImages);
    for (let i = 0; i < size(images); i++) {
      const img = images[i];
      if (addImages.indexOf(img) > - 1) {
        newImages[i] = await uploadImage(images[i]);
      } else {
        newImages[i] = img;
      }
    }
    return newImages;
  } catch (error) {
    throw (error);
  }
}