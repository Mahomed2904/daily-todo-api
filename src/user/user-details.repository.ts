import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UserDetails } from './user-details.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserDetailsRepository {
    constructor(
        @InjectRepository(UserDetails)
        private userDetailsRepository: Repository<UserDetails>,
    ) {}

    save(user: UserDetails) {
        return this.userDetailsRepository.save(user);
    }

    findById(id: string): Promise<UserDetails> {
        return this.userDetailsRepository.findOne({
            where: {
                userId: id,
            },
        });
    }

    findByEmail(email: string): Promise<UserDetails> {
        return this.userDetailsRepository.findOne({
            where: {
                user: {
                    email: email,
                },
            },
        });
    }
}
