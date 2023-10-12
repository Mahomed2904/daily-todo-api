import { Module } from '@nestjs/common';
import { PhotoController } from './photo.controller';
import { PhotoService } from './photo.service';
// import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    // imports: [TypeOrmModule.forFeature([])],
    controllers: [PhotoController],
    providers: [PhotoService],
})
export class PhotoModule {}
