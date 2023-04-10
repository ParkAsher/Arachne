import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity({ schema: 'arachne', name: 'Articles' })
export class Articles {
    @PrimaryGeneratedColumn({ type: 'int', unsigned: true, name: 'article_id' })
    articleId: number;

    @Column('varchar', { nullable: false })
    title: string;

    @Column('text', { nullable: false })
    content: string;

    @Column('int', { nullable: true, default: 0 })
    view: string;

    @Column('tinyint', { nullable: false })
    categoryId: string;

    @CreateDateColumn({ nullable: true })
    readonly createdAt: Date;

    @UpdateDateColumn({ nullable: true })
    readonly updatedAt: Date;

    @DeleteDateColumn({ nullable: true, default: null })
    readonly deletedAt: Date | null;
}
