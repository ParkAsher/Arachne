import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Users } from './users.entity';
import { Articles } from './articles.entity';

@Entity({ schema: 'arachne', name: 'Likes' })
export class Likes {
    @PrimaryColumn({
        type: 'int',
        unsigned: true,
        name: 'article_id',
        generated: false,
    })
    articleId: number;

    @PrimaryColumn({
        type: 'int',
        unsigned: true,
        name: 'user_id',
        generated: false,
    })
    userId: number;

    /*
      article - user : Many To One
  */
    @ManyToOne(() => Users, (users) => users.Likes, {
        onDelete: 'CASCADE',
        nullable: false,
    })
    @JoinColumn({ name: 'user_id' })
    Users: Users;

    /*
      article - category : Many To One
      */
    @ManyToOne(() => Articles, (articles) => articles.Likes, {
        onDelete: 'CASCADE',
        nullable: false,
    })
    @JoinColumn({ name: 'article_id' })
    Articles: Articles;
}
