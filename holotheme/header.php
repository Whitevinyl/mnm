<!doctype html>
<html <?php language_attributes(); ?> class="no-js">
	<head>
		<meta charset="<?php bloginfo('charset'); ?>">
		<title>Holoscene</title>

		<link href="//www.google-analytics.com" rel="dns-prefetch">
        <link href="<?php echo get_template_directory_uri(); ?>/img/icons/favicon.ico" rel="shortcut icon">
        <link href="<?php echo get_template_directory_uri(); ?>/img/icons/touch.png" rel="apple-touch-icon-precomposed">

		<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<meta name="description" content="<?php bloginfo('description'); ?>">

		<?php wp_head(); ?>
		<script>
        // conditionizr.com
        // configure environment tests
        conditionizr.config({
            assets: '<?php echo get_template_directory_uri(); ?>',
            tests: {}
        });
        </script>

		<script type="text/javascript" src="<?php echo get_template_directory_uri(); ?>/js/lib/tween.min.js"></script>
		<script type="text/javascript" src="<?php echo get_template_directory_uri(); ?>/js/lib/three.min.js"></script>
		<script type="text/javascript" src="<?php echo get_template_directory_uri(); ?>/js/lib/tombola.js"></script>
		<script type="text/javascript" src="<?php echo get_template_directory_uri(); ?>/js/lib/colorflex.js"></script>
		<script type="text/javascript" src="<?php echo get_template_directory_uri(); ?>/js/lib/perlin-simplex.js"></script>

		<script type="text/javascript" src="<?php echo get_template_directory_uri(); ?>/js/_UTILS.js"></script>
		<script type="text/javascript" src="<?php echo get_template_directory_uri(); ?>/js/_MAIN.js"></script>
		<script type="text/javascript" src="<?php echo get_template_directory_uri(); ?>/js/_METRICS.js"></script>
		<script type="text/javascript" src="<?php echo get_template_directory_uri(); ?>/js/_3D.js"></script>
		<script type="text/javascript" src="<?php echo get_template_directory_uri(); ?>/js/_GENERATE.js"></script>
		<script type="text/javascript" src="<?php echo get_template_directory_uri(); ?>/js/_DRAW.js"></script>
		<script type="text/javascript" src="<?php echo get_template_directory_uri(); ?>/js/_TWEENS.js"></script>

		<link href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:400,400i,700" rel="stylesheet">
		<link href="https://fonts.googleapis.com/css?family=Montserrat:300,400,500,600" rel="stylesheet">


	</head>
	<body onload="init()" onresize="metrics()">
