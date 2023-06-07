import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    JoinColumn,
    JoinTable,
    ManyToMany,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Comments } from './comments.entity';
import { Users } from './users.entity';
import { Categories } from './categories.entity';
import { Likes } from './likes.entity';

@Entity({ schema: 'arachne', name: 'Articles' })
export class Articles {
    @PrimaryGeneratedColumn({ type: 'int', unsigned: true, name: 'article_id' })
    articleId: number;

    /*
        article - user : Many To One
    */
    @ManyToOne(() => Users, (users) => users.Articles, {
        onDelete: 'CASCADE',
        nullable: false,
    })
    @JoinColumn({ name: 'user_id' })
    Users: Users;

    @Column({ type: 'int', unsigned: true })
    user_id: number;

    @Column('varchar', { nullable: false })
    title: string;

    @Column('text', { nullable: false })
    content: string;

    @Column('int', { nullable: true, default: 0 })
    view: number;

    /*
        article - category : Many To One
        */
    @ManyToOne(() => Categories, (categories) => categories.Articles, {
        nullable: false,
    })
    @JoinColumn({ name: 'category_id' })
    Categories: Categories;

    @Column({ type: 'int', unsigned: true })
    category_id: number;

    @CreateDateColumn({ nullable: true, name: 'created_at' })
    readonly createdAt: Date;

    @UpdateDateColumn({ nullable: true, name: 'updated_at' })
    readonly updatedAt: Date;

    @DeleteDateColumn({ nullable: true, default: null, name: 'deleted_at' })
    readonly deletedAt: Date | null;

    /*
        article - comment : One To Many
    */
    @OneToMany(() => Comments, (comments) => comments.Articles)
    Comments: Comments[];

    /*
        article - like : One To Many
    */
    @OneToMany(() => Likes, (likes) => likes.Articles, {
        onDelete: 'CASCADE',
    })
    Likes: Likes[];

    /*
        article - user : Many To Many
    */
    @ManyToMany(() => Users, (users) => users.Likes, {
        onDelete: 'CASCADE',
    })
    LikesUsers: Users[];
}
