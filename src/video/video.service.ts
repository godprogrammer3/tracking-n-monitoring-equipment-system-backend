import { Injectable } from '@nestjs/common';
import * as cv from 'opencv4nodejs'
@Injectable()
export class VideoService {

    private camera: cv.VideoCapture;

    getFrame(): string {
        if(!this.camera){
            this.camera = new cv.VideoCapture('/dev/video0');
        }
        const frame = this.camera.read();   
        const image = cv.imencode('.jpg', frame).toString('base64');
        return image;
    }

    releaseCamera(): void {
        this.camera.release();
        this.camera = null;
    }
}
