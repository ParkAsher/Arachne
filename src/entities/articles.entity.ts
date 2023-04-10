import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    JoinColumn,
    ManyToMany,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Comments } from './comments.entity';
import { Users } from './users.entity';
import { Categories } from './categories.entity';

@Entity({ schema: 'arachne', name: 'Articles' })
export class Articles {
    @PrimaryGeneratedColumn({ type: 'int', unsigned: true, name: 'article_id' })
    articleId: number;

    /*
        article - user : Many To One
    */
    @ManyToOne(() => Users, (users) => users.Articles, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'user_id' })
    Users: Users;

    @Column('varchar', { nullable: false })
    title: string;

    @Column('text', { nullable: false })
    content: string;

    @Column('int', { nullable: true, default: 0 })
    view: string;

    /*
        article - category : Many To One
    */
    @ManyToOne(() => Categories, (categories) => categories.Articles)
    @JoinColumn({ name: 'category_id' })
    Categories: Categories;

    @CreateDateColumn({ nullable: true })
    readonly createdAt: Date;

    @UpdateDateColumn({ nullable: true })
    readonly updatedAt: Date;

    @DeleteDateColumn({ nullable: true, default: null })
    readonly deletedAt: Date | null;

    /*
        article - comment : One To Many
    */
    @OneToMany(() => Comments, (comments) => comments.Articles)
    Comments: Comments[];

    /*
        article - user : Many To Many
    */
    @ManyToMany(() => Users, (users) => users.LikesArticles, {
        onDelete: 'CASCADE',
    })
    LikesUsers: Users[];
}
