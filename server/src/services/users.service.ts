import { CreateUserDto, IUser, UpdateUserDto } from '@ewn/types/users.type';
import { UsersRepository } from '../repositories/users.repo';

export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async createUser(createUserDto: CreateUserDto): Promise<IUser> {
    const user = this.usersRepository.create(createUserDto);
    return await this.usersRepository.save(user);
  }

  async findAllUsers({
    limit,
    offset,
  }: {
    limit: number;
    offset: number;
  }): Promise<IUser[]> {
    return this.usersRepository.find({ limit, offset });
  }

  async findUserById(id: string): Promise<IUser | null> {
    return this.usersRepository.findOne(id);
  }

  async findUserByEmail(email: string): Promise<IUser | null> {
    return this.usersRepository.findOneByQuery('email', email);
  }

  async findUserByUsername(username: string): Promise<IUser | null> {
    return this.usersRepository.findOneByQuery('username', username);
  }

  async updateUser(
    id: string,
    updateUserDto: UpdateUserDto
  ): Promise<IUser | null> {
    await this.usersRepository.update(id, updateUserDto);
    return this.usersRepository.findOne(id);
  }

  async deleteUser(id: string): Promise<void> {
    await this.usersRepository.delete(id);
  }
}
