<?php
    /** @var $post ?\App\Model\Post */
?>

<div class="form-group">
    <label for="name">Review name</label>
    <input type="text" id="subject" name="post[reviewName]" value="<?= $post ? $post->getReviewName() : '' ?>">
</div>

<div class="form-group">
    <label for="reviewText">Text</label>
    <textarea id="content" name="post[reviewText]"><?= $post? $post->getReviewText() : '' ?></textarea>
</div>

<div class="form-group">
    <label for="reviewRating">Review rating</label>
    <input type="text" id="reviewRating" name="post[reviewRating]" value="<?= $post ? $post->getReviewRating() : '' ?>"
</div>

<div class="form-group">
    <label></label>
    <input type="submit" value="Submit">
</div>
