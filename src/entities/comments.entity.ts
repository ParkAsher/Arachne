import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Users } from './users.entity';
import { Articles } from './articles.entity';

@Entity({ schema: 'arachne', name: 'Comments' })
export class Comments {
    @PrimaryGeneratedColumn({ type: 'int', unsigned: true, name: 'comment_id' })
    commentId: number;

    /*
        comment - article : Many To One
    */
    @ManyToOne(() => Articles, (articles) => articles.Comments, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'article_id' })
    Articles: Articles;

    /*
        comment - user : Many To One
    */
    @ManyToOne(() => Users, (users) => users.Comments, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'user_id' })
    Users: Users;

    @Column({ type: 'text', nullable: false })
    comment: string;

    @Column({ type: 'int', nullable: true, name: 'original_comment_id' })
    originalCommentId: number;

    @CreateDateColumn({ nullable: true, name: 'created_at' })
    readonly createdAt: Date;

    @UpdateDateColumn({ nullable: true, name: 'updated_at' })
    readonly updatedAt: Date;

    @DeleteDateColumn({ nullable: true, default: null, name: 'deleted_at' })
    readonly deletedAt: Date | null;
}
