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

    @Column('varchar', {
        nullable: true,
        default:
            'https://previews.123rf.com/images/virtosmedia/virtosmedia2303/virtosmedia230322242/200025658-%EC%9D%B4%EC%8A%AC%EC%9D%B4-%EB%A7%BA%ED%9E%8C-%EA%B1%B0%EB%AF%B8%EC%A4%84-3d-%EA%B7%B8%EB%A6%BC%EC%9E%85%EB%8B%88%EB%8B%A4.jpg',
    })
    profileImg: string;

    @Column({ type: 'int', unsigned: true, nullable: false, default: 3 })
    role: number;

    @CreateDateColumn({ nullable: true })
    readonly createdAt: Date;

    @UpdateDateColumn({ nullable: true })
    readonly updatedAt: Date;

    @DeleteDateColumn({ nullable: true, default: null })
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
        user - article : Many To Many
        (Likes)
    */
    @ManyToMany(() => Articles, (articles) => articles.LikesUsers)
    @JoinTable({
        name: 'Likes',
        joinColumn: {
            name: 'user_id',
            referencedColumnName: 'userId',
        },
        inverseJoinColumn: {
            name: 'article_id',
            referencedColumnName: 'articleId',
        },
    })
    LikesArticles: Articles[];
}
