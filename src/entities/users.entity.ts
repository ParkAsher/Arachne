import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    Index,
    JoinTable,
    ManyToMany,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Comments } from './comments.entity';
import { Articles } from './articles.entity';
import { Likes } from './likes.entity';

@Entity({ schema: 'arachne', name: 'Users' })
export class Users {
    @PrimaryGeneratedColumn({ type: 'int', unsigned: true, name: 'user_id' })
    userId: number;

    @Index({ unique: true })
    @Column('varchar', { nullable: false })
    id: string;

    @Column('varchar', { nullable: false })
    password: string;

    @Column('varchar', { nullable: false })
    name: string;

    @Index({ unique: true })
    @Column('varchar', { nullable: false })
    email: string;

    @Index({ unique: true })
    @Column('varchar', { nullable: false })
    nickname: string;

    @Index({ unique: true })
    @Column('varchar', { nullable: false })
    phone: string;

    @Column('varchar', { nullable: true, name: 'profile_img' })
    profileImg: string;

    @Column({ type: 'int', unsigned: true, nullable: false, default: 3 })
    role: number;

    @CreateDateColumn({ nullable: true, name: 'created_at' })
    readonly createdAt: Date;

    @UpdateDateColumn({ nullable: true, name: 'updated_at' })
    readonly updatedAt: Date;

    @DeleteDateColumn({ nullable: true, default: null, name: 'deleted_at' })
    readonly deletedAt: Date | null;

    /*
        user - comment : One To Many
    */
    @OneToMany(() => Comments, (comments) => comments.Users)
    Comments: Comments[];

    /*
        user - article : One To Many
    */
    @OneToMany(() => Articles, (articles) => articles.Users)
    Articles: Articles[];

    /*
        user - like : One To Many
    */
    @OneToMany(() => Likes, (likes) => likes.Users, {
        onDelete: 'CASCADE',
    })
    Likes: Likes[];

    /*
        user - article : Many To Many
        (Likes)
    */
    @ManyToMany(() => Articles, (articles) => articles.Likes, {
        onDelete: 'CASCADE',
    })
    LikesArticles: Articles[];
}
