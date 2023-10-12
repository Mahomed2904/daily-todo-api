import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FilterParams } from './dtos/list-user.dto';
import { ExternalUser } from './external-user.entity';
import { User } from './user.entity';
import { UserRepository } from './user.repository';

@Injectable()
export class ExternalUserRepository {
    constructor(
        @InjectRepository(ExternalUser)
        private externalUsersRepository: Repository<ExternalUser>,
        private userRepository: UserRepository,
    ) {}

    findAll(params: FilterParams): Promise<ExternalUser[]> {
        const data = this.externalUsersRepository
            .createQueryBuilder('user')
            .where('user.name like :name', { name: `%${params.name}%` })
            .limit(params.maxSize)
            .getMany();
        return data;
    }

    async save(externalUser: ExternalUser) {
        if (!externalUser.userId) {
            const user = new User();
            await this.userRepository.save(user);
            externalUser.user = user;
            externalUser.userId = user.id;
        }
        return await this.externalUsersRepository.save(externalUser);
    }

    findById(id: string): Promise<ExternalUser> {
        return this.externalUsersRepository.findOne({
            where: {
                userId: id,
            },
        });
    }

    findByEmail(email: string): Promise<ExternalUser> {
        return this.externalUsersRepository.findOne({
            where: {
                email: email,
            },
        });
    }
}
