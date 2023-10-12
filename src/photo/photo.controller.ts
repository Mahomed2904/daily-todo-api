import { Controller, Get, Post, Req, Res } from '@nestjs/common';
import { PhotoService } from './photo.service';

@Controller('photo')
export class PhotoController {
    constructor(private readonly photoService: PhotoService) {}

    @Post('upload')
    async uploadPhoto() {
        return '';
    }

    @Get(':photoId')
    async seePhoto(@Req() req, @Res() res) {
        return res.status(200).json(req.files);
    }
}
