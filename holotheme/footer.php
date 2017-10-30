			<div id='signUpWrap'>
				<!--<div id='signUp'>you@email</div>
				<span class='italic'>Sign up for updates</span>-->

				<form id='submitForm' action="https://tinyletter.com/holoscene" method="post" target="popupwindow" onsubmit="window.open('https://tinyletter.com/holoscene', 'popupwindow', 'scrollbars=yes,width=800,height=600');return true">
				    <p><input type="text" name="email" placeholder="you@email" id="tlemail" /></p><input type="hidden" value="1" name="embed"/><input type="submit" value="Subscribe" id="tlsubmit" />
				    <p class='clear italic'><label for="tlemail">Sign up for occasional updates</label></p>
				</form>
			</div>


			<div id='footLinks'>

				<div id='footEmail' >

					<div class='footLink'>
						<a class='footLinkA' href='mailto:info@holoscene.io' >info@holoscene.io</a>
						<div class='linkLine'></div>
					</div>

				</div>

				<div id='footSocial' >

					<div class='footLink'>
						<a class='footLinkA' href='https://twitter.com/holosceneltd' target='_blank' >twitter</a>
						<div class='linkLine'></div>
					</div>

					<div class='footLink'>
						<a class='footLinkA' href='https://www.facebook.com/Holoscene-1912477332341908/' target='_blank' >facebook</a>
						<div class='linkLine'></div>
					</div>

				</div>

			</div>

		</div>
		<!-- /content -->

		<?php wp_footer(); ?>

		<!-- analytics -->
		<!--<script>
		(function(f,i,r,e,s,h,l){i['GoogleAnalyticsObject']=s;f[s]=f[s]||function(){
		(f[s].q=f[s].q||[]).push(arguments)},f[s].l=1*new Date();h=i.createElement(r),
		l=i.getElementsByTagName(r)[0];h.async=1;h.src=e;l.parentNode.insertBefore(h,l)
		})(window,document,'script','//www.google-analytics.com/analytics.js','ga');
		ga('create', 'UA-XXXXXXXX-XX', 'yourdomain.com');
		ga('send', 'pageview');
		</script>-->

		<script>
		(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
		(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
		m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
		})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
		ga('create', 'UA-100334807-1', 'auto');
		ga('send', 'pageview');
		</script>

	</body>
</html>
