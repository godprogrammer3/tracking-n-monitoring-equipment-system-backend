import { Injectable, Logger } from '@nestjs/common';
import * as tf from '@tensorflow/tfjs-node';
import * as faceapi from '@vladmandic/face-api';
import * as fs from 'fs/promises';
import * as path from 'path';
const logger = new Logger('FaceRecognitionService');
@Injectable()
export class FaceRecognitionService {
  private faceMatcher: faceapi.FaceMatcher;
  private removeFile: Promise<any> | any;
  constructor() {
    this.initialFaceApi();
  }

  async initialFaceApi(): Promise<void> {
    const modelPath = path.resolve(__dirname, './models');
    await faceapi.nets.faceRecognitionNet.loadFromDisk(modelPath);
    await faceapi.nets.faceLandmark68Net.loadFromDisk(modelPath);
    await faceapi.nets.ssdMobilenetv1.loadFromDisk(modelPath);
    const faceImagesPath = path.resolve(__dirname, './face-images');
    const dirs: string[] = await fs.readdir(faceImagesPath);
    const referentFaces = [];
    for (const dir of dirs) {
      const files = await fs.readdir(path.join(faceImagesPath, dir));
      for (const fileName of files) {
        const file = await fs.readFile(
          path.join(path.join(faceImagesPath, dir), fileName),
        );
        const image = await this.parseImage(file);
        const result = await faceapi
          .detectSingleFace(image)
          .withFaceLandmarks()
          .withFaceDescriptor();
        referentFaces.push(result);
      }
    }
    this.faceMatcher = new faceapi.FaceMatcher(referentFaces, 0.6);
  }

  async parseImage(file: any): Promise<any> {
    const decoded = tf.node.decodeImage(file);
    const casted = decoded.toFloat();
    const result = casted.expandDims(0);
    decoded.dispose();
    casted.dispose();
    return result;
  }

  async validateFaceId(file: Express.Multer.File): Promise<any> {
    const image = await this.parseImage(file.buffer);
    const imageWithDescriptor = await faceapi
      .detectSingleFace(image)
      .withFaceLandmarks()
      .withFaceDescriptor();
    if (imageWithDescriptor) {
      return this.faceMatcher.findBestMatch(imageWithDescriptor.descriptor);
    } else {
      return { message: 'Face not found' };
    }
  }
}
