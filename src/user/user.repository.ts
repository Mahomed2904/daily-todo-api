import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FilterParams } from './dtos/list-user.dto';
import { User } from './user.entity';

@Injectable()
export class UserRepository {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) {}

    findAll(params: FilterParams): Promise<User[]> {
        const data = this.usersRepository
            .createQueryBuilder('user')
            .where('user.name like :name', { name: `%${params.name}%` })
            .limit(params.maxSize)
            .getMany();
        return data;
    }

    save(user: User) {
        return this.usersRepository.save(user);
    }

    findById(id: string): Promise<User> {
        return this.usersRepository.findOne({
            where: {
                id: id,
            },
        });
    }
}
