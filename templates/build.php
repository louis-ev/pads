<!DOCTYPE html>
<html class="" lang="en">
  <?php
    $currentPage = basename($_SERVER["SCRIPT_FILENAME"], '.php');
    $allPages = array(
      'index' => 'Home',
      'web-basics' => '1. Web Basics',
      'web-layout' => '2. Web Layout',
      'references' => 'References',
      'formatting' => '- formatting',
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
