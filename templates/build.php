<!DOCTYPE html>
<html class="" lang="en">
  <?php
    $currentPage = basename($_SERVER["SCRIPT_FILENAME"], '.php');
    $allPages = array(
      'index' => 'Home',
      'web-basics' => '1.Web Basics',
      'content'=> '2.Content',
      'presentation' => '3.Presentation',
      'layout' => '4.Layout',
      'multipage_and_CMS' => '5.Dynamic pages',
      'patterns' => 'Patterns',
      'references' => 'References',
      'formatting' => '- formatting',
    );
  ?>

  <?php require('snippets/head.php'); ?>

<body class="page-<?= $currentPage; ?>">

  <?php require('snippets/header.php'); ?>
  <?php require('snippets/menu.php'); ?>
  <?php require('snippets/editButton.php'); ?>

  <?php require('snippets/loadPad.php'); ?>

	</body>
</html>
