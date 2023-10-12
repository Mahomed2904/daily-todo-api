import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InternalUser } from './internal-user.entity';
import { Repository } from 'typeorm';
import { FilterParams } from './dtos/list-user.dto';
import { UserRepository } from './user.repository';
import { User } from './user.entity';

@Injectable()
export class InternalUserRepository {
    constructor(
        @InjectRepository(InternalUser)
        private internalUsersRepository: Repository<InternalUser>,
        private userRepository: UserRepository,
    ) {}

    findAll(params: FilterParams): Promise<InternalUser[]> {
        const data = this.internalUsersRepository
            .createQueryBuilder('user')
            .where('user.name like :name', { name: `%${params.name}%` })
            .limit(params.maxSize)
            .getMany();
        return data;
    }

    async save(internalUser: InternalUser) {
        if (!internalUser.userId) {
            const user = new User();
            const savedUser = await this.userRepository.save(user);
            internalUser.user = savedUser;
            internalUser.userId = savedUser.id;
        }
        return await this.internalUsersRepository.save(internalUser);
    }

    findById(id: string): Promise<InternalUser> {
        return this.internalUsersRepository.findOne({
            where: {
                userId: id,
            },
        });
    }

    findByEmail(email: string): Promise<InternalUser> {
        return this.internalUsersRepository.findOne({
            where: {
                email: email,
            },
        });
    }
}
