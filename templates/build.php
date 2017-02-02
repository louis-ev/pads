<!DOCTYPE html>
<html class="" lang="en">
  <?php
    echo $currentPage = basename($_SERVER["SCRIPT_FILENAME"], '.php');
    $allPages = array(
      'index' => 'Home',
      'web-basics' => '1. Web Basics',
      'formatting' => '- formatting'
    );
  ?>

  <?php require('snippets/head.php'); ?>

<body>

  <?php require('snippets/header.php'); ?>
  <?php require('snippets/menu.php'); ?>
  <?php require('snippets/editButton.php'); ?>

  <?php require('snippets/loadPad.php'); ?>

	</body>
</html>
