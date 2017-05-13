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
      'dynamic_page' => '5.Dynamic pages',
      'CMS' => '6.CMS',
      'drawing' => '7.Drawing',
      'patterns' => '~ layouts',
      'drawing-patterns' => '~ drawings',
      'experiments' => '~ experiments',
      'references' => 'references',
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
