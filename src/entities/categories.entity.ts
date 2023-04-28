import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Articles } from './articles.entity';

@Entity({ schema: 'arachne', name: 'Categories' })
export class Categories {
    @PrimaryGeneratedColumn({
        type: 'int',
        unsigned: true,
        name: 'category_id',
    })
    categoryId: number;

    @Column({ type: 'varchar', nullable: false })
    name: string;

    @CreateDateColumn({ nullable: true })
    readonly createdAt: Date;

    @UpdateDateColumn({ nullable: true })
    readonly updatedAt: Date;

    @DeleteDateColumn({ nullable: true, default: null })
    readonly deletedAt: Date | null;

    /*
        category - article : One to Many
    */
    @OneToMany(() => Articles, (articles) => articles.Categories)
    Articles: Articles[];
}
