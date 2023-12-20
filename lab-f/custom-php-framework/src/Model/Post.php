<?php
namespace App\Model;

use App\Service\Config;

class Post
{
    private ?int $id = null;
    private ?string $reviewName = null;
    private ?string $reviewText = null;
    private ?int $reviewRating = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function setId(?int $id): Post
    {
        $this->id = $id;

        return $this;
    }

    public function getReviewName(): ?string
    {
        return $this->reviewName;
    }

    public function setReviewName(?string $reviewName): Post
    {
        $this->reviewName = $reviewName;

        return $this;
    }

    public function getReviewText(): ?string
    {
        return $this->reviewText;
    }

    public function setReviewText(?string $reviewText): Post
    {
        $this->reviewText = $reviewText;

        return $this;
    }

    public function getReviewRating():?int{
        return $this->reviewRating;
    }

    public function setReviewRating(?int $reviewRating):Post{
        $this->reviewRating=$reviewRating;
        return $this;
    }

    public static function fromArray($array): Post
    {
        $post = new self();
        $post->fill($array);

        return $post;
    }

    public function fill($array): Post
    {
        if (isset($array['id']) && ! $this->getId()) {
            $this->setId($array['id']);
        }
        if (isset($array['reviewName'])) {
            $this->setReviewName($array['reviewName']);
        }
        if (isset($array['reviewText'])) {
            $this->setReviewText($array['reviewText']);
        }
        if (isset($array['reviewRating'])) {
            $this->setReviewRating($array['reviewRating']);
        }

        return $this;
    }

    public static function findAll(): array
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        $sql = 'SELECT * FROM post';
        $statement = $pdo->prepare($sql);
        $statement->execute();

        $posts = [];
        $postsArray = $statement->fetchAll(\PDO::FETCH_ASSOC);
        foreach ($postsArray as $postArray) {
            $posts[] = self::fromArray($postArray);
        }

        return $posts;
    }

    public static function find($id): ?Post
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        $sql = 'SELECT * FROM post WHERE id = :id';
        $statement = $pdo->prepare($sql);
        $statement->execute(['id' => $id]);

        $postArray = $statement->fetch(\PDO::FETCH_ASSOC);
        if (! $postArray) {
            return null;
        }
        $post = Post::fromArray($postArray);

        return $post;
    }

    public function save(): void
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        if (! $this->getId()) {
            $sql = "INSERT INTO post (reviewName, reviewText, reviewRating) VALUES (:reviewName, :reviewText, :reviewRating)";
            $statement = $pdo->prepare($sql);
            $statement->execute([
                ':reviewName' => $this->getReviewName(),
                'reviewRating' => $this->getReviewRating(),
                ':reviewText' => $this->getReviewText()
            ]);

            $this->setId($pdo->lastInsertId());
        } else {
            $sql = "UPDATE post SET reviewName = :reviewName, reviewText = :reviewText, reviewRating = :reviewRating WHERE id = :id";
            $statement = $pdo->prepare($sql);
            $statement->execute([
                ':reviewName' => $this->getReviewName(),
                'reviewRating' => $this->getReviewRating(),
                'reviewText' => $this->getReviewText(),
                ':id' => $this->getId(),
            ]);
        }
    }

    public function delete(): void
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        $sql = "DELETE FROM post WHERE id = :id";
        $statement = $pdo->prepare($sql);
        $statement->execute([
            ':id' => $this->getId(),
        ]);

        $this->setId(null);
        $this->setReviewName(null);
        $this->setReviewText(null);
        $this->setReviewRating(null);
    }
}
