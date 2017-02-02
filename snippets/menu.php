<nav tabindex="0">
  <select onchange="location = this.value;">
    <?php foreach($allPages as $uri => $pagename): ?>
		  <option value="<?= $uri ?>.php" <?php if($currentPage === $uri) echo 'selected'; ?>><?= $pagename; ?></option>
		<?php endforeach; ?>
	</select>
</nav>
