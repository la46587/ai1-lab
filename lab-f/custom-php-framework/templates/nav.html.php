<?php
/** @var $router \App\Service\Router */

?>
<ul>
    <li><a href="<?= $router->generatePath('') ?>">Home</a></li>
    <li><a href="<?= $router->generatePath('post-index') ?>">Reviews</a></li>
    <li><a href="<?= $router->generatePath('post-index') ?>">Games</a></li>
</ul>
<?php
