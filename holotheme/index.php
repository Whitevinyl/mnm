<?php get_header(); ?>

	<div id='app'>
		<canvas id='main' class='unselectable'></canvas>
	</div>


	<div id='wrapper'>

		<div id='intro'>

			<div id='ttWrap' class='hide'>
				<div id='tt'>
					<div class='spaceRow'>
						<div class='spaceBlock'></div>
					</div>

					<h1>Holoscene</h1>

					<div class='spaceRow'>
						<div class='spaceBlock'></div>
					</div>
				</div>
			</div>

			<div class='italic hide reveal'>
			  	<?php
				$page = get_page_by_title( 'Intro' );
				$content = apply_filters('the_content', $page->post_content);
				echo $content;
				?>
			</div>

		</div>

		<div id='introArrowWrap'class='hide'>
			<div id='introArrow'>
				<SVG width="50" height ="35">
					<path d="M0 10 L25 35 L50 10 L40 10 L25 25 L10 10  z" fill="currentColor"></path>
				</SVG>
			</div>
		</div>

	</div>


	<div id='content'>


		<div id='videoWrap'>
			<div class='single block'>
				<div class='italic'>
					<?php
					$page = get_page_by_title( 'Video' );
					$content = apply_filters('the_content', $page->post_content);
					echo $content;
					?>
				</div>
				<div class='spaceBlock2'></div>
			</div><div class='double block'>
				<div id='video'>
					<iframe width="560" height="315" src="https://www.youtube.com/embed/itFJDsxI2xs?start=6&autohide=1&showinfo=0&controls=0" frameborder="0" allowfullscreen></iframe>
				</div>
			</div>
		</div>

<?php get_footer(); ?>
